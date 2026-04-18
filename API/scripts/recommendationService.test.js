// API/scripts/recommendationService.test.js

const {
  determineUseCase,
  determineIntent,
  applyWeightModifiers,
  getBaseWeightsForUseCase,
} = require("../services/recommendationService");
const {
  createRecommendationScoring,
} = require("../../src/ScoringConfigs/recommendationScoring");

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

  const { buildScoredCars: buildCityValue } = createRecommendationScoring({
    cars: [carA, carB, carC],
    criteria: {},
    weights: cityValueWeights,
  });
  const cityValueResults = buildCityValue({
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

  const { buildScoredCars: buildWeekendPerf } = createRecommendationScoring({
    cars: [carA, carB, carC],
    criteria: {},
    weights: weekendPerfWeights,
  });
  const weekendPerfResults = buildWeekendPerf({
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

// --- Summary ---
console.log(`\n--- Results: ${passed} passed, ${failed} failed ---`);
if (failed > 0) process.exit(1);
