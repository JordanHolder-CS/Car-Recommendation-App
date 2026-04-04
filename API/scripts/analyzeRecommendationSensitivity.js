const fs = require("node:fs");
const path = require("node:path");

require("dotenv").config({ path: "./API/config/.env" });

const carModel = require("../models/carModel");
const { recommendCars } = require("../services/recommendationService");

const TOP_N = 5;
const BREAKDOWN_N = 6;
const DELTA_KEYS_N = 4;

const QUESTION_OPTIONS = {
  drive_style: [
    "q1_long_distance",
    "q1_city",
    "q1_mixed",
    "q1_weekend",
  ],
  budget_range: [10000, 20000, 35000, 50000, 100000],
  fuel_preference: [
    "q3_petrol",
    "q3_diesel",
    "q3_hybrid",
    "q3_electric",
    "q3_no_pref",
  ],
  transmission: ["q4_auto", "q4_manual", "q4_either"],
  passengers_space: [
    "q5_coupe",
    "q5_hatchback",
    "q5_sedan",
    "q5_suv",
    "q5_estate",
    "q5_pickup",
  ],
  vehicle_size: ["q_size_small", "q_size_medium", "q_size_large"],
  priority: [
    "q6_running_costs",
    "q6_comfort",
    "q6_performance",
    "q6_practicality",
  ],
  usage_pattern: [
    "q8_commute",
    "q8_errands",
    "q8_roadtrips",
    "q8_work",
    "q8_family",
  ],
  ownership_intent: [
    "q9_daily",
    "q9_balanced",
    "q9_fun",
    "q9_luxury",
    "q9_pure_performance",
  ],
};

const QUESTION_LABELS = {
  drive_style: "Drive style",
  budget_range: "Budget",
  fuel_preference: "Fuel preference",
  transmission: "Transmission",
  passengers_space: "Body style",
  vehicle_size: "Vehicle size",
  priority: "Priority",
  usage_pattern: "Usage pattern",
  ownership_intent: "Ownership intent",
};

const BASE_PROFILES = [
  {
    name: "city_daily",
    answers: {
      drive_style: "q1_city",
      budget_range: 22000,
      fuel_preference: "q3_petrol",
      transmission: "q4_auto",
      passengers_space: "q5_hatchback",
      vehicle_size: "q_size_small",
      priority: "q6_running_costs",
      usage_pattern: "q8_commute",
      ownership_intent: "q9_daily",
    },
  },
  {
    name: "family_balanced",
    answers: {
      drive_style: "q1_mixed",
      budget_range: 42000,
      fuel_preference: "q3_hybrid",
      transmission: "q4_auto",
      passengers_space: "q5_suv",
      vehicle_size: "q_size_large",
      priority: "q6_practicality",
      usage_pattern: "q8_family",
      ownership_intent: "q9_balanced",
    },
  },
  {
    name: "executive_tourer",
    answers: {
      drive_style: "q1_long_distance",
      budget_range: 55000,
      fuel_preference: "q3_diesel",
      transmission: "q4_auto",
      passengers_space: "q5_sedan",
      vehicle_size: "q_size_medium",
      priority: "q6_comfort",
      usage_pattern: "q8_roadtrips",
      ownership_intent: "q9_balanced",
    },
  },
  {
    name: "weekend_performance",
    answers: {
      drive_style: "q1_weekend",
      budget_range: 60000,
      fuel_preference: "q3_petrol",
      transmission: "q4_auto",
      passengers_space: "q5_coupe",
      vehicle_size: "q_size_small",
      priority: "q6_performance",
      usage_pattern: "q8_roadtrips",
      ownership_intent: "q9_pure_performance",
    },
  },
  {
    name: "work_utility",
    answers: {
      drive_style: "q1_mixed",
      budget_range: 45000,
      fuel_preference: "q3_diesel",
      transmission: "q4_auto",
      passengers_space: "q5_pickup",
      vehicle_size: "q_size_large",
      priority: "q6_practicality",
      usage_pattern: "q8_work",
      ownership_intent: "q9_daily",
    },
  },
];

const createCar = (overrides) => ({
  transmission: "Automatic",
  reliability: 80,
  ...overrides,
});

const buildDemoCars = () => {
  const cars = [];

  for (let index = 0; index < 12; index += 1) {
    cars.push(
      createCar({
        car_id: index + 1,
        car_name: `City Hatch ${index + 1}`,
        brand_name: "Metro",
        price: 14000 + index * 900,
        body_style: "hatchback",
        horsepower: 82 + index * 6,
        zero_to_sixty_mph: 12.4 - index * 0.2,
        combined_mpg: 58 - index * 1.1,
        service_cost: 240 + index * 18,
        insurance_estimate: 410 + index * 22,
        max_seating_capacity: 5,
        boot_space_liters: 280 + index * 9,
        model_year: 2021 + (index % 4),
        curb_weight: 940 + index * 18,
        drivetrain: "FWD",
      }),
    );
  }

  for (let index = 0; index < 12; index += 1) {
    cars.push(
      createCar({
        car_id: 100 + index + 1,
        car_name: `Family SUV ${index + 1}`,
        brand_name: "Summit",
        price: 30000 + index * 1200,
        body_style: "suv",
        horsepower: 165 + index * 8,
        zero_to_sixty_mph: 9.1 - index * 0.13,
        combined_mpg: 41 - index * 0.6,
        service_cost: 420 + index * 20,
        insurance_estimate: 760 + index * 28,
        max_seating_capacity: 5 + (index % 3 === 0 ? 2 : 0),
        boot_space_liters: 560 + index * 14,
        model_year: 2022 + (index % 3),
        curb_weight: 1620 + index * 24,
        drivetrain: index % 2 === 0 ? "AWD" : "FWD",
      }),
    );
  }

  for (let index = 0; index < 12; index += 1) {
    cars.push(
      createCar({
        car_id: 200 + index + 1,
        car_name: `Sport Coupe ${index + 1}`,
        brand_name: "Apex",
        price: 39000 + index * 2200,
        body_style: "coupe",
        horsepower: 255 + index * 18,
        zero_to_sixty_mph: 6.2 - index * 0.18,
        combined_mpg: 34 - index * 0.5,
        service_cost: 620 + index * 30,
        insurance_estimate: 1100 + index * 55,
        max_seating_capacity: 4,
        boot_space_liters: 260 + index * 7,
        model_year: 2022 + (index % 3),
        curb_weight: 1380 + index * 22,
        drivetrain: index % 3 === 0 ? "AWD" : "RWD",
      }),
    );
  }

  for (let index = 0; index < 10; index += 1) {
    cars.push(
      createCar({
        car_id: 300 + index + 1,
        car_name: `Executive Sedan ${index + 1}`,
        brand_name: "Regent",
        price: 33000 + index * 1700,
        body_style: "sedan",
        horsepower: 185 + index * 10,
        zero_to_sixty_mph: 8.0 - index * 0.14,
        combined_mpg: 47 - index * 0.6,
        service_cost: 460 + index * 22,
        insurance_estimate: 820 + index * 35,
        max_seating_capacity: 5,
        boot_space_liters: 430 + index * 8,
        model_year: 2022 + (index % 3),
        curb_weight: 1500 + index * 20,
        drivetrain: index % 2 === 0 ? "AWD" : "FWD",
      }),
    );
  }

  for (let index = 0; index < 8; index += 1) {
    cars.push(
      createCar({
        car_id: 400 + index + 1,
        car_name: `Work Utility ${index + 1}`,
        brand_name: "Tasker",
        price: 32000 + index * 1500,
        body_style: index % 2 === 0 ? "pickup" : "estate",
        horsepower: 175 + index * 9,
        zero_to_sixty_mph: 9.8 - index * 0.12,
        combined_mpg: 36 - index * 0.4,
        service_cost: 500 + index * 22,
        insurance_estimate: 880 + index * 40,
        max_seating_capacity: index % 2 === 0 ? 5 : 5,
        boot_space_liters: 620 + index * 18,
        model_year: 2021 + (index % 4),
        curb_weight: 1760 + index * 28,
        drivetrain: "AWD",
      }),
    );
  }

  return cars;
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--cars") {
      parsed.carsPath = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--demo") {
      parsed.demo = true;
    }
  }
  return parsed;
};

const loadCarsFromJson = (carsPath) => {
  const absolutePath = path.resolve(carsPath);
  const contents = fs.readFileSync(absolutePath, "utf8");
  const parsed = JSON.parse(contents);
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected JSON array in ${absolutePath}`);
  }
  return parsed;
};

const loadCars = async (options = {}) => {
  if (options.carsPath) {
    return { cars: loadCarsFromJson(options.carsPath), source: options.carsPath };
  }

  if (!options.demo && process.env.DATABASE_URL) {
    const cars = await carModel.findFiltered({});
    return { cars, source: "database" };
  }

  return { cars: buildDemoCars(), source: "demo-fixture" };
};

const getTopIds = (recommendations = [], limit = TOP_N) =>
  recommendations.slice(0, limit).map((car) => car.car_id);

const getPositionMap = (ids = []) =>
  new Map(ids.map((id, index) => [id, index + 1]));

const countIntersection = (left = [], right = []) => {
  const rightSet = new Set(right);
  return left.filter((value) => rightSet.has(value)).length;
};

const getOrderStats = (baselineIds = [], variantIds = [], limit = TOP_N) => {
  const union = [...new Set([...baselineIds, ...variantIds])];
  const intersectionCount = countIntersection(baselineIds, variantIds);
  const baselinePositions = getPositionMap(baselineIds);
  const variantPositions = getPositionMap(variantIds);

  const exactPositionMatches = baselineIds.filter(
    (id, index) => variantIds[index] === id,
  ).length;

  const meanRankShift = union.length
    ? union.reduce((sum, id) => {
        const baselinePosition = baselinePositions.get(id) || limit + 1;
        const variantPosition = variantPositions.get(id) || limit + 1;
        return sum + Math.abs(baselinePosition - variantPosition);
      }, 0) / union.length
    : 0;

  return {
    top1Changed: baselineIds[0] !== variantIds[0] ? 1 : 0,
    top5OverlapPct: intersectionCount / Math.max(1, limit),
    top5Jaccard:
      union.length > 0 ? intersectionCount / Math.max(1, union.length) : 1,
    exactPositionPct: exactPositionMatches / Math.max(1, limit),
    meanRankShift,
  };
};

const getTopWeightKeys = (weights = {}, limit = BREAKDOWN_N) =>
  Object.entries(weights)
    .filter(([, weight]) => Number.isFinite(weight) && weight > 0)
    .sort(([, left], [, right]) => right - left)
    .slice(0, limit)
    .map(([key]) => key);

const getTopBreakdownKeys = (recommendation, limit = BREAKDOWN_N) =>
  Array.isArray(recommendation?.recommendationBreakdown)
    ? recommendation.recommendationBreakdown.slice(0, limit).map((item) => item.key)
    : [];

const getPositiveWeightDeltaKeys = (
  baselineWeights = {},
  variantWeights = {},
  limit = DELTA_KEYS_N,
) =>
  [...new Set([...Object.keys(baselineWeights), ...Object.keys(variantWeights)])]
    .map((key) => [key, (variantWeights[key] || 0) - (baselineWeights[key] || 0)])
    .filter(([, delta]) => delta > 0)
    .sort(([, left], [, right]) => right - left)
    .slice(0, limit)
    .map(([key]) => key);

const getOverlapRatio = (left = [], right = []) => {
  if (!left.length || !right.length) return null;
  return countIntersection(left, right) / Math.max(1, Math.min(left.length, right.length));
};

const createAccumulator = () => ({
  comparisons: 0,
  rankComparisons: 0,
  availabilityChanged: 0,
  bothEmpty: 0,
  top1Changed: 0,
  top5OverlapPct: 0,
  top5Jaccard: 0,
  exactPositionPct: 0,
  meanRankShift: 0,
  weightAlignmentPct: 0,
  weightAlignmentCount: 0,
  deltaAlignmentPct: 0,
  deltaAlignmentCount: 0,
});

const formatPct = (value) => `${(value * 100).toFixed(1)}%`;
const formatNumber = (value) => value.toFixed(2);

const printSummaryTable = (summaryEntries = []) => {
  const header = [
    "Question".padEnd(20),
    "Cases".padStart(6),
    "Avail".padStart(8),
    "Both0".padStart(8),
    "Top1".padStart(8),
    "Top5Ov".padStart(8),
    "Top5Jac".padStart(8),
    "Exact".padStart(8),
    "Shift".padStart(8),
    "Weights".padStart(9),
    "Delta".padStart(9),
  ].join(" ");

  console.log("\n" + header);
  console.log("-".repeat(header.length));

  summaryEntries.forEach((entry) => {
    console.log(
      [
        entry.label.padEnd(20),
        String(entry.comparisons).padStart(6),
        formatPct(entry.availabilityChangedRate).padStart(8),
        formatPct(entry.bothEmptyRate).padStart(8),
        formatPct(entry.top1ChangedRate).padStart(8),
        formatPct(entry.avgTop5OverlapPct).padStart(8),
        formatPct(entry.avgTop5Jaccard).padStart(8),
        formatPct(entry.avgExactPositionPct).padStart(8),
        formatNumber(entry.avgMeanRankShift).padStart(8),
        (entry.avgWeightAlignmentPct === null
          ? "n/a"
          : formatPct(entry.avgWeightAlignmentPct)
        ).padStart(9),
        (entry.avgDeltaAlignmentPct === null
          ? "n/a"
          : formatPct(entry.avgDeltaAlignmentPct)
        ).padStart(9),
      ].join(" "),
    );
  });
};

const analyzeSensitivity = (cars) => {
  const summaries = Object.fromEntries(
    Object.keys(QUESTION_OPTIONS).map((questionKey) => [questionKey, createAccumulator()]),
  );

  let topFitSameAsTopContributionCount = 0;
  let topFitComparisonCount = 0;
  let highFitLowImpactCount = 0;
  let highFitLowImpactComparisonCount = 0;

  BASE_PROFILES.forEach(({ answers }) => {
    const baselineResult = recommendCars(cars, answers, TOP_N);

    Object.entries(QUESTION_OPTIONS).forEach(([questionKey, options]) => {
      options
        .filter((value) => value !== answers[questionKey])
        .forEach((value) => {
          const variantAnswers = { ...answers, [questionKey]: value };
          const variantResult = recommendCars(cars, variantAnswers, TOP_N);
          const accumulator = summaries[questionKey];
          const baselineIds = getTopIds(baselineResult.recommendations);
          const variantIds = getTopIds(variantResult.recommendations);
          const variantTopRecommendation = variantResult.recommendations[0];
          const topBreakdownKeys = getTopBreakdownKeys(variantTopRecommendation);
          const topWeightKeys = getTopWeightKeys(variantResult.weights);
          const positiveDeltaKeys = getPositiveWeightDeltaKeys(
            baselineResult.weights,
            variantResult.weights,
          );

          accumulator.comparisons += 1;
          const baselineHasResults = baselineIds.length > 0;
          const variantHasResults = variantIds.length > 0;

          if (!baselineHasResults && !variantHasResults) {
            accumulator.bothEmpty += 1;
          } else if (baselineHasResults !== variantHasResults) {
            accumulator.availabilityChanged += 1;
          } else {
            const orderStats = getOrderStats(baselineIds, variantIds);
            accumulator.rankComparisons += 1;
            accumulator.top1Changed += orderStats.top1Changed;
            accumulator.top5OverlapPct += orderStats.top5OverlapPct;
            accumulator.top5Jaccard += orderStats.top5Jaccard;
            accumulator.exactPositionPct += orderStats.exactPositionPct;
            accumulator.meanRankShift += orderStats.meanRankShift;
          }

          const weightAlignment = getOverlapRatio(topWeightKeys, topBreakdownKeys);
          if (weightAlignment !== null) {
            accumulator.weightAlignmentPct += weightAlignment;
            accumulator.weightAlignmentCount += 1;
          }

          const deltaAlignment = getOverlapRatio(positiveDeltaKeys, topBreakdownKeys);
          if (deltaAlignment !== null) {
            accumulator.deltaAlignmentPct += deltaAlignment;
            accumulator.deltaAlignmentCount += 1;
          }

          if (Array.isArray(variantTopRecommendation?.recommendationBreakdown)) {
            const sortedByFit = [...variantTopRecommendation.recommendationBreakdown].sort(
              (left, right) => right.fitScore - left.fitScore,
            );
            const topFitMetric = sortedByFit[0];
            const topContributionMetric =
              variantTopRecommendation.recommendationBreakdown[0];

            if (topFitMetric && topContributionMetric) {
              topFitComparisonCount += 1;
              if (topFitMetric.key === topContributionMetric.key) {
                topFitSameAsTopContributionCount += 1;
              }
            }

            const hasHighFitLowImpact =
              variantTopRecommendation.recommendationBreakdown.some(
                (item) => item.fitScore >= 90 && item.impactPercent <= 5,
              );
            highFitLowImpactComparisonCount += 1;
            if (hasHighFitLowImpact) {
              highFitLowImpactCount += 1;
            }
          }
        });
    });
  });

  const summaryEntries = Object.entries(summaries).map(([questionKey, stats]) => ({
    questionKey,
    label: QUESTION_LABELS[questionKey] || questionKey,
    comparisons: stats.comparisons,
    rankComparisons: stats.rankComparisons,
    availabilityChangedRate:
      stats.availabilityChanged / Math.max(1, stats.comparisons),
    bothEmptyRate: stats.bothEmpty / Math.max(1, stats.comparisons),
    top1ChangedRate: stats.top1Changed / Math.max(1, stats.rankComparisons),
    avgTop5OverlapPct: stats.top5OverlapPct / Math.max(1, stats.rankComparisons),
    avgTop5Jaccard: stats.top5Jaccard / Math.max(1, stats.rankComparisons),
    avgExactPositionPct:
      stats.exactPositionPct / Math.max(1, stats.rankComparisons),
    avgMeanRankShift: stats.meanRankShift / Math.max(1, stats.rankComparisons),
    avgWeightAlignmentPct:
      stats.weightAlignmentCount > 0
        ? stats.weightAlignmentPct / stats.weightAlignmentCount
        : null,
    avgDeltaAlignmentPct:
      stats.deltaAlignmentCount > 0
        ? stats.deltaAlignmentPct / stats.deltaAlignmentCount
        : null,
  }));

  summaryEntries.sort((left, right) => right.top1ChangedRate - left.top1ChangedRate);

  return {
    summaryEntries,
    topFitSameAsTopContributionRate:
      topFitSameAsTopContributionCount / Math.max(1, topFitComparisonCount),
    highFitLowImpactRate:
      highFitLowImpactCount / Math.max(1, highFitLowImpactComparisonCount),
    sampleCount: summaryEntries.reduce(
      (sum, entry) => sum + entry.comparisons,
      0,
    ),
  };
};

const main = async () => {
  const args = parseArgs();
  const { cars, source } = await loadCars(args);
  const analysis = analyzeSensitivity(cars);

  console.log(`Analyzed ${cars.length} cars from ${source}.`);
  console.log(
    `Compared ${analysis.sampleCount} answer mutations across ${BASE_PROFILES.length} base profiles.`,
  );
  printSummaryTable(analysis.summaryEntries);

  console.log("\nFit-score interpretation");
  console.log(
    `- Highest-fit metric is also the highest-contribution metric in ${formatPct(
      analysis.topFitSameAsTopContributionRate,
    )} of cases.`,
  );
  console.log(
    `- A >=90 fit-score metric still has <=5% impact in ${formatPct(
      analysis.highFitLowImpactRate,
    )} of cases.`,
  );
  console.log(
    "- This means a 100/100 fit score is not a recommendation probability by itself; impact/contribution is the stronger signal.",
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
