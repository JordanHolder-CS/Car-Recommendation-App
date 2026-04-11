const USE_CASE_RULES = {
  drive_style: {
    q1_long_distance: { long_distance: 2 },
    q1_city: { city: 2 },
    q1_mixed: { long_distance: 1.5, city: 1 },
    q1_weekend: { weekend: 2 },
  },
  usage_pattern: {
    q8_commute: { long_distance: 2 },
    q8_errands: { city: 2 },
    q8_roadtrips: { long_distance: 2, weekend: 1 },
    q8_work: { work: 3 },
    q8_family: { family: 3 },
  },
  passengers_space: {
    q5_coupe: { weekend: 2 },
    q5_hatchback: { city: 2 },
    q5_sedan: { long_distance: 1, city: 1 },
    q5_suv: { family: 2 },
    q5_estate: { family: 1, work: 1, long_distance: 1 },
    q5_pickup: { work: 3 },
    q5_small: { weekend: 2 },
    q5_couple: { city: 2 },
    q5_family: { family: 2 },
    q5_large_boot: { family: 1, work: 1, long_distance: 1 },
  },
};

const INTENT_RULES = {
  priority: {
    q6_running_costs: { value: 3 },
    q6_comfort: { comfort: 3 },
    q6_performance: { performance: 3 },
    q6_practicality: { practicality: 3 },
  },
  ownership_intent: {
    q9_daily: { value: 2, practicality: 1 },
    q9_balanced: { balanced: 2, comfort: 1, performance: 1 },
    q9_fun: { performance: 3, balanced: 1 },
    q9_luxury: { luxury: 5, comfort: 1 },
    q9_pure_performance: { performance: 5 },
  },
};

const USE_CASE_BASE_WEIGHTS = {
  long_distance: {
    economy: 0.3,
    range: 0.25,
    reliability: 0.15,
    horsepower: 0.1,
    acceleration: 0.05,
    bootSpace: 0.1,
    comfort: 0.05,
  },
  family: {
    seating: 0.25,
    bootSpace: 0.2,
    reliability: 0.2,
    economy: 0.15,
    comfort: 0.1,
    cityFit: 0.1,
  },
  city: {
    economy: 0.25,
    cityFit: 0.2,
    reliability: 0.15,
    serviceCost: 0.15,
    insurance: 0.1,
    comfort: 0.05,
    seating: 0.1,
  },
  weekend: {
    horsepower: 0.39,
    acceleration: 0.3,
    powerToWeight: 0.12,
    drivetrain: 0.11,
    economy: 0.05,
    reliability: 0.05,
    comfort: 0.08,
  },
  work: {
    practicalFit: 0.22,
    bootSpace: 0.24,
    seating: 0.14,
    reliability: 0.16,
    economy: 0.1,
    serviceCost: 0.08,
    cityFit: 0.06,
  },
};

const PROFILE_LABELS = {
  city: {
    value: "Efficient City Car",
    balanced: "Stylish City Car",
    comfort: "Urban Comfort",
    luxury: "Urban Luxury",
    performance: "Hot City Car",
    practicality: "City All-Rounder",
  },
  long_distance: {
    value: "Efficient Motorway Car",
    balanced: "All-Round Tourer",
    comfort: "Executive Cruiser",
    luxury: "Luxury Grand Tourer",
    performance: "Performance GT",
    practicality: "Distance Utility Car",
  },
  family: {
    value: "Sensible Family Car",
    balanced: "Family All-Rounder",
    comfort: "Family Cruiser",
    luxury: "Premium Family SUV",
    performance: "Fast Family Hauler",
    practicality: "Family Hauler",
  },
  work: {
    value: "Cost-Conscious Workhorse",
    balanced: "Versatile Work Car",
    comfort: "Comfortable Load-Lugger",
    luxury: "Premium Utility Vehicle",
    performance: "Performance Utility",
    practicality: "Utility Load-Lugger",
  },
  weekend: {
    value: "Affordable Fun Car",
    balanced: "Stylish Weekend Car",
    comfort: "Grand Tourer",
    luxury: "Prestige GT",
    performance: "Driver's Sports Car",
    practicality: "Adventure All-Rounder",
  },
};

const MODIFIERS = {
  drive_style: {
    q1_long_distance: {
      roadTripFit: 0.18,
      range: 0.1,
      comfortFit: 0.08,
      reliability: 0.06,
      economy: 0.04,
    },
    q1_city: {
      cityFit: 0.18,
      commuteFit: 0.08,
      runningCostFit: 0.08,
      economy: 0.05,
      serviceCost: 0.04,
    },
    q1_mixed: {
      balancedFit: 0.14,
      dailyFit: 0.08,
      comfortFit: 0.06,
      practicalFit: 0.05,
    },
    q1_weekend: {
      performanceFit: 0.24,
      horsepower: 0.14,
      acceleration: 0.12,
      powerToWeight: 0.08,
      luxuryFit: 0.1,
      drivetrain: 0.08,
    },
  },
  priority: {
    q6_running_costs: {
      runningCostFit: 0.22,
      dailyFit: 0.06,
      economy: 0.06,
      reliability: 0.05,
    },
    q6_comfort: { comfort: 0.06, comfortFit: 0.26, roadTripFit: 0.05 },
    q6_performance: {
      performanceFit: 0.2,
      horsepower: 0.08,
      powerToWeight: 0.14,
    },
    q6_practicality: {
      practicalFit: 0.2,
      workFit: 0.05,
      bootSpace: 0.07,
      seating: 0.05,
    },
  },
  usage_pattern: {
    q8_commute: { commuteFit: 0.18, economy: 0.05, reliability: 0.04 },
    q8_errands: { commuteFit: 0.12, cityFit: 0.1 },
    q8_roadtrips: { roadTripFit: 0.18, range: 0.08, bootSpace: 0.05 },
    q8_work: { workFit: 0.22, practicalFit: 0.08, reliability: 0.04 },
    q8_family: {
      familyFit: 0.18,
      seating: 0.08,
      practicalFit: 0.06,
      cityFit: 0.04,
    },
  },
  ownership_intent: {
    q9_daily: {
      dailyFit: 0.18,
      economy: 0.08,
      reliability: 0.08,
      serviceCost: 0.06,
    },
    q9_balanced: {
      balancedFit: 0.16,
      horsepower: 0.05,
      acceleration: 0.05,
      comfort: 0.05,
    },
    q9_fun: {
      performanceFit: 0.18,
      horsepower: 0.14,
      acceleration: 0.14,
      drivetrain: 0.08,
    },
    q9_luxury: {
      comfort: 0.1,
      comfortFit: 0.12,
      horsepower: 0.05,
      acceleration: 0.03,
      luxuryFit: 0.22,
    },
    q9_pure_performance: {
      performanceFit: 0.26,
      horsepower: 0.22,
      acceleration: 0.18,
      drivetrain: 0.1,
    },
  },
};

const PASSENGER_SPACE_RULES = {
  q5_coupe: {
    weights: { spaceFit: 0.22, performanceFit: 0.08 },
    label: "coupe-convertible fit",
    reasonThreshold: 0.55,
    details: ["bodyStyle", "curbWeight", "seating"],
    factors: [
      {
        type: "bodyStyle",
        fallback: 0.35,
        scores: [
          { terms: ["coupe", "convertible", "roadster"], score: 1 },
          { terms: ["hatch"], score: 0.55 },
          { terms: ["sedan", "saloon"], score: 0.4 },
          { terms: ["wagon", "estate"], score: 0.2 },
          { terms: ["suv", "pickup", "truck", "mpv", "van"], score: 0.1 },
        ],
      },
      {
        type: "metric",
        key: "curbWeight",
        direction: "lower",
      },
      {
        type: "bands",
        key: "seating",
        bands: [{ max: 2, score: 1 }, { max: 4, score: 0.92 }, { score: 0.25 }],
      },
    ],
  },
  q5_hatchback: {
    weights: { spaceFit: 0.22, cityFit: 0.08 },
    label: "hatchback-compact fit",
    reasonThreshold: 0.55,
    details: ["bodyStyle", "curbWeight", "seating"],
    factors: [
      {
        type: "bodyStyle",
        fallback: 0.45,
        scores: [
          { terms: ["hatch", "compact", "city"], score: 1 },
          { terms: ["sedan", "saloon"], score: 0.65 },
          { terms: ["coupe"], score: 0.55 },
          { terms: ["wagon", "estate"], score: 0.45 },
          { terms: ["suv"], score: 0.35 },
          { terms: ["pickup", "truck", "mpv", "van"], score: 0.15 },
        ],
      },
      {
        type: "metric",
        key: "curbWeight",
        direction: "lower",
      },
      {
        type: "bands",
        key: "seating",
        bands: [{ max: 4, score: 1 }, { max: 5, score: 0.85 }, { score: 0.35 }],
      },
    ],
  },
  q5_sedan: {
    weights: { spaceFit: 0.2, comfortFit: 0.08 },
    label: "saloon-sedan fit",
    reasonThreshold: 0.55,
    details: ["bodyStyle", "seating"],
    factors: [
      {
        type: "bodyStyle",
        fallback: 0.45,
        scores: [
          { terms: ["sedan", "saloon"], score: 1 },
          { terms: ["coupe"], score: 0.75 },
          { terms: ["hatch"], score: 0.65 },
          { terms: ["wagon", "estate"], score: 0.55 },
          { terms: ["suv"], score: 0.4 },
          { terms: ["pickup", "truck", "mpv", "van"], score: 0.1 },
        ],
      },
      {
        type: "bands",
        key: "seating",
        bands: [{ max: 4, score: 0.85 }, { max: 5, score: 1 }, { score: 0.55 }],
      },
    ],
  },
  q5_suv: {
    weights: { spaceFit: 0.24, familyFit: 0.08, seating: 0.04 },
    label: "suv-crossover fit",
    reasonThreshold: 0.55,
    details: ["bodyStyle", "seating", "bootSpace"],
    factors: [
      {
        type: "bodyStyle",
        fallback: 0.45,
        scores: [
          { terms: ["suv", "crossover", "mpv"], score: 1 },
          { terms: ["wagon", "estate"], score: 0.65 },
          { terms: ["pickup", "truck"], score: 0.55 },
          { terms: ["hatch", "sedan", "saloon"], score: 0.35 },
          { terms: ["coupe", "convertible", "roadster"], score: 0.1 },
        ],
      },
      {
        type: "bands",
        key: "seating",
        bands: [{ min: 5, score: 1 }, { min: 4, score: 0.85 }, { score: 0.25 }],
      },
      {
        type: "metric",
        key: "bootSpace",
        direction: "higher",
      },
    ],
  },
  q5_estate: {
    weights: { spaceFit: 0.24, practicalFit: 0.08, bootSpace: 0.05 },
    label: "estate-wagon fit",
    reasonThreshold: 0.55,
    details: ["bodyStyle", "bootSpace", "seating"],
    factors: [
      {
        type: "bodyStyle",
        fallback: 0.4,
        scores: [
          { terms: ["wagon", "estate"], score: 1 },
          { terms: ["suv"], score: 0.75 },
          { terms: ["hatch"], score: 0.55 },
          { terms: ["sedan", "saloon"], score: 0.45 },
          { terms: ["pickup", "truck"], score: 0.4 },
          { terms: ["coupe", "convertible", "roadster"], score: 0.15 },
        ],
      },
      {
        type: "metric",
        key: "bootSpace",
        direction: "higher",
      },
      {
        type: "bands",
        key: "seating",
        bands: [{ min: 5, score: 0.9 }, { score: 0.6 }],
      },
    ],
  },
  q5_pickup: {
    weights: { spaceFit: 0.24, workFit: 0.1, practicalFit: 0.06 },
    label: "pickup-utility fit",
    reasonThreshold: 0.55,
    details: ["bodyStyle", "bootSpace", "seating"],
    factors: [
      {
        type: "bodyStyle",
        fallback: 0.25,
        scores: [
          { terms: ["pickup", "truck"], score: 1 },
          { terms: ["van"], score: 0.8 },
          { terms: ["suv"], score: 0.45 },
          { terms: ["wagon", "estate"], score: 0.35 },
          { terms: ["hatch", "sedan", "saloon"], score: 0.15 },
          { terms: ["coupe", "convertible", "roadster"], score: 0.05 },
        ],
      },
      {
        type: "metric",
        key: "bootSpace",
        direction: "higher",
      },
      {
        type: "bands",
        key: "seating",
        bands: [{ min: 4, score: 1 }, { min: 2, score: 0.75 }, { score: 0.25 }],
      },
    ],
  },
  q5_small: null,
  q5_couple: null,
  q5_family: null,
  q5_large_boot: null,
};

PASSENGER_SPACE_RULES.q5_small = PASSENGER_SPACE_RULES.q5_coupe;
PASSENGER_SPACE_RULES.q5_couple = PASSENGER_SPACE_RULES.q5_hatchback;
PASSENGER_SPACE_RULES.q5_family = PASSENGER_SPACE_RULES.q5_suv;
PASSENGER_SPACE_RULES.q5_large_boot = PASSENGER_SPACE_RULES.q5_estate;

const VEHICLE_SIZE_RULES = {
  q_size_small: {
    weights: { sizeFit: 0.22, cityFit: 0.03 },
    label: "smaller-lighter fit",
    reasonThreshold: 0.55,
    details: ["curbWeight", "seating", "bootSpace"],
    factors: [
      {
        type: "metric",
        key: "curbWeight",
        direction: "lower",
      },
      {
        type: "bands",
        key: "seating",
        bands: [
          { max: 2, score: 1 },
          { max: 4, score: 0.95 },
          { max: 5, score: 0.7 },
          { score: 0.25 },
        ],
      },
      {
        type: "metric",
        key: "bootSpace",
        direction: "lower",
      },
    ],
  },
  q_size_medium: {
    weights: { sizeFit: 0.2, balancedFit: 0.04 },
    label: "mid-size balance fit",
    reasonThreshold: 0.5,
    details: ["curbWeight", "seating", "bootSpace"],
    factors: [
      {
        type: "midMetric",
        key: "curbWeight",
      },
      {
        type: "bands",
        key: "seating",
        bands: [
          { max: 2, score: 0.45 },
          { max: 4, score: 0.9 },
          { max: 5, score: 1 },
          { max: 7, score: 0.75 },
          { score: 0.45 },
        ],
      },
      {
        type: "midMetric",
        key: "bootSpace",
      },
    ],
  },
  q_size_large: {
    weights: { sizeFit: 0.22, familyFit: 0.04, practicalFit: 0.04 },
    label: "larger-roomier fit",
    reasonThreshold: 0.55,
    details: ["curbWeight", "seating", "bootSpace"],
    factors: [
      {
        type: "metric",
        key: "curbWeight",
        direction: "higher",
      },
      {
        type: "bands",
        key: "seating",
        bands: [
          { min: 6, score: 1 },
          { min: 5, score: 0.9 },
          { min: 4, score: 0.75 },
          { score: 0.3 },
        ],
      },
      {
        type: "metric",
        key: "bootSpace",
        direction: "higher",
      },
    ],
  },
};

const PASSENGER_SPACE_WEIGHTS = Object.fromEntries(
  Object.entries(PASSENGER_SPACE_RULES).map(([key, rule]) => [
    key,
    rule.weights,
  ]),
);

const VEHICLE_SIZE_WEIGHTS = Object.fromEntries(
  Object.entries(VEHICLE_SIZE_RULES).map(([key, rule]) => [key, rule.weights]),
);

const QUESTION_WEIGHT_GROUPS = [
  { answerKey: "drive_style", options: MODIFIERS.drive_style, factor: 0.85 },
  { answerKey: "priority", options: MODIFIERS.priority, factor: 1.15 },
  {
    answerKey: "usage_pattern",
    options: MODIFIERS.usage_pattern,
    factor: 1.35,
  },
  {
    answerKey: "ownership_intent",
    options: MODIFIERS.ownership_intent,
    factor: 1.5,
  },
  {
    answerKey: "passengers_space",
    options: PASSENGER_SPACE_WEIGHTS,
    factor: 1.1,
  },
  {
    answerKey: "vehicle_size",
    options: VEHICLE_SIZE_WEIGHTS,
    factor: 1.15,
  },
];

const CONDITIONAL_WEIGHT_RULES = [
  {
    matches: (answers) =>
      answers.drive_style === "q1_long_distance" &&
      answers.priority === "q6_performance",
    weights: { horsepower: 0.08, acceleration: 0.08, economy: 0.04 },
  },
  {
    matches: (answers) =>
      answers.drive_style === "q1_city" &&
      (answers.passengers_space === "q5_suv" ||
        answers.passengers_space === "q5_estate" ||
        answers.passengers_space === "q5_family" ||
        answers.usage_pattern === "q8_family"),
    weights: { cityFit: 0.08 },
  },
];

const CITY_BODY_STYLE_SCORES = [
  { terms: ["hatch", "compact", "city"], score: 1 },
  { terms: ["sedan", "saloon", "coupe"], score: 0.75 },
  { terms: ["wagon", "estate"], score: 0.55 },
  { terms: ["suv", "pickup", "truck"], score: 0.35 },
];

const COMFORT_BODY_STYLE_SCORES = [
  { terms: ["suv"], score: 1 },
  { terms: ["sedan", "saloon"], score: 0.95 },
  { terms: ["wagon", "estate"], score: 0.55 },
  { terms: ["hatch"], score: 0.35 },
  { terms: ["coupe", "convertible"], score: 0.3 },
];

const PRACTICAL_BODY_STYLE_SCORES = [
  { terms: ["suv", "mpv", "van"], score: 1 },
  { terms: ["wagon", "estate", "pickup", "truck"], score: 0.95 },
  { terms: ["hatch"], score: 0.65 },
  { terms: ["sedan", "saloon"], score: 0.45 },
  { terms: ["coupe", "convertible"], score: 0.2 },
];

const PERFORMANCE_BODY_STYLE_SCORES = [
  { terms: ["coupe", "convertible", "roadster"], score: 1 },
  { terms: ["hatch"], score: 0.85 },
  { terms: ["sedan", "saloon"], score: 0.7 },
  { terms: ["wagon", "estate"], score: 0.45 },
  { terms: ["suv", "mpv", "van", "pickup", "truck"], score: 0.15 },
];

const COMMUTE_BODY_STYLE_SCORES = [
  { terms: ["hatch", "compact"], score: 1 },
  { terms: ["sedan", "saloon"], score: 0.95 },
  { terms: ["suv"], score: 0.75 },
  { terms: ["wagon", "estate"], score: 0.65 },
  { terms: ["coupe", "convertible", "roadster"], score: 0.35 },
  { terms: ["pickup", "truck", "van"], score: 0.25 },
];

const ROAD_TRIP_BODY_STYLE_SCORES = [
  { terms: ["sedan", "saloon"], score: 1 },
  { terms: ["suv"], score: 0.95 },
  { terms: ["wagon", "estate"], score: 0.95 },
  { terms: ["hatch"], score: 0.65 },
  { terms: ["coupe", "convertible", "roadster"], score: 0.35 },
];

const FAMILY_BODY_STYLE_SCORES = [
  { terms: ["suv", "mpv", "van"], score: 1 },
  { terms: ["wagon", "estate"], score: 0.95 },
  { terms: ["hatch"], score: 0.7 },
  { terms: ["sedan", "saloon"], score: 0.65 },
  { terms: ["coupe", "convertible", "roadster"], score: 0.2 },
];

const BALANCED_BODY_STYLE_SCORES = [
  { terms: ["hatch", "sedan", "saloon", "coupe"], score: 1 },
  { terms: ["convertible", "roadster"], score: 0.85 },
  { terms: ["wagon", "estate"], score: 0.75 },
  { terms: ["suv"], score: 0.65 },
  { terms: ["pickup", "truck", "van"], score: 0.2 },
];

const BODY_STYLE_POOL_RULES = {
  q5_coupe: {
    primaryTerms: ["coupe", "convertible", "roadster"],
    secondaryTerms: ["hatch"],
  },
  q5_hatchback: {
    primaryTerms: ["hatch", "compact"],
    secondaryTerms: ["sedan", "saloon"],
  },
  q5_sedan: {
    primaryTerms: ["sedan", "saloon"],
    secondaryTerms: ["hatch", "estate", "wagon"],
  },
  q5_suv: {
    primaryTerms: ["suv", "crossover", "mpv"],
    secondaryTerms: ["estate", "wagon"],
  },
  q5_estate: {
    primaryTerms: ["estate", "wagon"],
    secondaryTerms: ["suv"],
  },
  q5_pickup: {
    primaryTerms: ["pickup", "truck"],
    secondaryTerms: [],
  },
  q5_small: {
    primaryTerms: ["coupe", "convertible", "roadster"],
    secondaryTerms: ["hatch"],
  },
  q5_couple: {
    primaryTerms: ["hatch", "compact"],
    secondaryTerms: ["sedan", "saloon"],
  },
  q5_family: {
    primaryTerms: ["suv", "crossover", "mpv"],
    secondaryTerms: ["estate", "wagon"],
  },
  q5_large_boot: {
    primaryTerms: ["estate", "wagon"],
    secondaryTerms: ["suv"],
  },
};

const LUXURY_BRAND_TERMS = [
  "rolls royce",
  "lamborghini",
  "bentley",
  "ferrari",
  "jaguar",
  "aston martin",
  "lexus",
  "maserati",
];

const HIGH_END_PRICE_THRESHOLD = 80000;
const MATCH_SCORE_MIN_FACTORS = 3;
const MATCH_SCORE_MAX_FACTORS = 5;
const MATCH_SCORE_TARGET_WEIGHT = 0.55;
const MATCH_SCORE_SECONDARY_FACTOR = 0.35;
const BASE_USE_CASE_STRENGTH = 0.6;
const MIN_TRANSMISSION_COVERAGE = 0.15;
const OPEN_ENDED_BUDGET_VALUE = 100000;
const LOWER_IS_BETTER_METRICS = new Set([
  "acceleration",
  "serviceCost",
  "insurance",
  "price",
]);
const SPECIAL_METRICS = new Set([
  "cityFit",
  "drivetrain",
  "spaceFit",
  "sizeFit",
  "runningCostFit",
  "comfortFit",
  "practicalFit",
  "techFit",
  "performanceFit",
  "commuteFit",
  "roadTripFit",
  "workFit",
  "familyFit",
  "dailyFit",
  "balancedFit",
  "luxuryFit",
]);

const HARD_FILTERS = {
  budget_range: {
    q2_under_5k: { maxPrice: 5000, db: { max_price: 5000 } },
    q2_5k_10k: {
      minPrice: 5000,
      maxPrice: 10000,
      db: { min_price: 5000, max_price: 10000 },
    },
    q2_10k_20k: {
      minPrice: 10000,
      maxPrice: 20000,
      db: { min_price: 10000, max_price: 20000 },
    },
    q2_20k_plus: { minPrice: 20000, db: { min_price: 20000 } },
  },
  fuel_preference: {
    q3_petrol: { fuel: "petrol" },
    q3_diesel: { fuel: "diesel" },
    q3_hybrid: { fuel: "hybrid" },
    q3_electric: { fuel: "electric", db: { is_ev: true } },
  },
  transmission: {
    q4_auto: { transmission: "automatic" },
    q4_manual: { transmission: "manual" },
  },
  passengers_space: {},
};

module.exports = {
  USE_CASE_RULES,
  INTENT_RULES,
  USE_CASE_BASE_WEIGHTS,
  PROFILE_LABELS,
  MODIFIERS,
  PASSENGER_SPACE_RULES,
  VEHICLE_SIZE_RULES,
  QUESTION_WEIGHT_GROUPS,
  CONDITIONAL_WEIGHT_RULES,
  CITY_BODY_STYLE_SCORES,
  COMFORT_BODY_STYLE_SCORES,
  PRACTICAL_BODY_STYLE_SCORES,
  PERFORMANCE_BODY_STYLE_SCORES,
  COMMUTE_BODY_STYLE_SCORES,
  ROAD_TRIP_BODY_STYLE_SCORES,
  FAMILY_BODY_STYLE_SCORES,
  BALANCED_BODY_STYLE_SCORES,
  BODY_STYLE_POOL_RULES,
  LUXURY_BRAND_TERMS,
  HIGH_END_PRICE_THRESHOLD,
  MATCH_SCORE_MIN_FACTORS,
  MATCH_SCORE_MAX_FACTORS,
  MATCH_SCORE_TARGET_WEIGHT,
  MATCH_SCORE_SECONDARY_FACTOR,
  BASE_USE_CASE_STRENGTH,
  MIN_TRANSMISSION_COVERAGE,
  OPEN_ENDED_BUDGET_VALUE,
  LOWER_IS_BETTER_METRICS,
  SPECIAL_METRICS,
  HARD_FILTERS,
};
