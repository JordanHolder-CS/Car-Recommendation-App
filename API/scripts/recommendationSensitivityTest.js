const { recommendCars } = require("../services/recommendationService");

const DATA_URL =
  process.env.RECOMMENDATION_DATA_URL ||
  "https://car-recommendation-database.co.uk/api/car/specs";

const TOP_RESULTS = 5;

const buildLabel = (car) => `${car.brand_name} ${car.car_name}`;

const formatTopWeights = (weights = {}) =>
  Object.entries(weights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([key, value]) => `${key}:${value.toFixed(3)}`)
    .join(", ");

const getWeightDistance = (baseline = {}, current = {}) => {
  const keys = new Set([
    ...Object.keys(baseline || {}),
    ...Object.keys(current || {}),
  ]);

  let totalDistance = 0;
  keys.forEach((key) => {
    totalDistance += Math.abs((baseline[key] || 0) - (current[key] || 0));
  });

  return Number(totalDistance.toFixed(4));
};

const compareResults = (baselineResult, currentResult) => {
  const baselineCars = baselineResult.recommendations
    .slice(0, TOP_RESULTS)
    .map(buildLabel);
  const currentCars = currentResult.recommendations
    .slice(0, TOP_RESULTS)
    .map(buildLabel);
  const overlapCount = currentCars.filter((label) =>
    baselineCars.includes(label),
  ).length;

  return {
    top1Changed: baselineCars[0] !== currentCars[0],
    top5Overlap: `${overlapCount}/${TOP_RESULTS}`,
    weightShift: getWeightDistance(baselineResult.weights, currentResult.weights),
  };
};

const printVariant = (label, result, comparison = null) => {
  const topCars = result.recommendations
    .slice(0, 3)
    .map((car) => buildLabel(car))
    .join(" | ");

  console.log(`  ${label}`);
  console.log(
    `    useCase=${result.useCase} intent=${result.intent} profile=${result.profileLabel}`,
  );
  console.log(`    top3=${topCars || "none"}`);
  console.log(`    weights=${formatTopWeights(result.weights)}`);

  if (comparison) {
    console.log(
      `    change top1=${comparison.top1Changed} top5Overlap=${comparison.top5Overlap} weightShift=${comparison.weightShift}`,
    );
  }
};

const suites = [
  {
    name: "Sports Buyer / Q6 Sensitivity",
    baseAnswers: {
      drive_style: "q1_weekend",
      budget_range: 100000,
      fuel_preference: "q3_petrol",
      transmission: "q4_either",
      passengers_space: "q5_coupe",
      vehicle_size: "q_size_small",
      usage_pattern: "q8_commute",
      ownership_intent: "q9_pure_performance",
    },
    variants: [
      { label: "Q6 running costs", answers: { priority: "q6_running_costs" } },
      { label: "Q6 comfort", answers: { priority: "q6_comfort" } },
      { label: "Q6 performance", answers: { priority: "q6_performance" } },
      { label: "Q6 practicality", answers: { priority: "q6_practicality" } },
    ],
  },
  {
    name: "Sports Buyer / Q9 Sensitivity",
    baseAnswers: {
      drive_style: "q1_weekend",
      budget_range: 100000,
      fuel_preference: "q3_petrol",
      transmission: "q4_either",
      passengers_space: "q5_coupe",
      vehicle_size: "q_size_small",
      priority: "q6_performance",
      usage_pattern: "q8_commute",
    },
    variants: [
      { label: "Q9 daily", answers: { ownership_intent: "q9_daily" } },
      { label: "Q9 balanced", answers: { ownership_intent: "q9_balanced" } },
      { label: "Q9 fun", answers: { ownership_intent: "q9_fun" } },
      { label: "Q9 luxury", answers: { ownership_intent: "q9_luxury" } },
      {
        label: "Q9 pure performance",
        answers: { ownership_intent: "q9_pure_performance" },
      },
    ],
  },
  {
    name: "Urban Hybrid / Q6 Sensitivity",
    baseAnswers: {
      drive_style: "q1_city",
      budget_range: 30000,
      fuel_preference: "q3_hybrid",
      transmission: "q4_either",
      passengers_space: "q5_suv",
      vehicle_size: "q_size_medium",
      usage_pattern: "q8_errands",
      ownership_intent: "q9_daily",
    },
    variants: [
      { label: "Q6 running costs", answers: { priority: "q6_running_costs" } },
      { label: "Q6 comfort", answers: { priority: "q6_comfort" } },
      { label: "Q6 performance", answers: { priority: "q6_performance" } },
      { label: "Q6 practicality", answers: { priority: "q6_practicality" } },
    ],
  },
  {
    name: "Urban Hybrid / Q8 Sensitivity",
    baseAnswers: {
      drive_style: "q1_city",
      budget_range: 30000,
      fuel_preference: "q3_hybrid",
      transmission: "q4_either",
      passengers_space: "q5_suv",
      vehicle_size: "q_size_medium",
      priority: "q6_comfort",
      ownership_intent: "q9_daily",
    },
    variants: [
      { label: "Q8 commute", answers: { usage_pattern: "q8_commute" } },
      { label: "Q8 errands", answers: { usage_pattern: "q8_errands" } },
      { label: "Q8 road trips", answers: { usage_pattern: "q8_roadtrips" } },
      { label: "Q8 work", answers: { usage_pattern: "q8_work" } },
      { label: "Q8 family", answers: { usage_pattern: "q8_family" } },
    ],
  },
  {
    name: "Urban Hybrid / Q9 Sensitivity",
    baseAnswers: {
      drive_style: "q1_city",
      budget_range: 30000,
      fuel_preference: "q3_hybrid",
      transmission: "q4_either",
      passengers_space: "q5_suv",
      vehicle_size: "q_size_medium",
      priority: "q6_comfort",
      usage_pattern: "q8_errands",
    },
    variants: [
      { label: "Q9 daily", answers: { ownership_intent: "q9_daily" } },
      { label: "Q9 balanced", answers: { ownership_intent: "q9_balanced" } },
      { label: "Q9 fun", answers: { ownership_intent: "q9_fun" } },
      { label: "Q9 luxury", answers: { ownership_intent: "q9_luxury" } },
      {
        label: "Q9 pure performance",
        answers: { ownership_intent: "q9_pure_performance" },
      },
    ],
  },
];

const runSuite = (cars, suite) => {
  console.log(`\n${suite.name}`);

  const results = suite.variants.map((variant) => {
    const answers = { ...suite.baseAnswers, ...variant.answers };
    return {
      label: variant.label,
      result: recommendCars(cars, answers, TOP_RESULTS),
    };
  });

  const baseline = results[0];

  results.forEach(({ label, result }, index) => {
    const comparison =
      index === 0 ? null : compareResults(baseline.result, result);
    printVariant(label, result, comparison);
  });
};

const main = async () => {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status}`);
  }

  const cars = await response.json();
  console.log(`Loaded ${cars.length} cars from ${DATA_URL}`);

  suites.forEach((suite) => runSuite(cars, suite));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
