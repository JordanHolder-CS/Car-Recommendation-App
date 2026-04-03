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

const getMatchScoreNormalizer = (weights = {}) => {
  const sortedWeights = Object.values(weights)
    .filter((weight) => Number.isFinite(weight) && weight > 0)
    .sort((a, b) => b - a);

  let coreWeight = 0;
  let factorCount = 0;

  for (const weight of sortedWeights) {
    if (
      factorCount < MATCH_SCORE_MIN_FACTORS ||
      (coreWeight < MATCH_SCORE_TARGET_WEIGHT &&
        factorCount < MATCH_SCORE_MAX_FACTORS)
    ) {
      coreWeight += weight;
      factorCount += 1;
      continue;
    }

    break;
  }

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

const getSpecialMetricScore = (car, key, context = {}) => {
  const { answers = {}, criteria = {}, useCase, intent, ranges = {} } = context;
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
      return drivetrain.includes("rwd") || drivetrain.includes("awd") ? 1 : 0.5;
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
      normalizeMetric(getMetricValue(car, "bootSpace"), ranges.bootSpace, true),
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
      normalizeMetric(getMetricValue(car, "bootSpace"), ranges.bootSpace, true),
      normalizeMetric(
        getMetricValue(car, "reliability"),
        ranges.reliability,
        true,
      ),
    ]);

  const scoreWorkFit = () =>
    averageScores([
      scorePracticalFit(),
      normalizeMetric(getMetricValue(car, "bootSpace"), ranges.bootSpace, true),
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

  if (key === "drivetrain") {
    return scoreDrivetrainFit();
  }

  if (key === "cityFit") {
    return scoreCityFit();
  }

  if (key === "runningCostFit") {
    return scoreRunningCostFit();
  }

  if (key === "comfortFit") {
    return scoreComfortFit();
  }

  if (key === "practicalFit") {
    return scorePracticalFit();
  }

  if (key === "spaceFit") {
    return scoreSpaceFit();
  }

  if (key === "sizeFit") {
    return scoreSizeFit();
  }

  if (key === "techFit") {
    return scoreTechFit();
  }

  if (key === "performanceFit") {
    return scorePerformanceFit();
  }

  if (key === "commuteFit") {
    return scoreCommuteFit();
  }

  if (key === "roadTripFit") {
    return scoreRoadTripFit();
  }

  if (key === "workFit") {
    return scoreWorkFit();
  }

  if (key === "familyFit") {
    return scoreFamilyFit();
  }

  if (key === "dailyFit") {
    return scoreDailyFit();
  }

  if (key === "balancedFit") {
    return scoreBalancedFit();
  }

  return 0;
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

  if (key === "economy") {
    const mpg = getMetricValue(car, "economy");
    return mpg !== null ? `${formatStat(mpg)} MPG` : "good fuel economy";
  }

  if (key === "range") {
    const range = getMetricValue(car, "range");
    return range !== null
      ? `${formatStat(range)} miles of range`
      : "good driving range";
  }

  if (key === "reliability") {
    const reliability = getMetricValue(car, "reliability");
    return reliability !== null
      ? `reliability score of ${formatStat(reliability, 1)}`
      : "strong reliability";
  }

  if (key === "horsepower") {
    const horsepower = getMetricValue(car, "horsepower");
    return horsepower !== null
      ? `${formatStat(horsepower)} hp`
      : "strong performance";
  }

  if (key === "powerToWeight") {
    const horsepower = getMetricValue(car, "horsepower");
    const curbWeight = getMetricValue(car, "curbWeight");
    return horsepower !== null && curbWeight !== null
      ? `${formatStat(horsepower)} hp with curb weight ${formatStat(curbWeight)}`
      : "strong power-to-weight balance";
  }

  if (key === "acceleration") {
    const acceleration = getMetricValue(car, "acceleration");
    return acceleration !== null
      ? `0-60 mph in ${formatStat(acceleration, 1)}s`
      : "quick acceleration";
  }

  if (key === "bootSpace") {
    const bootSpace = getMetricValue(car, "bootSpace");
    return bootSpace !== null
      ? `${formatStat(bootSpace)}L boot space`
      : "useful boot space";
  }

  if (key === "seating") {
    const seats = getMetricValue(car, "seating");
    return seats !== null
      ? `${formatStat(seats)} seats`
      : "fits your seating needs";
  }

  if (key === "serviceCost") return "lower servicing costs";
  if (key === "insurance") return "lower insurance costs";

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

    const details = rule.details
      .map((detailKey) => {
        if (detailKey === "bodyStyle") {
          return bodyStyle || null;
        }

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
          return bootSpace !== null
            ? `${formatStat(bootSpace)}L boot space`
            : null;
        }

        return null;
      })
      .filter(Boolean);

    return details.length ? `${rule.label}: ${details.join(", ")}` : rule.label;
  }

  if (key === "sizeFit") {
    const rule = VEHICLE_SIZE_RULES[answers.vehicle_size];
    if (!rule || (context.rawScore ?? 0) < rule.reasonThreshold) return null;

    const details = rule.details
      .map((detailKey) => {
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
          return bootSpace !== null
            ? `${formatStat(bootSpace)}L boot space`
            : null;
        }

        return null;
      })
      .filter(Boolean);

    return details.length ? `${rule.label}: ${details.join(", ")}` : rule.label;
  }

  if (key === "techFit") {
    const modelYear = getMetricValue(car, "comfort");
    return modelYear !== null
      ? `newer tech-friendly model year ${Math.round(modelYear)}`
      : "better technology fit";
  }

  if (key === "performanceFit") {
    if ((context.rawScore ?? 0) < 0.55) return null;
    return bodyStyle
      ? `${bodyStyle} performance fit`
      : "strong performance fit";
  }

  if (key === "commuteFit") {
    if ((context.rawScore ?? 0) < 0.55) return null;
    return bodyStyle ? `${bodyStyle} daily-commute fit` : "good commute fit";
  }

  if (key === "roadTripFit") {
    if ((context.rawScore ?? 0) < 0.55) return null;
    return bodyStyle
      ? `${bodyStyle} road-trip fit`
      : "strong long-distance comfort fit";
  }

  if (key === "workFit") {
    if ((context.rawScore ?? 0) < 0.55) return null;
    return bodyStyle ? `${bodyStyle} workhorse fit` : "strong work-use fit";
  }

  if (key === "familyFit") {
    if ((context.rawScore ?? 0) < 0.55) return null;
    return bodyStyle ? `${bodyStyle} family fit` : "strong family-car fit";
  }

  if (key === "dailyFit") {
    if ((context.rawScore ?? 0) < 0.55) return null;
    return "strong everyday-driver fit";
  }

  if (key === "balancedFit") {
    if ((context.rawScore ?? 0) < 0.55) return null;
    return "balanced comfort and performance";
  }

  return null;
};

const scoreCar = (
  car,
  weights,
  ranges,
  matchScoreNormalizer,
  useCase,
  intent,
  answers,
  criteria,
  includeReasons = true,
) => {
  const contributions = Object.entries(weights).map(([key, weight]) => {
    let value;

    if (
      key === "acceleration" ||
      key === "serviceCost" ||
      key === "insurance" ||
      key === "price"
    ) {
      value = normalizeMetric(getMetricValue(car, key), ranges[key], false);
    } else if (
      key === "cityFit" ||
      key === "drivetrain" ||
      key === "spaceFit" ||
      key === "sizeFit" ||
      key === "runningCostFit" ||
      key === "comfortFit" ||
      key === "practicalFit" ||
      key === "techFit" ||
      key === "performanceFit" ||
      key === "commuteFit" ||
      key === "roadTripFit" ||
      key === "workFit" ||
      key === "familyFit" ||
      key === "dailyFit" ||
      key === "balancedFit"
    ) {
      value = getSpecialMetricScore(car, key, {
        answers,
        criteria,
        useCase,
        intent,
        ranges,
      });
    } else {
      value = normalizeMetric(getMetricValue(car, key), ranges[key], true);
    }

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

  return {
    score,
    matchScore: calculateMatchScore(score, matchScoreNormalizer),
    topReasons: includeReasons
      ? contributions
          .sort((a, b) => b.value - a.value)
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
) => {
  const ranges = buildRanges(cars, Object.keys(weights));

  return cars.map((car) => ({
    ...car,
    ...scoreCar(
      car,
      weights,
      ranges,
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
  if (price === null || maxPrice === undefined) return Number.POSITIVE_INFINITY;
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

  let recommendations = buildScoredCars(
    exactMatches,
    weights,
    matchScoreNormalizer,
    useCase,
    intent,
    profileLabel,
    answers,
    criteria,
    includeReasons,
  )
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  let budgetFallbackApplied = false;
  let recommendationNote = null;
  const criteriaAdjustmentNote = criteriaAdjustments.length
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

  if (!hardFilteredCars.length && criteria.maxPrice !== undefined) {
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

    if (relaxedMatches.length) {
      recommendations = sortCarsByBudgetGap(
        buildScoredCars(
          relaxedMatches,
          weights,
          matchScoreNormalizer,
          useCase,
          intent,
          profileLabel,
          answers,
          relaxedCriteria,
          includeReasons,
        ),
        criteria.maxPrice,
      ).slice(0, limit);

      budgetFallbackApplied = true;
      recommendationNote = `No exact matches were found within ${formatCurrency(
        criteria.maxPrice,
      )}, so these are the closest options above budget.`;
    }
  }

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
