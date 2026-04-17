const DEFAULT_USE_CASE = "long_distance";
const DEFAULT_INTENT = "balanced";
const OPEN_ENDED_BUDGET_VALUE = 100_000;
const MINIMUM_RECOMMENDATION_MATCH_SCORE = 0.5;
const PREFERRED_BRAND_PROMOTION_MAX_MATCH_GAP = 0.2;
const USE_CASE_BLEND_RUNNER_UP_RATIO = 0.75;
const USE_CASE_BLEND_MAX_SECONDARY_SHARE = 0.4;

// Normalizes single-select and multi-select answers into one array shape.
const toSelections = (value) =>
  Array.isArray(value)
    ? value.filter(Boolean)
    : value !== undefined && value !== null && `${value}`.trim()
      ? [value]
      : [];

// Keeps preferred-brand matching tolerant of casing and punctuation differences.
const normalizeBrandKey = (value = "") =>
  `${value}`.toLowerCase().replace(/[^a-z0-9]/g, "");

// These rules decide what the user needs the car to do in practical terms.
const USE_CASE_RULES = {
  drive_style: {
    q1_city: { city: 3 },
    q1_long_distance: { long_distance: 3 },
    q1_mixed: { city: 1.5, long_distance: 1.5 },
    q1_weekend: { weekend: 3 },
  },
  usage_pattern: {
    q8_commute: { long_distance: 2.5, city: 0.5 },
    q8_errands: { city: 3 },
    q8_roadtrips: { long_distance: 3, weekend: 1 },
    q8_work: { work: 3 },
    q8_family: { family: 3 },
  },
};

// These rules decide what kind of ownership experience the user wants.
const INTENT_RULES = {
  priority: {
    q6_running_costs: { value: 3 },
    q6_comfort: { comfort: 3 },
    q6_performance: { performance: 3 },
    q6_practicality: { practicality: 3 },
  },
  ownership_intent: {
    q9_daily: { value: 3, practicality: 1 },
    q9_balanced: { balanced: 3, comfort: 1, performance: 1 },
    q9_fun: { performance: 3, balanced: 1 },
    q9_luxury: { luxury: 4, comfort: 2 },
    q9_pure_performance: { performance: 5 },
  },
};

// Base weights are the starting point before intent and questionnaire tweaks.
const USE_CASE_BASE_WEIGHTS = {
  city: {
    runningCostFit: 0.34,
    cityFit: 0.28,
    sizeFit: 0.18,
    spaceFit: 0.12,
    comfortFit: 0.08,
  },
  long_distance: {
    roadTripFit: 0.32,
    comfortFit: 0.2,
    runningCostFit: 0.18,
    spaceFit: 0.16,
    performanceFit: 0.08,
    brandFit: 0.06,
  },
  family: {
    spaceFit: 0.28,
    practicalFit: 0.28,
    comfortFit: 0.16,
    runningCostFit: 0.16,
    brandFit: 0.12,
  },
  work: {
    practicalFit: 0.34,
    spaceFit: 0.22,
    runningCostFit: 0.22,
    comfortFit: 0.12,
    performanceFit: 0.1,
  },
  weekend: {
    performanceFit: 0.44,
    comfortFit: 0.14,
    brandFit: 0.14,
    runningCostFit: 0.08,
    cityFit: 0.06,
    spaceFit: 0.06,
    practicalFit: 0.08,
  },
};

// Intent shifts the emphasis without changing the user’s core use case.
const INTENT_WEIGHT_MODIFIERS = {
  value: { runningCostFit: 0.2, cityFit: 0.04 },
  comfort: { comfortFit: 0.22, roadTripFit: 0.06 },
  performance: { performanceFit: 0.24, comfortFit: 0.03 },
  practicality: { practicalFit: 0.2, spaceFit: 0.12, sizeFit: 0.04 },
  luxury: { comfortFit: 0.16, brandFit: 0.18, performanceFit: 0.05 },
  balanced: {
    runningCostFit: 0.06,
    comfortFit: 0.06,
    performanceFit: 0.06,
    practicalFit: 0.06,
  },
};

// Questionnaire tweaks add smaller nudges on top of use-case and intent.
const QUESTION_WEIGHT_MODIFIERS = {
  drive_style: {
    q1_city: { cityFit: 0.08, runningCostFit: 0.05 },
    q1_long_distance: { roadTripFit: 0.1, comfortFit: 0.04 },
    q1_mixed: { runningCostFit: 0.04, comfortFit: 0.04, practicalFit: 0.04 },
    q1_weekend: { performanceFit: 0.12, brandFit: 0.04 },
  },
  priority: {
    q6_running_costs: { runningCostFit: 0.12, cityFit: 0.03 },
    q6_comfort: { comfortFit: 0.12, roadTripFit: 0.03 },
    q6_performance: { performanceFit: 0.14, brandFit: 0.02 },
    q6_practicality: { practicalFit: 0.12, spaceFit: 0.08 },
  },
  passengers_space: {
    q5_coupe: { performanceFit: 0.08, brandFit: 0.03, comfortFit: 0.02 },
    q5_hatchback: { cityFit: 0.08, runningCostFit: 0.04, sizeFit: 0.03 },
    q5_sedan: { comfortFit: 0.07, roadTripFit: 0.05 },
    q5_suv: { spaceFit: 0.08, practicalFit: 0.06, comfortFit: 0.03 },
    q5_estate: {
      roadTripFit: 0.07,
      practicalFit: 0.05,
      spaceFit: 0.04,
      performanceFit: 0.03,
    },
    q5_pickup: { practicalFit: 0.1, spaceFit: 0.08 },
  },
  usage_pattern: {
    q8_commute: { roadTripFit: 0.08, runningCostFit: 0.04 },
    q8_errands: { cityFit: 0.1, sizeFit: 0.04 },
    q8_roadtrips: { roadTripFit: 0.1, comfortFit: 0.04 },
    q8_work: { practicalFit: 0.12, spaceFit: 0.06 },
    q8_family: { spaceFit: 0.1, practicalFit: 0.08 },
  },
  ownership_intent: {
    q9_daily: { runningCostFit: 0.08, practicalFit: 0.04 },
    q9_balanced: { comfortFit: 0.04, performanceFit: 0.04, practicalFit: 0.04 },
    q9_fun: { performanceFit: 0.12, brandFit: 0.03 },
    q9_luxury: { comfortFit: 0.12, brandFit: 0.1, roadTripFit: 0.03 },
    q9_pure_performance: { performanceFit: 0.2, brandFit: 0.04 },
  },
  vehicle_size: {
    q_size_small: { sizeFit: 0.16, cityFit: 0.04 },
    q_size_medium: { sizeFit: 0.1, comfortFit: 0.04 },
    q_size_large: { sizeFit: 0.16, spaceFit: 0.08, practicalFit: 0.04 },
  },
  transmission: {
    q4_auto: { comfortFit: 0.04 },
    q4_manual: { performanceFit: 0.04 },
  },
  preferred_brands: {
    __selected__: { brandFit: 0.16 },
  },
};

const PROFILE_LABELS = {
  city: {
    value: "Efficient City Car",
    comfort: "Urban Comfort",
    performance: "Hot City Car",
    practicality: "City All-Rounder",
    luxury: "Urban Luxury",
    balanced: "Stylish City Car",
  },
  long_distance: {
    value: "Efficient Motorway Car",
    comfort: "Executive Cruiser",
    performance: "Performance GT",
    practicality: "Distance Utility Car",
    luxury: "Luxury Grand Tourer",
    balanced: "All-Round Tourer",
  },
  family: {
    value: "Sensible Family Car",
    comfort: "Family Cruiser",
    performance: "Fast Family Hauler",
    practicality: "Family Hauler",
    luxury: "Premium Family SUV",
    balanced: "Family All-Rounder",
  },
  work: {
    value: "Cost-Conscious Workhorse",
    comfort: "Comfortable Work Vehicle",
    performance: "Performance Utility",
    practicality: "Utility Load-Lugger",
    luxury: "Premium Utility Vehicle",
    balanced: "Versatile Work Car",
  },
  weekend: {
    value: "Affordable Fun Car",
    comfort: "Grand Tourer",
    performance: "Driver's Sports Car",
    practicality: "Adventure All-Rounder",
    luxury: "Prestige GT",
    balanced: "Stylish Weekend Car",
  },
};

const BODY_STYLE_OPTION_LABELS = {
  q5_coupe: "coupe / convertible",
  q5_hatchback: "hatchback / compact",
  q5_sedan: "saloon / sedan",
  q5_suv: "SUV / crossover",
  q5_estate: "estate / wagon",
  q5_pickup: "pickup / utility",
};

// These keys are shared by hard filters and soft scoring.
const BODY_STYLE_TERMS = {
  q5_coupe: ["coupe", "convertible", "roadster"],
  q5_hatchback: ["hatch", "compact", "city"],
  q5_sedan: ["sedan", "saloon"],
  q5_suv: ["suv", "crossover", "mpv"],
  q5_estate: ["estate", "wagon"],
  q5_pickup: ["pickup", "truck", "utility", "van"],
};

// Every raw body-style string is folded into one small family set.
const BODY_STYLE_FAMILY_TERMS = {
  sport: BODY_STYLE_TERMS.q5_coupe,
  hatch: BODY_STYLE_TERMS.q5_hatchback,
  sedan: BODY_STYLE_TERMS.q5_sedan,
  suv: BODY_STYLE_TERMS.q5_suv,
  estate: BODY_STYLE_TERMS.q5_estate,
  utility: BODY_STYLE_TERMS.q5_pickup,
};

// Static body-style preferences keep the scorer readable.
const BODY_STYLE_METRIC_SCORES = {
  cityFit: {
    sport: 0.45,
    hatch: 1,
    sedan: 0.72,
    suv: 0.56,
    estate: 0.48,
    utility: 0.18,
    other: 0.5,
  },
  comfortFit: {
    sport: 0.45,
    hatch: 0.58,
    sedan: 1,
    suv: 0.9,
    estate: 0.84,
    utility: 0.35,
    other: 0.6,
  },
  performanceFit: {
    sport: 1,
    hatch: 0.82,
    sedan: 0.72,
    suv: 0.42,
    estate: 0.58,
    utility: 0.15,
    other: 0.5,
  },
  practicalFit: {
    sport: 0.18,
    hatch: 0.62,
    sedan: 0.48,
    suv: 1,
    estate: 0.95,
    utility: 0.92,
    other: 0.5,
  },
  roadTripFit: {
    sport: 0.4,
    hatch: 0.62,
    sedan: 1,
    suv: 0.9,
    estate: 0.95,
    utility: 0.35,
    other: 0.6,
  },
};

// Hard filters stay narrow: they only represent explicit questionnaire constraints.
const HARD_FILTERS = {
  budget_range: (value) => {
    const budget = Number.parseFloat(value);
    if (!Number.isFinite(budget) || budget >= OPEN_ENDED_BUDGET_VALUE) {
      return {};
    }
    return {
      criteria: { maxPrice: budget },
      dbFilters: { max_price: budget },
    };
  },
  fuel_preference: (value) => {
    const selected = `${value || ""}`.trim();
    if (!selected || selected === "q3_no_pref") return {};
    if (selected === "q3_electric") {
      return {
        criteria: { fuel: "electric" },
        dbFilters: { is_ev: true },
      };
    }
    if (selected === "q3_hybrid") return { criteria: { fuel: "hybrid" } };
    if (selected === "q3_diesel") return { criteria: { fuel: "diesel" } };
    if (selected === "q3_petrol") return { criteria: { fuel: "petrol" } };
    return {};
  },
  transmission: (value) => {
    if (value === "q4_auto") return { criteria: { transmission: "automatic" } };
    if (value === "q4_manual") return { criteria: { transmission: "manual" } };
    return {};
  },
  passengers_space: (value) => {
    const selections = toSelections(value);
    const bodyStyleTerms = selections.flatMap(
      (selection) => BODY_STYLE_TERMS[selection] || [],
    );
    if (!bodyStyleTerms.length) return {};
    return {
      dbFilters: {
        body_style_terms: [...new Set(bodyStyleTerms)],
      },
      criteria: {
        bodyStyleKeys: selections,
        bodyStyleTerms: [...new Set(bodyStyleTerms)],
      },
    };
  },
  vehicle_size: (value) => (value ? { criteria: { vehicleSize: value } } : {}),
  preferred_brands: (value) => {
    const preferredBrands = toSelections(value).map(normalizeBrandKey);
    return preferredBrands.length ? { criteria: { preferredBrands } } : {};
  },
};

module.exports = {
  DEFAULT_INTENT,
  DEFAULT_USE_CASE,
  OPEN_ENDED_BUDGET_VALUE,
  MINIMUM_RECOMMENDATION_MATCH_SCORE,
  PREFERRED_BRAND_PROMOTION_MAX_MATCH_GAP,
  USE_CASE_BLEND_RUNNER_UP_RATIO,
  USE_CASE_BLEND_MAX_SECONDARY_SHARE,
  USE_CASE_RULES,
  INTENT_RULES,
  USE_CASE_BASE_WEIGHTS,
  INTENT_WEIGHT_MODIFIERS,
  QUESTION_WEIGHT_MODIFIERS,
  PROFILE_LABELS,
  BODY_STYLE_OPTION_LABELS,
  BODY_STYLE_TERMS,
  BODY_STYLE_FAMILY_TERMS,
  BODY_STYLE_METRIC_SCORES,
  HARD_FILTERS,
  normalizeBrandKey,
  toSelections,
};
