const { recommendCars } = require("../services/recommendationService");

const DATA_URL =
  process.env.RECOMMENDATION_DATA_URL ||
  "https://car-recommendation-database.co.uk/api/car/specs";

const TOP_RESULTS = 5;

const QUESTION_OPTIONS = {
  drive_style: ["q1_long_distance", "q1_city", "q1_mixed", "q1_weekend"],
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
  priority: ["q6_running_costs", "q6_comfort", "q6_performance", "q6_practicality"],
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

const STRUCTURED_FILTER_BUNDLES = [
  {
    budget_range: 20000,
    fuel_preference: "q3_petrol",
    transmission: "q4_manual",
  },
  {
    budget_range: 30000,
    fuel_preference: "q3_hybrid",
    transmission: "q4_auto",
  },
  {
    budget_range: 50000,
    fuel_preference: "q3_no_pref",
    transmission: "q4_either",
  },
  {
    budget_range: 80000,
    fuel_preference: "q3_petrol",
    transmission: "q4_either",
  },
  {
    budget_range: 100000,
    fuel_preference: "q3_electric",
    transmission: "q4_auto",
  },
];

const STRUCTURED_AXES = [
  "drive_style",
  "passengers_space",
  "vehicle_size",
  "priority",
  "usage_pattern",
  "ownership_intent",
];

const RANDOM_ITERATIONS = 20000;

const normalizeText = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

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

const getPriceBand = (car) => {
  const price = getKnownPrice(car);
  if (price === null) return "unknown";
  if (price <= 20000) return "<=20k";
  if (price <= 40000) return "20k-40k";
  if (price <= 60000) return "40k-60k";
  if (price <= 80000) return "60k-80k";
  if (price <= 100000) return "80k-100k";
  return ">100k";
};

const getBodyStyle = (car) => normalizeText(car.body_style) || "unknown";

const getMissingMetricFlags = (car) => ({
  missingPrice: getKnownPrice(car) === null,
  missingHorsepower: !(parseNumber(car.horsepower) > 0),
  missingAcceleration: !(parseNumber(car.zero_to_sixty_mph) > 0),
});

const mulberry32 = (seed) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let value = Math.imul(t ^ (t >>> 15), t | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const sample = (items, rng) => items[Math.floor(rng() * items.length)];

const buildBudgetSamples = (cars) => {
  const positivePrices = [...new Set(cars.map(getKnownPrice).filter(Boolean))].sort(
    (a, b) => a - b,
  );

  const representativePrices = positivePrices.filter((_, index) => index % 4 === 0);
  const keyBudgets = [
    5000,
    10000,
    15000,
    20000,
    25000,
    30000,
    40000,
    50000,
    60000,
    80000,
    100000,
  ];

  return [...new Set([...keyBudgets, ...representativePrices])]
    .filter((value) => value >= 5000 && value <= 100000)
    .sort((a, b) => a - b);
};

const recordRecommendations = (result, counters) => {
  result.recommendations.slice(0, TOP_RESULTS).forEach((car, index) => {
    const countEntry = counters.byCarId.get(car.car_id) || {
      count: 0,
      bestRank: Number.POSITIVE_INFINITY,
    };

    countEntry.count += 1;
    countEntry.bestRank = Math.min(countEntry.bestRank, index + 1);
    counters.byCarId.set(car.car_id, countEntry);
  });
};

const runStructuredSweep = (cars, counters) => {
  let scenarioCount = 0;

  QUESTION_OPTIONS[STRUCTURED_AXES[0]].forEach((drive_style) => {
    QUESTION_OPTIONS[STRUCTURED_AXES[1]].forEach((passengers_space) => {
      QUESTION_OPTIONS[STRUCTURED_AXES[2]].forEach((priority) => {
        QUESTION_OPTIONS[STRUCTURED_AXES[3]].forEach((usage_pattern) => {
          QUESTION_OPTIONS[STRUCTURED_AXES[4]].forEach((ownership_intent) => {
            STRUCTURED_FILTER_BUNDLES.forEach((bundle) => {
              const answers = {
                drive_style,
                passengers_space,
                priority,
                usage_pattern,
                ownership_intent,
                ...bundle,
              };

              recordRecommendations(
                recommendCars(cars, answers, TOP_RESULTS, {
                  includeReasons: false,
                }),
                counters,
              );
              scenarioCount += 1;
            });
          });
        });
      });
    });
  });

  return scenarioCount;
};

const runRandomSweep = (cars, counters, budgets) => {
  const rng = mulberry32(42);

  for (let index = 0; index < RANDOM_ITERATIONS; index += 1) {
    const answers = {
      drive_style: sample(QUESTION_OPTIONS.drive_style, rng),
      budget_range: sample(budgets, rng),
      fuel_preference: sample(QUESTION_OPTIONS.fuel_preference, rng),
      transmission: sample(QUESTION_OPTIONS.transmission, rng),
      passengers_space: sample(QUESTION_OPTIONS.passengers_space, rng),
      priority: sample(QUESTION_OPTIONS.priority, rng),
      usage_pattern: sample(QUESTION_OPTIONS.usage_pattern, rng),
      ownership_intent: sample(QUESTION_OPTIONS.ownership_intent, rng),
    };

    recordRecommendations(
      recommendCars(cars, answers, TOP_RESULTS, { includeReasons: false }),
      counters,
    );
  }
};

const summarizeByGroup = (cars, accessibleIds, getGroup) => {
  const groups = new Map();

  cars.forEach((car) => {
    const groupKey = getGroup(car);
    const entry = groups.get(groupKey) || { total: 0, accessible: 0 };
    entry.total += 1;
    if (accessibleIds.has(car.car_id)) entry.accessible += 1;
    groups.set(groupKey, entry);
  });

  return [...groups.entries()]
    .map(([group, stats]) => ({
      group,
      total: stats.total,
      accessible: stats.accessible,
      inaccessible: stats.total - stats.accessible,
      accessibilityRate: Number((stats.accessible / stats.total).toFixed(3)),
    }))
    .sort((a, b) => b.inaccessible - a.inaccessible || b.total - a.total);
};

const main = async () => {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status}`);
  }

  const cars = await response.json();
  const budgets = buildBudgetSamples(cars);
  const counters = { byCarId: new Map() };

  const structuredScenarioCount = runStructuredSweep(cars, counters);
  runRandomSweep(cars, counters, budgets);

  const accessibleIds = new Set(counters.byCarId.keys());
  const accessibleCars = cars.filter((car) => accessibleIds.has(car.car_id));
  const inaccessibleCars = cars.filter((car) => !accessibleIds.has(car.car_id));

  const missingMetricSummary = inaccessibleCars.reduce(
    (summary, car) => {
      const flags = getMissingMetricFlags(car);
      if (flags.missingPrice) summary.missingPrice += 1;
      if (flags.missingHorsepower) summary.missingHorsepower += 1;
      if (flags.missingAcceleration) summary.missingAcceleration += 1;
      return summary;
    },
    { missingPrice: 0, missingHorsepower: 0, missingAcceleration: 0 },
  );

  const topInaccessibleExamples = inaccessibleCars
    .slice()
    .sort((a, b) => {
      const priceA = getKnownPrice(a) ?? Number.POSITIVE_INFINITY;
      const priceB = getKnownPrice(b) ?? Number.POSITIVE_INFINITY;
      return priceA - priceB;
    })
    .slice(0, 20)
    .map((car) => ({
      car_id: car.car_id,
      brand: car.brand_name,
      model: car.car_name,
      price: car.price,
      body_style: car.body_style,
    }));

  const output = {
    dataUrl: DATA_URL,
    totalCars: cars.length,
    structuredScenarioCount,
    randomScenarioCount: RANDOM_ITERATIONS,
    totalScenarioCount: structuredScenarioCount + RANDOM_ITERATIONS,
    budgetSampleCount: budgets.length,
    accessibleCarCount: accessibleCars.length,
    inaccessibleCarCount: inaccessibleCars.length,
    accessibilityRate: Number((accessibleCars.length / cars.length).toFixed(3)),
    inaccessibleMissingMetricSummary: missingMetricSummary,
    inaccessibleByBodyStyle: summarizeByGroup(
      cars,
      accessibleIds,
      getBodyStyle,
    ).slice(0, 12),
    inaccessibleByPriceBand: summarizeByGroup(
      cars,
      accessibleIds,
      getPriceBand,
    ),
    topInaccessibleExamples,
  };

  console.log(JSON.stringify(output, null, 2));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
