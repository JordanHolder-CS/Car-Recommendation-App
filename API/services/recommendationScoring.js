const {
  PASSENGER_SPACE_RULES,
  VEHICLE_SIZE_RULES,
  CITY_BODY_STYLE_SCORES,
  COMFORT_BODY_STYLE_SCORES,
  PRACTICAL_BODY_STYLE_SCORES,
  PERFORMANCE_BODY_STYLE_SCORES,
  COMMUTE_BODY_STYLE_SCORES,
  ROAD_TRIP_BODY_STYLE_SCORES,
  FAMILY_BODY_STYLE_SCORES,
  BALANCED_BODY_STYLE_SCORES,
  HIGH_END_PRICE_THRESHOLD,
  MATCH_SCORE_MIN_FACTORS,
  MATCH_SCORE_MAX_FACTORS,
  MATCH_SCORE_TARGET_WEIGHT,
  MATCH_SCORE_SECONDARY_FACTOR,
  SPECIAL_METRICS,
  LOWER_IS_BETTER_METRICS,
} = require("./recommendationConfig");

// This module encapsulates all scoring-specific behavior. `recommendationService`
// injects data-access and formatting helpers, while this file focuses on:
// - preparing metric ranges,
// - computing normalized/special scores,
// - building user-facing reasons,
// - ranking cars.
const createRecommendationScoring = ({
  getMetricValue,
  normalizeText,
  formatStat,
  formatCurrency,
  hasBudgetCap,
  isLuxuryBrand,
  getKnownPrice,
}) => {
  const METRIC_LABELS = {
    acceleration: "Acceleration",
    balancedFit: "Balanced fit",
    bootSpace: "Boot space",
    cityFit: "City fit",
    comfort: "Comfort / refinement",
    comfortFit: "Comfort fit",
    commuteFit: "Commute fit",
    dailyFit: "Daily-use fit",
    drivetrain: "Drivetrain fit",
    economy: "Fuel economy",
    familyFit: "Family fit",
    horsepower: "Horsepower",
    insurance: "Insurance costs",
    luxuryFit: "Luxury fit",
    performanceFit: "Performance fit",
    powerToWeight: "Power-to-weight",
    practicalFit: "Practicality fit",
    range: "Driving range",
    reliability: "Reliability",
    roadTripFit: "Road-trip fit",
    runningCostFit: "Running-cost fit",
    seating: "Seating",
    serviceCost: "Service costs",
    sizeFit: "Size fit",
    spaceFit: "Passenger / space fit",
    techFit: "Technology fit",
    workFit: "Work fit",
  };

  const formatMetricLabel = (key) =>
    METRIC_LABELS[key] ||
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (value) => value.toUpperCase());

  // Build dynamic min/max ranges only for metrics relevant to the active
  // scoring weights, plus any dependent metrics required by composite fits.
  const buildRanges = (cars, weightKeys) => {
    const ranges = {};
    const rangeKeys = new Set(weightKeys);
    if (
      rangeKeys.has("spaceFit") ||
      rangeKeys.has("sizeFit") ||
      rangeKeys.has("cityFit") ||
      rangeKeys.has("commuteFit") ||
      rangeKeys.has("familyFit") ||
      rangeKeys.has("balancedFit")
    ) {
      rangeKeys.add("curbWeight");
      rangeKeys.add("seating");
      rangeKeys.add("bootSpace");
    }
    if (
      rangeKeys.has("runningCostFit") ||
      rangeKeys.has("commuteFit") ||
      rangeKeys.has("dailyFit")
    ) {
      rangeKeys.add("economy");
      rangeKeys.add("price");
      rangeKeys.add("serviceCost");
    }
    if (
      rangeKeys.has("comfortFit") ||
      rangeKeys.has("techFit") ||
      rangeKeys.has("roadTripFit") ||
      rangeKeys.has("balancedFit")
    ) {
      rangeKeys.add("price");
      rangeKeys.add("comfort");
    }
    if (
      rangeKeys.has("practicalFit") ||
      rangeKeys.has("workFit") ||
      rangeKeys.has("familyFit") ||
      rangeKeys.has("roadTripFit")
    ) {
      rangeKeys.add("bootSpace");
      rangeKeys.add("seating");
    }
    if (rangeKeys.has("performanceFit") || rangeKeys.has("balancedFit")) {
      rangeKeys.add("horsepower");
      rangeKeys.add("acceleration");
      rangeKeys.add("powerToWeight");
      rangeKeys.add("curbWeight");
    }
    if (
      rangeKeys.has("commuteFit") ||
      rangeKeys.has("roadTripFit") ||
      rangeKeys.has("workFit") ||
      rangeKeys.has("familyFit") ||
      rangeKeys.has("dailyFit") ||
      rangeKeys.has("balancedFit")
    ) {
      rangeKeys.add("reliability");
    }
    if (rangeKeys.has("roadTripFit")) {
      rangeKeys.add("range");
    }
    if (rangeKeys.has("workFit")) {
      rangeKeys.add("serviceCost");
    }
    rangeKeys.forEach((key) => {
      const values = cars
        .map((car) => getMetricValue(car, key))
        .filter((value) => value !== null && Number.isFinite(value));
      ranges[key] = values.length
        ? { min: Math.min(...values), max: Math.max(...values) }
        : null;
    });
    return ranges;
  };
  const normalizeMetric = (value, range, higherIsBetter = true) => {
    if (value === null || !range) return 0;
    if (range.max === range.min) return 1;
    const normalized = (value - range.min) / (range.max - range.min);
    return higherIsBetter ? normalized : 1 - normalized;
  };
  const averageScores = (scores = []) => {
    const validScores = scores.filter(
      (score) => score !== null && Number.isFinite(score),
    );
    return validScores.length
      ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
      : 0;
  };
  const getCoreWeightEntries = (weights = {}) => {
    const sortedWeights = Object.entries(weights)
      .filter(([, weight]) => Number.isFinite(weight) && weight > 0)
      .sort(([, weightA], [, weightB]) => weightB - weightA);
    const coreEntries = [];
    let coreWeight = 0;

    for (const [key, weight] of sortedWeights) {
      if (
        coreEntries.length < MATCH_SCORE_MIN_FACTORS ||
        (coreWeight < MATCH_SCORE_TARGET_WEIGHT &&
          coreEntries.length < MATCH_SCORE_MAX_FACTORS)
      ) {
        coreEntries.push([key, weight]);
        coreWeight += weight;
        continue;
      }
      break;
    }

    return {
      coreEntries,
      coreWeight: Number(coreWeight.toFixed(4)),
    };
  };
  // Keeps matchScore more stable by normalizing against the strongest weighted
  // factors rather than all factors equally.
  const getMatchScoreNormalizer = (weights = {}) => {
    const { coreWeight } = getCoreWeightEntries(weights);
    if (!coreWeight) return 1;
    return Number(
      (coreWeight + (1 - coreWeight) * MATCH_SCORE_SECONDARY_FACTOR).toFixed(4),
    );
  };
  const calculateMatchScore = (score, normalizer = 1) => {
    if (!Number.isFinite(score)) return null;
    if (!Number.isFinite(normalizer) || normalizer <= 0) {
      return Number(score.toFixed(4));
    }
    return Number(Math.min(1, score / normalizer).toFixed(4));
  };
  const matchRuleScore = (value, rules = [], fallback = null) => {
    if (value === null || value === undefined || value === "") return fallback;
    for (const rule of rules) {
      if (rule.terms?.some((term) => value.includes(term))) return rule.score;
      if (!rule.terms) {
        const meetsMin = rule.min === undefined || value >= rule.min;
        const meetsMax = rule.max === undefined || value <= rule.max;
        if (meetsMin && meetsMax) return rule.score;
      }
    }
    return fallback;
  };
  // Composite metrics (cityFit, performanceFit, etc.) are computed from
  // multiple base signals and user context instead of raw DB fields.
  const getSpecialMetricScore = (car, key, context = {}) => {
    const {
      answers = {},
      criteria = {},
      useCase,
      intent,
      ranges = {},
    } = context;
    const bodyStyle = normalizeText(car.body_style);
    const scoreRuleFactors = (rule) => {
      if (!rule) return 0;
      const scores = rule.factors
        .map((factor) => {
          if (factor.type === "bodyStyle") {
            return matchRuleScore(
              bodyStyle,
              factor.scores,
              factor.fallback ?? null,
            );
          }
          if (factor.type === "bands") {
            return matchRuleScore(
              getMetricValue(car, factor.key),
              factor.bands,
              0,
            );
          }
          if (factor.type === "metric") {
            return normalizeMetric(
              getMetricValue(car, factor.key),
              ranges[factor.key],
              factor.direction !== "lower",
            );
          }
          if (factor.type === "midMetric") {
            const normalizedValue = normalizeMetric(
              getMetricValue(car, factor.key),
              ranges[factor.key],
              true,
            );
            if (normalizedValue === null || !Number.isFinite(normalizedValue)) {
              return null;
            }
            return Math.max(0, 1 - Math.abs(normalizedValue - 0.5) * 2);
          }
          return null;
        })
        .filter((score) => score !== null && Number.isFinite(score));
      return averageScores(scores);
    };
    const scoreDrivetrainFit = () => {
      const drivetrain = normalizeText(car.drivetrain);
      if (intent === "performance" || useCase === "weekend") {
        return drivetrain.includes("rwd") || drivetrain.includes("awd")
          ? 1
          : 0.5;
      }
      if (
        useCase === "long_distance" ||
        intent === "comfort" ||
        intent === "luxury"
      ) {
        if (drivetrain.includes("awd")) return 1;
        if (drivetrain.includes("fwd")) return 0.75;
        return 0.65;
      }
      if (
        useCase === "family" ||
        useCase === "work" ||
        intent === "practicality"
      ) {
        if (drivetrain.includes("awd")) return 1;
        if (drivetrain.includes("fwd")) return 0.85;
        return 0.65;
      }
      return drivetrain.includes("fwd") ? 1 : 0.6;
    };
    const scoreCityFit = () =>
      averageScores([
        matchRuleScore(bodyStyle, CITY_BODY_STYLE_SCORES, 0.6),
        normalizeMetric(
          getMetricValue(car, "curbWeight"),
          ranges.curbWeight,
          false,
        ),
      ]);
    const scoreRunningCostFit = () =>
      averageScores([
        normalizeMetric(getMetricValue(car, "economy"), ranges.economy, true),
        normalizeMetric(getMetricValue(car, "price"), ranges.price, false),
        normalizeMetric(
          getMetricValue(car, "serviceCost"),
          ranges.serviceCost,
          false,
        ),
      ]);
    const scoreComfortFit = () =>
      averageScores([
        matchRuleScore(bodyStyle, COMFORT_BODY_STYLE_SCORES, 0.4),
        normalizeMetric(getMetricValue(car, "price"), ranges.price, true),
      ]);
    const scorePracticalFit = () =>
      averageScores([
        matchRuleScore(bodyStyle, PRACTICAL_BODY_STYLE_SCORES, 0.35),
        normalizeMetric(
          getMetricValue(car, "bootSpace"),
          ranges.bootSpace,
          true,
        ),
        normalizeMetric(getMetricValue(car, "seating"), ranges.seating, true),
      ]);
    const scoreSpaceFit = () => {
      const rule = PASSENGER_SPACE_RULES[answers.passengers_space];
      return scoreRuleFactors(rule);
    };
    const scoreSizeFit = () => {
      const rule = VEHICLE_SIZE_RULES[answers.vehicle_size];
      return scoreRuleFactors(rule);
    };
    const scoreTechFit = () =>
      normalizeMetric(getMetricValue(car, "comfort"), ranges.comfort, true);
    const scorePerformanceFit = () =>
      averageScores([
        matchRuleScore(bodyStyle, PERFORMANCE_BODY_STYLE_SCORES, 0.35),
        normalizeMetric(
          getMetricValue(car, "horsepower"),
          ranges.horsepower,
          true,
        ),
        normalizeMetric(
          getMetricValue(car, "acceleration"),
          ranges.acceleration,
          false,
        ),
        normalizeMetric(
          getMetricValue(car, "powerToWeight"),
          ranges.powerToWeight,
          true,
        ),
        scoreDrivetrainFit(),
      ]);
    const scoreCommuteFit = () =>
      averageScores([
        matchRuleScore(bodyStyle, COMMUTE_BODY_STYLE_SCORES, 0.55),
        scoreCityFit(),
        scoreRunningCostFit(),
        scoreComfortFit(),
        normalizeMetric(
          getMetricValue(car, "reliability"),
          ranges.reliability,
          true,
        ),
      ]);
    const scoreRoadTripFit = () =>
      averageScores([
        matchRuleScore(bodyStyle, ROAD_TRIP_BODY_STYLE_SCORES, 0.5),
        scoreComfortFit(),
        normalizeMetric(getMetricValue(car, "range"), ranges.range, true),
        normalizeMetric(
          getMetricValue(car, "bootSpace"),
          ranges.bootSpace,
          true,
        ),
        normalizeMetric(
          getMetricValue(car, "reliability"),
          ranges.reliability,
          true,
        ),
      ]);
    const scoreWorkFit = () =>
      averageScores([
        scorePracticalFit(),
        normalizeMetric(
          getMetricValue(car, "bootSpace"),
          ranges.bootSpace,
          true,
        ),
        normalizeMetric(
          getMetricValue(car, "serviceCost"),
          ranges.serviceCost,
          false,
        ),
        normalizeMetric(
          getMetricValue(car, "reliability"),
          ranges.reliability,
          true,
        ),
      ]);
    const scoreFamilyFit = () =>
      averageScores([
        matchRuleScore(bodyStyle, FAMILY_BODY_STYLE_SCORES, 0.5),
        scoreSpaceFit(),
        scorePracticalFit(),
        normalizeMetric(
          getMetricValue(car, "reliability"),
          ranges.reliability,
          true,
        ),
      ]);
    const scoreDailyFit = () =>
      averageScores([
        scoreCommuteFit(),
        scoreRunningCostFit(),
        scoreSpaceFit(),
        normalizeMetric(
          getMetricValue(car, "reliability"),
          ranges.reliability,
          true,
        ),
      ]);
    const scoreBalancedFit = () =>
      averageScores([
        matchRuleScore(bodyStyle, BALANCED_BODY_STYLE_SCORES, 0.55),
        scorePerformanceFit(),
        scoreComfortFit(),
        normalizeMetric(
          getMetricValue(car, "reliability"),
          ranges.reliability,
          true,
        ),
        scoreTechFit(),
      ]);
    const metricScorers = {
      drivetrain: scoreDrivetrainFit,
      cityFit: scoreCityFit,
      runningCostFit: scoreRunningCostFit,
      comfortFit: scoreComfortFit,
      practicalFit: scorePracticalFit,
      spaceFit: scoreSpaceFit,
      sizeFit: scoreSizeFit,
      techFit: scoreTechFit,
      performanceFit: scorePerformanceFit,
      commuteFit: scoreCommuteFit,
      roadTripFit: scoreRoadTripFit,
      workFit: scoreWorkFit,
      familyFit: scoreFamilyFit,
      dailyFit: scoreDailyFit,
      balancedFit: scoreBalancedFit,
    };
    if (key === "luxuryFit") {
      if (isLuxuryBrand(car.brand_name)) return 1;
      const price = getKnownPrice(car);
      if (
        (answers.ownership_intent === "q9_luxury" || intent === "luxury") &&
        !hasBudgetCap(criteria) &&
        price !== null &&
        price >= HIGH_END_PRICE_THRESHOLD
      ) {
        return 0.6;
      }
      return 0;
    }
    return metricScorers[key]?.() ?? 0;
  };
  const getRuleDetailText = (detailKey, car, bodyStyle) => {
    if (detailKey === "bodyStyle") return bodyStyle || null;
    if (detailKey === "curbWeight") {
      const weight = getMetricValue(car, "curbWeight");
      return weight !== null ? `curb weight ${formatStat(weight)}` : null;
    }
    if (detailKey === "seating") {
      const seats = getMetricValue(car, "seating");
      return seats !== null ? `${formatStat(seats)} seats` : null;
    }
    if (detailKey === "bootSpace") {
      const bootSpace = getMetricValue(car, "bootSpace");
      return bootSpace !== null ? `${formatStat(bootSpace)}L boot space` : null;
    }
    return null;
  };
  const buildRuleBasedReason = (rule, car, bodyStyle) => {
    if (!rule) return null;
    const details = rule.details
      .map((detailKey) => getRuleDetailText(detailKey, car, bodyStyle))
      .filter(Boolean);
    return details.length ? `${rule.label}: ${details.join(", ")}` : rule.label;
  };
  const getReasonText = (key, car, context = {}) => {
    const { answers = {}, criteria = {} } = context;
    const bodyStyle =
      typeof car.body_style === "string" && car.body_style.trim()
        ? car.body_style
            .trim()
            .split(/[\s/-]+/)
            .map(
              (part) =>
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
            )
            .join(" ")
        : "";
    const metricReasonBuilders = {
      economy: () => {
        const mpg = getMetricValue(car, "economy");
        return mpg !== null ? `${formatStat(mpg)} MPG` : "good fuel economy";
      },
      range: () => {
        const range = getMetricValue(car, "range");
        return range !== null
          ? `${formatStat(range)} miles of range`
          : "good driving range";
      },
      reliability: () => {
        const reliability = getMetricValue(car, "reliability");
        return reliability !== null
          ? `reliability score of ${formatStat(reliability, 1)}`
          : "strong reliability";
      },
      horsepower: () => {
        const horsepower = getMetricValue(car, "horsepower");
        return horsepower !== null
          ? `${formatStat(horsepower)} hp`
          : "strong performance";
      },
      powerToWeight: () => {
        const horsepower = getMetricValue(car, "horsepower");
        const curbWeight = getMetricValue(car, "curbWeight");
        return horsepower !== null && curbWeight !== null
          ? `${formatStat(horsepower)} hp with curb weight ${formatStat(curbWeight)}`
          : "strong power-to-weight balance";
      },
      acceleration: () => {
        const acceleration = getMetricValue(car, "acceleration");
        return acceleration !== null
          ? `0-60 mph in ${formatStat(acceleration, 1)}s`
          : "quick acceleration";
      },
      bootSpace: () => {
        const bootSpace = getMetricValue(car, "bootSpace");
        return bootSpace !== null
          ? `${formatStat(bootSpace)}L boot space`
          : "useful boot space";
      },
      seating: () => {
        const seats = getMetricValue(car, "seating");
        return seats !== null
          ? `${formatStat(seats)} seats`
          : "fits your seating needs";
      },
      serviceCost: () => "lower servicing costs",
      insurance: () => "lower insurance costs",
    };
    if (metricReasonBuilders[key]) return metricReasonBuilders[key]();
    if (key === "cityFit") {
      if ((context.rawScore ?? 0) < 0.55) return null;
      return bodyStyle
        ? `${bodyStyle} body style for urban driving`
        : "well suited to city driving";
    }
    if (key === "drivetrain") {
      const drivetrain = normalizeText(car.drivetrain);
      return drivetrain
        ? `${drivetrain.toUpperCase()} drivetrain`
        : "suits your driving style";
    }
    if (key === "comfort") {
      const modelYear = getMetricValue(car, "comfort");
      return modelYear !== null
        ? `newer model year ${Math.round(modelYear)}`
        : "good comfort fit";
    }
    if (key === "runningCostFit") {
      const price = getMetricValue(car, "price");
      const mpg = getMetricValue(car, "economy");
      if (price !== null && mpg !== null) {
        return `${formatCurrency(price)} with ${formatStat(mpg)} MPG`;
      }
      if (price !== null) return `good value at ${formatCurrency(price)}`;
      if (mpg !== null) return `${formatStat(mpg)} MPG and low running costs`;
      return "strong running-cost fit";
    }
    if (key === "comfortFit") {
      if ((context.rawScore ?? 0) < 0.55) return null;
      const price = getMetricValue(car, "price");
      return bodyStyle
        ? `${bodyStyle} comfort fit${
            price !== null ? ` around ${formatCurrency(price)}` : ""
          }`
        : "comfort-oriented body style";
    }
    if (key === "luxuryFit") {
      if (isLuxuryBrand(car.brand_name)) {
        return `${car.brand_name} luxury marque`;
      }
      if (
        answers.ownership_intent === "q9_luxury" &&
        !hasBudgetCap(criteria) &&
        (getKnownPrice(car) ?? 0) >= HIGH_END_PRICE_THRESHOLD
      ) {
        return `high-end price point of ${formatCurrency(getKnownPrice(car))}`;
      }
      return null;
    }
    if (key === "practicalFit") {
      if ((context.rawScore ?? 0) < 0.55) return null;
      const bootSpace = getMetricValue(car, "bootSpace");
      if (bodyStyle && bootSpace !== null) {
        return `${bodyStyle} practicality with ${formatStat(bootSpace)}L cargo space`;
      }
      if (bootSpace !== null) return `${formatStat(bootSpace)}L cargo space`;
      return bodyStyle
        ? `${bodyStyle} practical body style`
        : "strong practicality fit";
    }
    if (key === "spaceFit") {
      const rule = PASSENGER_SPACE_RULES[answers.passengers_space];
      if (!rule || (context.rawScore ?? 0) < rule.reasonThreshold) return null;
      return buildRuleBasedReason(rule, car, bodyStyle);
    }
    if (key === "sizeFit") {
      const rule = VEHICLE_SIZE_RULES[answers.vehicle_size];
      if (!rule || (context.rawScore ?? 0) < rule.reasonThreshold) return null;
      return buildRuleBasedReason(rule, car, bodyStyle);
    }
    if (key === "techFit") {
      const modelYear = getMetricValue(car, "comfort");
      return modelYear !== null
        ? `newer tech-friendly model year ${Math.round(modelYear)}`
        : "better technology fit";
    }
    const thresholdReasons = {
      performanceFit: {
        withBodyStyle: `${bodyStyle} performance fit`,
        fallback: "strong performance fit",
      },
      commuteFit: {
        withBodyStyle: `${bodyStyle} daily-commute fit`,
        fallback: "good commute fit",
      },
      roadTripFit: {
        withBodyStyle: `${bodyStyle} road-trip fit`,
        fallback: "strong long-distance comfort fit",
      },
      workFit: {
        withBodyStyle: `${bodyStyle} workhorse fit`,
        fallback: "strong work-use fit",
      },
      familyFit: {
        withBodyStyle: `${bodyStyle} family fit`,
        fallback: "strong family-car fit",
      },
      dailyFit: { fallback: "strong everyday-driver fit" },
      balancedFit: { fallback: "balanced comfort and performance" },
    };
    if (thresholdReasons[key]) {
      if ((context.rawScore ?? 0) < 0.55) return null;
      return bodyStyle && thresholdReasons[key].withBodyStyle
        ? thresholdReasons[key].withBodyStyle
        : thresholdReasons[key].fallback;
    }
    return null;
  };
  // Produces weighted contributions per metric and top human-readable reasons.
  const scoreCar = (
    car,
    weights,
    ranges,
    displayRanges,
    matchScoreNormalizer,
    useCase,
    intent,
    answers,
    criteria,
    includeReasons = true,
  ) => {
    const getWeightedMetricScore = (metricKey, activeRanges = ranges) => {
      if (LOWER_IS_BETTER_METRICS.has(metricKey)) {
        return normalizeMetric(
          getMetricValue(car, metricKey),
          activeRanges[metricKey],
          false,
        );
      }
      if (SPECIAL_METRICS.has(metricKey)) {
        return getSpecialMetricScore(car, metricKey, {
          answers,
          criteria,
          useCase,
          intent,
          ranges: activeRanges,
        });
      }
      return normalizeMetric(
        getMetricValue(car, metricKey),
        activeRanges[metricKey],
        true,
      );
    };
    const priorityKeys = new Set(
      getCoreWeightEntries(weights).coreEntries.map(([key]) => key),
    );
    const contributions = Object.entries(weights).map(([key, weight]) => {
      const value = getWeightedMetricScore(key);
      return {
        key,
        weight,
        rawScore: value,
        value: value * weight,
      };
    });
    const score = Number(
      contributions.reduce((sum, item) => sum + item.value, 0).toFixed(4),
    );
    const sortedContributions = [...contributions].sort((a, b) => b.value - a.value);
    const recommendationBreakdown = sortedContributions.map((item) => {
      const displayRawScore = getWeightedMetricScore(item.key, displayRanges);
      const fitScore = Math.max(
        0,
        Math.min(100, Math.round(displayRawScore * 100)),
      );
      const impactPercent =
        score > 0 && item.value > 0
          ? Math.max(1, Math.round((item.value / score) * 100))
          : 0;
      const reason = getReasonText(item.key, car, {
        answers,
        criteria,
        rawScore: item.rawScore,
      });

      return {
        key: item.key,
        label: formatMetricLabel(item.key),
        fitScore,
        impactPercent,
        priority: priorityKeys.has(item.key),
        weight: Number(item.weight.toFixed(4)),
        contribution: Number(item.value.toFixed(4)),
        note: [impactPercent ? `${impactPercent}% impact` : null, reason]
          .filter(Boolean)
          .join(" | "),
      };
    });

    return {
      score,
      matchScore: calculateMatchScore(score, matchScoreNormalizer),
      recommendationBreakdown,
      topReasons: includeReasons
        ? sortedContributions
            .map((item) =>
              getReasonText(item.key, car, {
                answers,
                criteria,
                rawScore: item.rawScore,
              }),
            )
            .filter(
              (reason, index, list) => reason && list.indexOf(reason) === index,
            )
            .slice(0, 3)
        : [],
    };
  };
  const buildScoredCars = (
    cars,
    weights,
    matchScoreNormalizer,
    useCase,
    intent,
    profileLabel,
    answers,
    criteria,
    includeReasons = true,
    comparisonCars = cars,
  ) => {
    const ranges = buildRanges(cars, Object.keys(weights));
    const displayRanges = buildRanges(comparisonCars, Object.keys(weights));
    return cars.map((car) => ({
      ...car,
      ...scoreCar(
        car,
        weights,
        ranges,
        displayRanges,
        matchScoreNormalizer,
        useCase,
        intent,
        answers,
        criteria,
        includeReasons,
      ),
      useCase,
      intent,
      profileLabel,
      primaryDriverType: useCase,
    }));
  };
  const getBudgetGap = (car, maxPrice) => {
    const price = getKnownPrice(car);
    if (price === null || maxPrice === undefined)
      return Number.POSITIVE_INFINITY;
    return Math.max(price - maxPrice, 0);
  };
  const sortCarsByBudgetGap = (cars, maxPrice) =>
    [...cars].sort((a, b) => {
      const gapA = getBudgetGap(a, maxPrice);
      const gapB = getBudgetGap(b, maxPrice);
      if (gapA !== gapB) return gapA - gapB;
      if (b.score !== a.score) return b.score - a.score;
      const priceA = getKnownPrice(a);
      const priceB = getKnownPrice(b);
      if (priceA === null && priceB === null) return 0;
      if (priceA === null) return 1;
      if (priceB === null) return -1;
      return priceA - priceB;
    });

  return {
    buildRanges,
    normalizeMetric,
    getMatchScoreNormalizer,
    buildScoredCars,
    sortCarsByBudgetGap,
  };
};

module.exports = { createRecommendationScoring };
