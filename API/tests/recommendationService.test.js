// API/scripts/recommendationService.test.js

const {
  determineUseCase,
  determineIntent,
  applyWeightModifiers,
  getBaseWeightsForUseCase,
  translateAnswersToHardFilters,
  recommendCars,
} = require("../services/recommendationService");
const {
  createRecommendationScoring,
} = require("../../src/ScoringConfigs/recommendationScoring");
const {
  MINIMUM_RECOMMENDATION_MATCH_SCORE,
} = require("../../src/ScoringConfigs/recommendationConfig");

// --- Shared fake car data ---
// Car A: cheap, efficient, light - city/value-friendly
const carA = {
  car_id: 1,
  brand_name: "Toyota",
  price: 18000,
  combined_mpg: 50,
  horsepower: 100,
  zero_to_sixty_mph: 11,
  curb_weight: 1200,
  boot_space_liters: 300,
  max_seating_capacity: 5,
  body_style: "Hatchback",
};

// Car B: expensive, thirsty, powerful - performance-friendly
const carB = {
  car_id: 2,
  brand_name: "BMW",
  price: 55000,
  combined_mpg: 20,
  horsepower: 400,
  zero_to_sixty_mph: 4.2,
  curb_weight: 1900,
  boot_space_liters: 350,
  max_seating_capacity: 5,
  body_style: "Coupe",
};

// Car C: mid-range - sits between both
const carC = {
  car_id: 3,
  brand_name: "Ford",
  price: 30000,
  combined_mpg: 35,
  horsepower: 200,
  zero_to_sixty_mph: 7,
  curb_weight: 1500,
  boot_space_liters: 400,
  max_seating_capacity: 5,
  body_style: "SUV",
};

let passed = 0;
let failed = 0;

const assert = (condition, testLabel) => {
  if (condition) {
    console.log(`  PASS: ${testLabel}`);
    passed++;
  } else {
    console.error(`  FAIL: ${testLabel}`);
    failed++;
  }
};

// --- TEST 1 (F3) ---
// Questionnaire selects highest scoring use case and intent
// Expected: highest value wins priority
console.log("\n[Test 1a] F3 - determineUseCase picks highest scored use case");
{
  // drive_style = city (+3 city), usage_pattern = errands (+3 city) -> city should win
  const { useCase } = determineUseCase({
    drive_style: "q1_city",
    usage_pattern: "q8_errands",
  });
  assert(useCase === "city", `useCase is "city" (got "${useCase}")`);
}

console.log("\n[Test 1b] F3 - determineIntent picks highest scored intent");
{
  // priority = performance (+3 performance), ownership_intent = fun (+3 performance, +1 balanced)
  // performance total = 6, balanced = 1 -> performance should win
  const { intent } = determineIntent({
    priority: "q6_performance",
    ownership_intent: "q9_fun",
  });
  assert(intent === "performance", `intent is "performance" (got "${intent}")`);
}

// --- TEST 2 (F3) ---
// Weight modifiers can override original weights
// Expected: weight modifier can change priority result
console.log(
  "\n[Test 2] F3 - applyWeightModifiers adds intent nudge to base weights",
);
{
  // City base weights have NO performanceFit entry at all
  const { baseWeights } = getBaseWeightsForUseCase("city", { city: 3 });
  const before = baseWeights.performanceFit ?? 0;

  // Apply performance intent - INTENT_WEIGHT_MODIFIERS.performance adds 0.24 to performanceFit
  const after = applyWeightModifiers(baseWeights, {}, "performance");

  assert(
    (after.performanceFit ?? 0) > before,
    `performanceFit increased after performance intent (${before} -> ${after.performanceFit})`,
  );
}

// --- TEST 3 (F1) ---
// Normalise scores provide lowest and highest values in car list, not including null
// Expected: high and low are both not null (scores differ - range was computed)
console.log(
  "\n[Test 3] F1 - normalise ranges are non-null: cheap/expensive cars score differently",
);
{
  // Log the raw spec values that define the low/high ends of the range
  console.log("  price  -> low: " + carA.price + "  high: " + carB.price);
  console.log(
    "  mpg    -> low: " + carB.combined_mpg + "  high: " + carA.combined_mpg,
  );

  const { buildScoredCars } = createRecommendationScoring({
    cars: [carA, carB],
    criteria: {},
    weights: { runningCostFit: 1.0 },
  });

  const results = buildScoredCars({ cars: [carA, carB] });
  const scoreA = results.find((r) => r.car_id === 1).matchScore;
  const scoreB = results.find((r) => r.car_id === 2).matchScore;

  console.log(
    "  normalised scores -> carA (Toyota): " +
      scoreA +
      "  carB (BMW): " +
      scoreB,
  );

  assert(
    scoreA !== scoreB,
    `carA and carB have different runningCostFit scores (${scoreA} vs ${scoreB}) - ranges are non-null`,
  );
  assert(
    scoreA > scoreB,
    `carA (cheaper/efficient) scores higher than carB on runningCostFit (${scoreA} > ${scoreB})`,
  );
}

// --- TEST 4 (F2) ---
// createRecommendationScoring builds scores from passed weights and criteria
// Expected: scores depend on weights and criteria determined
console.log(
  "\n[Test 4] F2 - scores built from real use case + intent produce different top car",
);
{
  // city + value: runningCostFit and cityFit dominate -> carA (cheap, light hatchback) should win
  const { baseWeights: cityBase } = getBaseWeightsForUseCase("city", {
    city: 3,
  });
  const cityValueWeights = applyWeightModifiers(cityBase, {}, "value");
  const scoringCityValue = createRecommendationScoring({
    cars: [carA, carB, carC],
    criteria: {},
    weights: cityValueWeights,
  });
  if (!scoringCityValue || typeof scoringCityValue.buildScoredCars !== "function") {
    throw new Error("createRecommendationScoring did not return buildScoredCars");
  }
  const cityValueResults = scoringCityValue.buildScoredCars({
    cars: [carA, carB, carC],
    useCase: "city",
    intent: "value",
  });

  // weekend + performance: performanceFit dominates -> carB (fast coupe) should win
  const { baseWeights: weekendBase } = getBaseWeightsForUseCase("weekend", {
    weekend: 3,
  });
  const weekendPerfWeights = applyWeightModifiers(
    weekendBase,
    {},
    "performance",
  );

  const scoringWeekendPerf = createRecommendationScoring({
    cars: [carA, carB, carC],
    criteria: {},
    weights: weekendPerfWeights,
  });
  if (!scoringWeekendPerf || typeof scoringWeekendPerf.buildScoredCars !== "function") {
    throw new Error("createRecommendationScoring did not return buildScoredCars");
  }
  const weekendPerfResults = scoringWeekendPerf.buildScoredCars({
    cars: [carA, carB, carC],
    useCase: "weekend",
    intent: "performance",
  });

  console.log(
    "  city/value weights    -> #1: car_id " +
      cityValueResults[0].car_id +
      " (matchScore: " +
      cityValueResults[0].matchScore +
      ")",
  );
  console.log(
    "  weekend/perf weights  -> #1: car_id " +
      weekendPerfResults[0].car_id +
      " (matchScore: " +
      weekendPerfResults[0].matchScore +
      ")",
  );

  assert(
    cityValueResults[0].car_id === 1,
    `city/value -> carA (cheap hatchback) is ranked first (got car_id ${cityValueResults[0].car_id})`,
  );
  assert(
    weekendPerfResults[0].car_id === 2,
    `weekend/performance -> carB (fast coupe) is ranked first (got car_id ${weekendPerfResults[0].car_id})`,
  );
}

// --- TEST 5 (F5, F1) ---
// buildScoredCars returns sorted array based on highest to lowest match %
// Expected: array ordered highest to lowest
console.log(
  "\n[Test 5] F5, F1 - buildScoredCars output is sorted highest to lowest matchScore",
);
{
  const { buildScoredCars } = createRecommendationScoring({
    cars: [carA, carB, carC],
    criteria: {},
    weights: { runningCostFit: 0.5, performanceFit: 0.5 },
  });

  const results = buildScoredCars({ cars: [carA, carB, carC] });

  let isSorted = true;
  for (let i = 0; i < results.length - 1; i++) {
    if (results[i].matchScore < results[i + 1].matchScore) {
      isSorted = false;
      break;
    }
  }

  assert(isSorted, "all cars are ordered highest matchScore first");
  assert(
    results.every((r) => r.matchScore >= 0 && r.matchScore <= 1),
    "all matchScore values are within 0-1 range",
  );
}

// --- Additional service-level datasets for screenshot scenarios ---
const filterCandidateCars = [
  {
    car_id: 10,
    brand_name: "Toyota",
    price: 14000,
    combined_mpg: 55,
    transmission: "Automatic",
    standard_engine: "Petrol",
    horsepower: 72,
    zero_to_sixty_mph: 14.0,
    curb_weight: 1050,
    boot_space_liters: 270,
    max_seating_capacity: 5,
    body_style: "Hatchback",
  },
  {
    car_id: 11,
    brand_name: "Ford",
    price: 32000,
    combined_mpg: 34,
    transmission: "Automatic",
    standard_engine: "Diesel",
    horsepower: 148,
    zero_to_sixty_mph: 9.3,
    curb_weight: 1650,
    boot_space_liters: 600,
    max_seating_capacity: 7,
    body_style: "SUV",
  },
  {
    car_id: 12,
    brand_name: "BMW",
    price: 18000,
    combined_mpg: 36,
    transmission: "Manual",
    standard_engine: "Petrol",
    horsepower: 140,
    zero_to_sixty_mph: 9.0,
    curb_weight: 1350,
    boot_space_liters: 350,
    max_seating_capacity: 5,
    body_style: "Hatchback",
  },
];

const brandPromotionCars = [
  {
    car_id: 20,
    brand_name: "BMW",
    price: 28000,
    combined_mpg: 30,
    horsepower: 220,
    zero_to_sixty_mph: 7.0,
    curb_weight: 1450,
    boot_space_liters: 400,
    max_seating_capacity: 5,
    body_style: "Sedan",
  },
  {
    car_id: 21,
    brand_name: "Toyota",
    price: 27000,
    combined_mpg: 32,
    horsepower: 180,
    zero_to_sixty_mph: 7.8,
    curb_weight: 1400,
    boot_space_liters: 390,
    max_seating_capacity: 5,
    body_style: "Sedan",
  },
  {
    car_id: 22,
    brand_name: "Ford",
    price: 26000,
    combined_mpg: 33,
    horsepower: 170,
    zero_to_sixty_mph: 8.1,
    curb_weight: 1380,
    boot_space_liters: 410,
    max_seating_capacity: 5,
    body_style: "Sedan",
  },
];

const cityLimitCars = [
  {
    car_id: 30,
    brand_name: "Toyota",
    price: 14000,
    combined_mpg: 55,
    horsepower: 72,
    zero_to_sixty_mph: 14.0,
    curb_weight: 1050,
    boot_space_liters: 270,
    max_seating_capacity: 5,
    body_style: "Hatchback",
  },
  {
    car_id: 31,
    brand_name: "Volkswagen",
    price: 19000,
    combined_mpg: 48,
    horsepower: 110,
    zero_to_sixty_mph: 10.5,
    curb_weight: 1200,
    boot_space_liters: 315,
    max_seating_capacity: 5,
    body_style: "Hatchback",
  },
  {
    car_id: 32,
    brand_name: "Ford",
    price: 17500,
    combined_mpg: 45,
    horsepower: 100,
    zero_to_sixty_mph: 11.2,
    curb_weight: 1150,
    boot_space_liters: 292,
    max_seating_capacity: 5,
    body_style: "Hatchback",
  },
  {
    car_id: 33,
    brand_name: "Honda",
    price: 16000,
    combined_mpg: 52,
    horsepower: 95,
    zero_to_sixty_mph: 11.8,
    curb_weight: 1120,
    boot_space_liters: 285,
    max_seating_capacity: 5,
    body_style: "Hatchback",
  },
];

// --- TEST 6 (F5) ---
// Invalid vehicles cannot become candidates when hard filters are applied
console.log(
  "\n[Test 6] F5 - invalid vehicles are removed from the candidate pool by hard filters",
);
{
  const answers = {
    drive_style: "q1_city",
    usage_pattern: "q8_errands",
    priority: "q6_running_costs",
    ownership_intent: "q9_daily",
    budget_range: 20000,
    fuel_preference: "q3_petrol",
    transmission: "q4_auto",
  };

  const result = recommendCars(filterCandidateCars, answers, 10);
  const recommendationIds = result.recommendations.map((car) => car.car_id);

  assert(
    result.criteria.maxPrice === 20000,
    `budget filter applied as maxPrice=20000 (got ${result.criteria.maxPrice})`,
  );
  assert(
    result.criteria.fuel === "petrol",
    `fuel filter applied as petrol (got "${result.criteria.fuel}")`,
  );
  assert(
    result.criteria.transmission === "automatic",
    `transmission filter applied as automatic (got "${result.criteria.transmission}")`,
  );
  assert(
    result.exactMatchIds.length === 1 && result.exactMatchIds[0] === 10,
    `only the fully matching car remains in the candidate pool (got [${result.exactMatchIds.join(", ")}])`,
  );
  assert(
    recommendationIds.length === 1 && recommendationIds[0] === 10,
    `filtered-out cars do not reach the recommendations array (got [${recommendationIds.join(", ")}])`,
  );
}

// --- TEST 7 (F3) ---
// Tie breaker for use case and intent follows the ORDER arrays in config
console.log(
  "\n[Test 7] F3 - tie breaker uses the ORDER arrays for use case and intent",
);
{
  const useCaseResult = determineUseCase({
    drive_style: "q1_weekend",
    usage_pattern: "q8_family",
  });
  const intentResult = determineIntent({
    priority: "q6_running_costs",
    ownership_intent: "q9_balanced",
  });

  assert(
    useCaseResult.useCaseScores.family === 3 &&
      useCaseResult.useCaseScores.weekend === 3,
    "use case scores tie at family=3 and weekend=3",
  );
  assert(
    useCaseResult.useCase === "family",
    `family wins the use case tie because it appears first in USE_CASE_ORDER (got "${useCaseResult.useCase}")`,
  );
  assert(
    intentResult.intentScores.balanced === 3 &&
      intentResult.intentScores.value === 3,
    "intent scores tie at balanced=3 and value=3",
  );
  assert(
    intentResult.intent === "balanced",
    `balanced wins the intent tie because it appears first in INTENT_ORDER (got "${intentResult.intent}")`,
  );
}

// --- TEST 8 (F3) ---
// determineUseCase only accepts supported questionnaire keys and values
console.log(
  "\n[Test 8] F3 - determineUseCase ignores unsupported question keys and option values",
);
{
  const mixedAnswers = determineUseCase({
    drive_style: "q1_city",
    usage_pattern: "q8_mars",
    hacked_question: "q8_family",
  });
  const invalidOnlyAnswers = determineUseCase({
    drive_style: "q1_spaceship",
    usage_pattern: "q8_mars",
    hacked_question: "q8_family",
  });

  assert(
    mixedAnswers.useCase === "city",
    `valid preset answers still classify correctly while invalid data is ignored (got "${mixedAnswers.useCase}")`,
  );
  assert(
    mixedAnswers.useCaseScores.family === undefined,
    "unsupported question keys do not inject extra score into determineUseCase",
  );
  assert(
    invalidOnlyAnswers.useCase === "long_distance",
    `completely invalid questionnaire data falls back to the default use case (got "${invalidOnlyAnswers.useCase}")`,
  );
}

// --- TEST 9 (F5) ---
// Filter translator only accepts supported questionnaire values
console.log(
  "\n[Test 9] F5 - translateAnswersToHardFilters ignores unsupported filter values",
);
{
  const { criteria, dbFilters } = translateAnswersToHardFilters({
    budget_range: "banana",
    fuel_preference: "q3_plasma",
    transmission: "q4_hover",
    passengers_space: "q5_spaceship",
    made_up_field: "whatever",
  });

  assert(
    Object.keys(criteria).length === 0,
    `invalid filter answers do not create criteria (got keys [${Object.keys(criteria).join(", ")}])`,
  );
  assert(
    Object.keys(dbFilters).length === 0,
    `invalid filter answers do not create dbFilters (got keys [${Object.keys(dbFilters).join(", ")}])`,
  );
}

// --- TEST 10 (F5) ---
// Preferred brands add brand weight and can promote a close match
console.log(
  "\n[Test 10] F5 - preferred brand input adds brand weight and promotes a near-equal preferred result",
);
{
  const baseAnswers = {
    drive_style: "q1_weekend",
    usage_pattern: "q8_roadtrips",
    priority: "q6_performance",
    ownership_intent: "q9_fun",
  };

  const withoutPreferredBrand = recommendCars(
    brandPromotionCars,
    baseAnswers,
    10,
  );
  const withPreferredBrand = recommendCars(
    brandPromotionCars,
    {
      ...baseAnswers,
      preferred_brands: ["Toyota"],
    },
    10,
  );

  assert(
    withoutPreferredBrand.recommendations[0].brand_name === "BMW",
    `without preferred brand input, BMW stays first on raw score (got "${withoutPreferredBrand.recommendations[0].brand_name}")`,
  );
  assert(
    withPreferredBrand.weights.brandFit > withoutPreferredBrand.weights.brandFit,
    `preferred brand input increases brandFit weight (${withoutPreferredBrand.weights.brandFit} -> ${withPreferredBrand.weights.brandFit})`,
  );
  assert(
    withPreferredBrand.recommendations[0].brand_name === "Toyota",
    `preferred Toyota is promoted to the lead result when close enough in score (got "${withPreferredBrand.recommendations[0].brand_name}")`,
  );
}

// --- TEST 11 (F5) ---
// Match-score threshold removes weak recommendations from the final pool
console.log(
  "\n[Test 11] F5 - match-score threshold removes vehicles below the configured minimum",
);
{
  const result = recommendCars(
    brandPromotionCars,
    {
      drive_style: "q1_weekend",
      usage_pattern: "q8_roadtrips",
      priority: "q6_performance",
      ownership_intent: "q9_fun",
    },
    10,
  );

  assert(
    result.exactMatchCount === 3,
    `all 3 cars reach scoring before threshold filtering (got ${result.exactMatchCount})`,
  );
  assert(
    result.recommendations.length === 1,
    `only 1 car remains after the ${MINIMUM_RECOMMENDATION_MATCH_SCORE} threshold is applied (got ${result.recommendations.length})`,
  );
  assert(
    result.recommendations.every(
      (car) => car.matchScore >= MINIMUM_RECOMMENDATION_MATCH_SCORE,
    ),
    `all returned cars meet the configured minimum match score of ${MINIMUM_RECOMMENDATION_MATCH_SCORE}`,
  );
  assert(
    result.recommendations[0].brand_name === "BMW",
    `BMW is the only car left in the recommendation pool after threshold filtering (got "${result.recommendations[0].brand_name}")`,
  );
}

// --- TEST 12 (F5) ---
// Limit parameter caps the number of returned recommendations
console.log(
  "\n[Test 12] F5 - recommendCars respects the provided limit parameter",
);
{
  const answers = {
    drive_style: "q1_city",
    usage_pattern: "q8_errands",
    priority: "q6_running_costs",
    ownership_intent: "q9_daily",
  };

  const limitedResult = recommendCars(cityLimitCars, answers, 1);
  const expandedResult = recommendCars(cityLimitCars, answers, 10);

  assert(
    expandedResult.recommendations.length > 1,
    `control run returns more than 1 recommendation when limit is higher (got ${expandedResult.recommendations.length})`,
  );
  assert(
    limitedResult.recommendations.length === 1,
    `returned vehicle count matches the limit value of 1 (got ${limitedResult.recommendations.length})`,
  );
  assert(
    limitedResult.recommendations[0].car_id ===
      expandedResult.recommendations[0].car_id,
    `limit truncates the ranked list rather than changing the top result (got car_id ${limitedResult.recommendations[0].car_id})`,
  );
}

// --- Summary ---
console.log(`\n--- Results: ${passed} passed, ${failed} failed ---`);
if (failed > 0) process.exit(1);
