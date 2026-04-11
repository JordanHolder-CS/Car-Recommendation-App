const {
  USE_CASE_RULES,
  INTENT_RULES,
  USE_CASE_BASE_WEIGHTS,
  PROFILE_LABELS,
  MODIFIERS,
  PASSENGER_SPACE_RULES,
  VEHICLE_SIZE_RULES,
  QUESTION_WEIGHT_GROUPS,
  CONDITIONAL_WEIGHT_RULES,
  BODY_STYLE_POOL_RULES,
  LUXURY_BRAND_TERMS,
  HIGH_END_PRICE_THRESHOLD,
  BASE_USE_CASE_STRENGTH,
  MIN_TRANSMISSION_COVERAGE,
  OPEN_ENDED_BUDGET_VALUE,
  HARD_FILTERS,
} = require("../../src/ScoringConfigs/recommendationConfig");
const {
  createRecommendationScoring,
} = require("../../src/ScoringConfigs/recommendationScoring");

// -----------------------------------------------------------------------------
// Generic parsing / text helpers
// -----------------------------------------------------------------------------
const parseNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const match = value.match(/-?\d[\d,]*(?:\.\d+)?/);
    if (!match) return null;
    const parsed = Number.parseFloat(match[0].replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};
const getKnownPrice = (car) => {
  const price = parseNumber(car?.price);
  return price !== null && price > 0 ? price : null;
};
const getPositiveNumber = (value) => {
  const parsedValue = parseNumber(value);
  return parsedValue !== null && parsedValue > 0 ? parsedValue : null;
};
const normalizeText = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";
const normalizeLookupText = (value) =>
  normalizeText(value)
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const textIncludesAny = (value, terms = []) =>
  terms.some((term) => value.includes(term));
const buildCarLookupText = (car, keys = []) =>
  normalizeLookupText(
    keys
      .map((key) => car?.[key])
      .filter(
        (value) =>
          value !== undefined && value !== null && `${value}`.trim().length > 0,
      )
      .join(" "),
  );
const formatStat = (value, fractionDigits = 0) => {
  if (!Number.isFinite(value)) return null;
  return Number(value).toLocaleString("en-GB", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
};
const formatCurrency = (value) => {
  if (!Number.isFinite(value)) return null;
  return Number(value).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
const addScores = (target, source = {}) => {
  Object.entries(source).forEach(([key, value]) => {
    target[key] = (target[key] || 0) + value;
  });
};
const normalizeWeights = (weights) => {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  if (!total) return weights;
  return Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [key, value / total]),
  );
};
const USE_CASE_ORDER = ["family", "work", "weekend", "city", "long_distance"];
const INTENT_ORDER = [
  "luxury",
  "performance",
  "comfort",
  "practicality",
  "value",
  "balanced",
];
const DISPLAY_COMPARISON_POOL_SIZE = 15;

// -----------------------------------------------------------------------------
// Profile inference (use case + ownership intent)
// -----------------------------------------------------------------------------
const pickTopCategory = (scores, orderedKeys, fallback) => {
  const hasPositiveScore = orderedKeys.some((key) => (scores[key] || 0) > 0);
  if (!hasPositiveScore) return fallback;
  return orderedKeys.reduce((bestKey, key) => {
    if (!bestKey) return key;
    if ((scores[key] || 0) > (scores[bestKey] || 0)) {
      return key;
    }
    return bestKey;
  }, null);
};
const normalizeCategoryScores = (scores = {}, orderedKeys = [], fallback) => {
  const normalizedEntries = orderedKeys.map((key) => [
    key,
    Math.max(0, scores[key] || 0),
  ]);
  const total = normalizedEntries.reduce((sum, [, value]) => sum + value, 0);
  if (!total) {
    return fallback ? { [fallback]: 1 } : {};
  }
  return Object.fromEntries(
    normalizedEntries
      .map(([key, value]) => [key, value / total])
      .filter(([, value]) => value > 0),
  );
};
const scaleWeights = (weights = {}, factor = 1) =>
  Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [key, value * factor]),
  );
const blendWeightProfiles = (
  profileBlend = {},
  weightProfiles = {},
  fallback,
) => {
  const blendedWeights = {};
  let hasProfile = false;
  Object.entries(profileBlend).forEach(([profileKey, profileWeight]) => {
    if (!Number.isFinite(profileWeight) || profileWeight <= 0) return;
    const profileWeights = weightProfiles[profileKey];
    if (!profileWeights) return;
    hasProfile = true;
    Object.entries(profileWeights).forEach(([metricKey, metricWeight]) => {
      blendedWeights[metricKey] =
        (blendedWeights[metricKey] || 0) + metricWeight * profileWeight;
    });
  });
  return hasProfile ? blendedWeights : { ...(weightProfiles[fallback] || {}) };
};
const getBudgetIntentScores = (budgetAnswer) => {
  if (typeof budgetAnswer === "number" && Number.isFinite(budgetAnswer)) {
    if (budgetAnswer >= OPEN_ENDED_BUDGET_VALUE) return {};
    if (budgetAnswer <= 15000) return { value: 1 };
    if (budgetAnswer >= 80000) return { luxury: 1 };
    if (budgetAnswer >= 40000) return { comfort: 1 };
    return { balanced: 1 };
  }
  if (typeof budgetAnswer === "string") {
    if (budgetAnswer === "q2_under_5k" || budgetAnswer === "q2_5k_10k") {
      return { value: 1 };
    }
    if (budgetAnswer === "q2_20k_plus") return { comfort: 1 };
    if (budgetAnswer === "q2_10k_20k") return { balanced: 1 };
  }
  return {};
};
const determineUseCase = (answers = {}) => {
  const scores = {};
  ["drive_style", "usage_pattern", "passengers_space"].forEach(
    (questionKey) => {
      const answer = answers[questionKey];
      addScores(scores, USE_CASE_RULES[questionKey]?.[answer]);
    },
  );
  const useCase = pickTopCategory(scores, USE_CASE_ORDER, "long_distance");
  const useCaseBlend = normalizeCategoryScores(
    scores,
    USE_CASE_ORDER,
    "long_distance",
  );
  return { useCase, useCaseScores: scores, useCaseBlend };
};
const determineIntent = (answers = {}) => {
  const scores = {};
  ["priority", "ownership_intent"].forEach((questionKey) => {
    const answer = answers[questionKey];
    addScores(scores, INTENT_RULES[questionKey]?.[answer]);
  });
  addScores(scores, getBudgetIntentScores(answers.budget_range));
  const intent = pickTopCategory(scores, INTENT_ORDER, "balanced");
  return { intent, intentScores: scores };
};
const getProfileLabel = (useCase, intent) => {
  const specificLabel = PROFILE_LABELS[useCase]?.[intent];
  if (specificLabel) return specificLabel;
  return `${useCase.replace(/_/g, " ")} / ${intent}`;
};
const getBaseWeightsForUseCase = (useCase) => ({
  ...(USE_CASE_BASE_WEIGHTS[useCase] || USE_CASE_BASE_WEIGHTS.long_distance),
});
const getBaseWeightsForUseCaseBlend = (useCaseBlend = {}) =>
  scaleWeights(
    blendWeightProfiles(useCaseBlend, USE_CASE_BASE_WEIGHTS, "long_distance"),
    BASE_USE_CASE_STRENGTH,
  );
const applyWeightModifiers = (baseWeights, answers = {}) => {
  const weights = { ...baseWeights };
  QUESTION_WEIGHT_GROUPS.forEach(({ answerKey, options, factor = 1 }) => {
    addScores(weights, scaleWeights(options[answers[answerKey]] || {}, factor));
  });
  CONDITIONAL_WEIGHT_RULES.forEach(({ matches, weights: extraWeights }) => {
    if (matches(answers)) addScores(weights, extraWeights);
  });
  return normalizeWeights(weights);
};
const getBudgetCriteria = (budgetAnswer) => {
  if (typeof budgetAnswer === "number" && Number.isFinite(budgetAnswer)) {
    if (budgetAnswer >= OPEN_ENDED_BUDGET_VALUE) return {};
    return { maxPrice: Math.round(budgetAnswer) };
  }
  if (typeof budgetAnswer === "string") {
    const legacyRule = HARD_FILTERS.budget_range?.[budgetAnswer];
    if (!legacyRule) return {};
    return {
      ...(legacyRule.minPrice !== undefined
        ? { minPrice: legacyRule.minPrice }
        : {}),
      ...(legacyRule.maxPrice !== undefined
        ? { maxPrice: legacyRule.maxPrice }
        : {}),
    };
  }
  return {};
};
const hasBudgetCap = (criteria = {}) => criteria.maxPrice !== undefined;
const isLuxuryBrand = (brandName) => {
  const normalizedBrand = normalizeLookupText(brandName);
  return LUXURY_BRAND_TERMS.some(
    (brand) =>
      normalizedBrand === brand ||
      normalizedBrand.startsWith(`${brand} `) ||
      normalizedBrand.includes(` ${brand}`),
  );
};
const bodyStyleMatchesAny = (bodyStyle, terms = []) => {
  const normalizedBodyStyle = normalizeLookupText(bodyStyle);
  return terms.some((term) => normalizedBodyStyle.includes(term));
};
const filterByPreferredBodyStyle = (cars, answers = {}) => {
  const rule = BODY_STYLE_POOL_RULES[answers.passengers_space];
  if (!rule) return cars;
  const primaryMatches = cars.filter((car) =>
    bodyStyleMatchesAny(car.body_style, rule.primaryTerms),
  );
  if (primaryMatches.length) return primaryMatches;
  if (rule.secondaryTerms?.length) {
    const secondaryMatches = cars.filter((car) =>
      bodyStyleMatchesAny(car.body_style, rule.secondaryTerms),
    );
    if (secondaryMatches.length) return secondaryMatches;
  }
  return cars;
};
const filterRecommendationPool = (cars, answers = {}, criteria = {}) => {
  const bodyStyleFilteredCars = filterByPreferredBodyStyle(cars, answers);
  if (answers.ownership_intent !== "q9_luxury") return bodyStyleFilteredCars;
  if (hasBudgetCap(criteria)) {
    return bodyStyleFilteredCars;
  }
  const luxuryBrandCars = bodyStyleFilteredCars.filter((car) =>
    isLuxuryBrand(car.brand_name),
  );
  if (luxuryBrandCars.length) return luxuryBrandCars;
  if (!hasBudgetCap(criteria)) {
    return bodyStyleFilteredCars.filter((car) => {
      const price = getKnownPrice(car);
      return price !== null && price >= HIGH_END_PRICE_THRESHOLD;
    });
  }
  return [];
};
const translateAnswersToHardFilters = (answers = {}) => {
  const dbFilters = {};
  const criteria = {};
  Object.assign(criteria, getBudgetCriteria(answers.budget_range));
  Object.entries(HARD_FILTERS).forEach(([questionKey, options]) => {
    if (questionKey === "budget_range") return;
    const rule = options[answers[questionKey]];
    if (!rule) return;
    if (rule.db) {
      Object.assign(dbFilters, rule.db);
    }
    if (rule.minPrice !== undefined) criteria.minPrice = rule.minPrice;
    if (rule.maxPrice !== undefined) criteria.maxPrice = rule.maxPrice;
    if (rule.fuel) criteria.fuel = rule.fuel;
    if (rule.transmission) criteria.transmission = rule.transmission;
    if (rule.minSeats !== undefined) criteria.minSeats = rule.minSeats;
    if (rule.allowUnknownSeats) criteria.allowUnknownSeats = true;
    if (rule.minBootSpace !== undefined)
      criteria.minBootSpace = rule.minBootSpace;
  });
  return { dbFilters, criteria };
};
// -----------------------------------------------------------------------------
// Source-data normalization helpers (fuel/transmission/metrics)
// -----------------------------------------------------------------------------
const getFuelType = (car) => {
  const fuelText = buildCarLookupText(car, [
    "fuel_type",
    "standard_engine",
    "engine_type",
    "type",
    "car_name",
  ]);
  const batteryCapacity = parseNumber(car.battery_capacity);
  if (
    car.is_ev ||
    textIncludesAny(fuelText, ["electric", "battery electric", "bev"]) ||
    fuelText.includes(" ev ")
  ) {
    return "electric";
  }
  if (
    textIncludesAny(fuelText, [
      "hybrid",
      "plug in hybrid",
      "plug-in hybrid",
      "self charging",
      "phev",
      "mhev",
      "hev",
      "e power",
      "e-power",
    ]) ||
    (batteryCapacity !== null && batteryCapacity > 0 && !car.is_ev)
  ) {
    return "hybrid";
  }
  if (
    textIncludesAny(fuelText, [
      "diesel",
      "tdi",
      "dci",
      "hdi",
      "cdi",
      "crdi",
      "multijet",
      "bluehdi",
      "ecoblue",
      "duratorq",
      "jtd",
    ])
  ) {
    return "diesel";
  }
  if (
    textIncludesAny(fuelText, [
      "petrol",
      "gasoline",
      "tsi",
      "tfsi",
      "ecoboost",
      "gdi",
      "t gdi",
      "tgdi",
      "mpi",
      "skyactiv g",
    ])
  ) {
    return "petrol";
  }
  // The source data often omits the explicit word "petrol" for normal
  // combustion engines, especially sports cars. If it clearly has an engine
  // description and is not EV / hybrid / diesel, treat it as petrol.
  if (fuelText) {
    return "petrol";
  }
  return "";
};
const getTransmissionType = (car) => {
  if (car.is_ev) return "automatic";
  const transmission = buildCarLookupText(car, [
    "transmission",
    "standard_engine",
    "car_name",
  ]);
  if (
    textIncludesAny(transmission, [
      "automatic",
      "shiftable automatic",
      "auto",
      "cvt",
      "e cvt",
      "ecvt",
      "continuously variable",
      "dual clutch",
      "dual-clutch",
      "dct",
      "dsg",
      "single speed",
      "single-speed",
      "tiptronic",
      "geartronic",
      "powershift",
      "torque converter",
    ])
  ) {
    return "automatic";
  }
  if (transmission.includes("manual")) return "manual";
  return "";
};
const getMetricValue = (car, key) => {
  switch (key) {
    case "price":
      return getKnownPrice(car);
    case "horsepower":
      return getPositiveNumber(car.horsepower);
    case "powerToWeight": {
      const horsepower = getPositiveNumber(car.horsepower);
      const curbWeight = getPositiveNumber(car.curb_weight);
      if (horsepower === null || curbWeight === null || curbWeight <= 0) {
        return null;
      }
      return horsepower / curbWeight;
    }
    case "acceleration":
      return getPositiveNumber(car.zero_to_sixty_mph);
    case "economy":
      return parseNumber(car.combined_mpg ?? car.epa_combined);
    case "range":
      return parseNumber(car.ev_range ?? car.estimated_electric_range);
    case "reliability":
      return parseNumber(car.reliability);
    case "serviceCost":
      return parseNumber(car.service_cost);
    case "insurance":
      return parseNumber(car.insurance_estimate);
    case "seating":
      return getPositiveNumber(car.max_seating_capacity ?? car.seat_count);
    case "bootSpace":
      return getPositiveNumber(car.boot_space_liters ?? car.cargo_capacity);
    case "comfort":
      return parseNumber(car.model_year);
    case "curbWeight":
      return getPositiveNumber(car.curb_weight);
    default:
      return null;
  }
};
const matchesBudget = (car, criteria) => {
  const price = getKnownPrice(car);
  if (
    criteria.minPrice !== undefined &&
    (price === null || price < criteria.minPrice)
  ) {
    return false;
  }
  if (
    criteria.maxPrice !== undefined &&
    (price === null || price > criteria.maxPrice)
  ) {
    return false;
  }
  return true;
};
const matchesTransmission = (car, criteria) => {
  if (!criteria.transmission) return true;
  return getTransmissionType(car) === criteria.transmission;
};
const matchesFuel = (car, criteria) => {
  if (!criteria.fuel) return true;
  return getFuelType(car) === criteria.fuel;
};
const matchesSeats = (car, criteria) => {
  const seats = getMetricValue(car, "seating");
  if (
    criteria.minSeats !== undefined &&
    seats !== null &&
    seats < criteria.minSeats
  ) {
    return false;
  }
  if (
    criteria.minSeats !== undefined &&
    seats === null &&
    !criteria.allowUnknownSeats
  ) {
    return false;
  }
  return true;
};
const matchesBootSpace = (car, criteria) => {
  const bootSpace = getMetricValue(car, "bootSpace");
  if (
    criteria.minBootSpace !== undefined &&
    (bootSpace === null || bootSpace < criteria.minBootSpace)
  ) {
    return false;
  }
  return true;
};
const passesHardFilters = (car, criteria) =>
  matchesBudget(car, criteria) &&
  matchesTransmission(car, criteria) &&
  matchesFuel(car, criteria) &&
  matchesSeats(car, criteria) &&
  matchesBootSpace(car, criteria);
const getHardFilterBreakdown = (cars = [], criteria = {}) => {
  const steps = [];
  if (criteria.minPrice !== undefined || criteria.maxPrice !== undefined) {
    steps.push({
      filter: "budget",
      value: {
        ...(criteria.minPrice !== undefined
          ? { minPrice: criteria.minPrice }
          : {}),
        ...(criteria.maxPrice !== undefined
          ? { maxPrice: criteria.maxPrice }
          : {}),
      },
      matches: (car) => matchesBudget(car, criteria),
    });
  }
  if (criteria.transmission) {
    steps.push({
      filter: "transmission",
      value: criteria.transmission,
      matches: (car) => matchesTransmission(car, criteria),
    });
  }
  if (criteria.fuel) {
    steps.push({
      filter: "fuel",
      value: criteria.fuel,
      matches: (car) => matchesFuel(car, criteria),
    });
  }
  if (criteria.minSeats !== undefined) {
    steps.push({
      filter: "seats",
      value: {
        minSeats: criteria.minSeats,
        allowUnknownSeats: Boolean(criteria.allowUnknownSeats),
      },
      matches: (car) => matchesSeats(car, criteria),
    });
  }
  if (criteria.minBootSpace !== undefined) {
    steps.push({
      filter: "boot_space",
      value: { minBootSpace: criteria.minBootSpace },
      matches: (car) => matchesBootSpace(car, criteria),
    });
  }
  let remainingCars = [...cars];
  return steps.map((step) => {
    const before = remainingCars.length;
    remainingCars = remainingCars.filter(step.matches);
    return {
      filter: step.filter,
      value: step.value,
      before,
      after: remainingCars.length,
    };
  });
};
const getRecognizedTransmissionCoverage = (cars = []) => {
  if (!cars.length) return 1;
  const recognizedCount = cars.filter((car) =>
    Boolean(getTransmissionType(car)),
  ).length;
  return recognizedCount / cars.length;
};
const adjustUnsupportedCriteria = (cars = [], criteria = {}) => {
  const adjustedCriteria = { ...criteria };
  const criteriaAdjustments = [];
  if (criteria.transmission) {
    const transmissionCoverage = getRecognizedTransmissionCoverage(cars);
    if (transmissionCoverage < MIN_TRANSMISSION_COVERAGE) {
      delete adjustedCriteria.transmission;
      criteriaAdjustments.push({
        filter: "transmission",
        requested: criteria.transmission,
        coverage: Number(transmissionCoverage.toFixed(3)),
        reason: "Source transmission data is missing for most cars.",
      });
    }
  }
  return { adjustedCriteria, criteriaAdjustments };
};

const getCriteriaAdjustmentNote = (criteriaAdjustments = []) =>
  criteriaAdjustments.length
    ? criteriaAdjustments
        .map((adjustment) => {
          if (adjustment.filter === "transmission") {
            return "Transmission preference was not enforced because the source data does not include transmission values for most cars.";
          }
          return null;
        })
        .filter(Boolean)
        .join(" ")
    : null;

const buildRankedRecommendations = ({
  candidateCars,
  weights,
  matchScoreNormalizer,
  useCase,
  intent,
  profileLabel,
  answers,
  criteria,
  includeReasons,
  buildScoredCars,
}) => {
  const initiallyRankedCars = buildScoredCars(
    candidateCars,
    weights,
    matchScoreNormalizer,
    useCase,
    intent,
    profileLabel,
    answers,
    criteria,
    includeReasons,
    candidateCars,
  ).sort((a, b) => b.score - a.score);

  if (initiallyRankedCars.length <= DISPLAY_COMPARISON_POOL_SIZE) {
    return initiallyRankedCars;
  }

  const comparisonCars = initiallyRankedCars.slice(
    0,
    DISPLAY_COMPARISON_POOL_SIZE,
  );

  return buildScoredCars(
    candidateCars,
    weights,
    matchScoreNormalizer,
    useCase,
    intent,
    profileLabel,
    answers,
    criteria,
    includeReasons,
    comparisonCars,
  ).sort((a, b) => b.score - a.score);
};

const buildBudgetFallbackResult = ({
  recommendations,
  hardFilteredCarsCount,
  cars,
  criteria,
  answers,
  weights,
  matchScoreNormalizer,
  useCase,
  intent,
  profileLabel,
  limit,
  includeReasons,
  helpers,
}) => {
  const {
    passesHardFilters,
    filterRecommendationPool,
    sortCarsByBudgetGap,
    buildRankedRecommendations,
    formatCurrency,
  } = helpers;

  if (
    recommendations.length ||
    hardFilteredCarsCount > 0 ||
    criteria.maxPrice === undefined
  ) {
    return {
      recommendations,
      budgetFallbackApplied: false,
      recommendationNote: null,
    };
  }

  const relaxedCriteria = { ...criteria };
  delete relaxedCriteria.maxPrice;

  const relaxedHardFilteredCars = cars.filter((car) =>
    passesHardFilters(car, relaxedCriteria),
  );
  const relaxedMatches = filterRecommendationPool(
    relaxedHardFilteredCars,
    answers,
    relaxedCriteria,
  );

  if (!relaxedMatches.length) {
    return {
      recommendations,
      budgetFallbackApplied: false,
      recommendationNote: null,
    };
  }

  return {
    recommendations: sortCarsByBudgetGap(
      buildRankedRecommendations({
        candidateCars: relaxedMatches,
        weights,
        matchScoreNormalizer,
        useCase,
        intent,
        profileLabel,
        answers,
        criteria: relaxedCriteria,
        includeReasons,
        buildScoredCars: helpers.buildScoredCars,
      }),
      criteria.maxPrice,
    ).slice(0, limit),
    budgetFallbackApplied: true,
    recommendationNote: `No exact matches were found within ${formatCurrency(
      criteria.maxPrice,
    )}, so these are the closest options above budget.`,
  };
};

// -----------------------------------------------------------------------------
// Scoring engine is delegated to recommendationScoring.js to keep this file
// focused on orchestration and filtering.
// -----------------------------------------------------------------------------
const { getMatchScoreNormalizer, buildScoredCars, sortCarsByBudgetGap } =
  createRecommendationScoring({
    getMetricValue,
    normalizeText,
    formatStat,
    formatCurrency,
    hasBudgetCap,
    isLuxuryBrand,
    getKnownPrice,
  });

// Main orchestration
// -----------------------------------------------------------------------------
const recommendCars = (cars = [], answers = {}, limit = 5, options = {}) => {
  const includeReasons = options.includeReasons !== false;
  const { useCase, useCaseScores, useCaseBlend } = determineUseCase(answers);
  const { intent, intentScores } = determineIntent(answers);
  const profileLabel = getProfileLabel(useCase, intent);
  const baseWeights = getBaseWeightsForUseCaseBlend(useCaseBlend);
  const weights = applyWeightModifiers(baseWeights, answers);
  const matchScoreNormalizer = getMatchScoreNormalizer(weights);
  const { dbFilters, criteria: requestedCriteria } =
    translateAnswersToHardFilters(answers);
  const requestedHardFilterBreakdown = getHardFilterBreakdown(
    cars,
    requestedCriteria,
  );
  const { adjustedCriteria: criteria, criteriaAdjustments } =
    adjustUnsupportedCriteria(cars, requestedCriteria);
  const hardFilterBreakdown = getHardFilterBreakdown(cars, criteria);
  const hardFilteredCars = cars.filter((car) =>
    passesHardFilters(car, criteria),
  );
  const exactMatches = filterRecommendationPool(
    hardFilteredCars,
    answers,
    criteria,
  );
  let recommendations = buildRankedRecommendations({
    candidateCars: exactMatches,
    weights,
    matchScoreNormalizer,
    useCase,
    intent,
    profileLabel,
    answers,
    criteria,
    includeReasons,
    buildScoredCars,
  }).slice(0, limit);
  const criteriaAdjustmentNote = getCriteriaAdjustmentNote(criteriaAdjustments);
  const {
    recommendations: fallbackRecommendations,
    budgetFallbackApplied,
    recommendationNote: budgetFallbackNote,
  } = buildBudgetFallbackResult({
    recommendations,
    hardFilteredCarsCount: hardFilteredCars.length,
    cars,
    criteria,
    answers,
    weights,
    matchScoreNormalizer,
    useCase,
    intent,
    profileLabel,
    limit,
    includeReasons,
    helpers: {
      passesHardFilters,
      filterRecommendationPool,
      sortCarsByBudgetGap,
      buildRankedRecommendations,
      buildScoredCars,
      formatCurrency,
    },
  });
  recommendations = fallbackRecommendations;
  let recommendationNote = budgetFallbackNote;
  if (criteriaAdjustmentNote) {
    recommendationNote = recommendationNote
      ? `${criteriaAdjustmentNote} ${recommendationNote}`
      : criteriaAdjustmentNote;
  }
  return {
    dbFilters,
    criteria,
    requestedCriteria,
    useCase,
    useCaseScores,
    useCaseBlend,
    intent,
    intentScores,
    profileLabel,
    primaryDriverType: useCase,
    typeScores: useCaseScores,
    weights,
    recommendations,
    exactMatchCount: exactMatches.length,
    budgetFallbackApplied,
    recommendationNote,
    criteriaAdjustments,
    requestedHardFilterBreakdown,
    hardFilterBreakdown,
  };
};
module.exports = {
  determineUseCase,
  determineIntent,
  getBaseWeightsForUseCase,
  getBaseWeightsForUseCaseBlend,
  applyWeightModifiers,
  translateAnswersToHardFilters,
  recommendCars,
};
