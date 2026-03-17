const DRIVER_TYPE_RULES = {
  drive_style: {
    q1_long_distance: { long_distance: 3 },
    q1_city: { city: 3 },
    q1_mixed: { long_distance: 2, city: 1 },
    q1_weekend: { performance: 2, comfort: 1 },
  },
  usage_pattern: {
    q8_commute: { long_distance: 2 },
    q8_errands: { city: 2 },
    q8_roadtrips: { long_distance: 2, comfort: 1 },
    q8_work: { practical: 3 },
    q8_family: { family: 3 },
  },
  passengers_space: {
    q5_small: { city: 1 },
    q5_couple: { comfort: 1 },
    q5_family: { family: 3 },
    q5_large_boot: { practical: 2 },
  },
};

const BASE_WEIGHTS = {
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
  performance: {
    horsepower: 0.35,
    acceleration: 0.3,
    drivetrain: 0.15,
    economy: 0.05,
    reliability: 0.05,
    comfort: 0.1,
  },
  comfort: {
    comfort: 0.3,
    reliability: 0.2,
    economy: 0.15,
    seating: 0.15,
    range: 0.1,
    cityFit: 0.1,
  },
  practical: {
    bootSpace: 0.3,
    seating: 0.2,
    reliability: 0.2,
    economy: 0.1,
    serviceCost: 0.1,
    cityFit: 0.1,
  },
};

const MODIFIERS = {
  priority: {
    q6_running_costs: { economy: 0.08, reliability: 0.05, serviceCost: 0.07 },
    q6_comfort: { comfort: 0.1 },
    q6_performance: { horsepower: 0.08, acceleration: 0.08 },
    q6_practicality: { bootSpace: 0.08, seating: 0.06 },
    q6_tech: { comfort: 0.03 },
  },
  usage_pattern: {
    q8_errands: { cityFit: 0.08 },
    q8_roadtrips: { range: 0.08, bootSpace: 0.04 },
    q8_family: { seating: 0.06, cityFit: 0.04 },
  },
  features: {
    q7_parking: { cityFit: 0.05 },
    q7_adaptive_cruise: { range: 0.04, economy: 0.03 },
    q7_heated: { comfort: 0.05 },
  },
};

const HARD_FILTERS = {
  budget_range: {
    q2_under_5k: { maxPrice: 5000, db: { max_price: 5000 } },
    q2_5k_10k: { minPrice: 5000, maxPrice: 10000, db: { min_price: 5000, max_price: 10000 } },
    q2_10k_20k: { minPrice: 10000, maxPrice: 20000, db: { min_price: 10000, max_price: 20000 } },
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
  passengers_space: {
    q5_family: { minSeats: 4 },
    q5_large_boot: { minBootSpace: 450 },
  },
};

const REASON_LABELS = {
  economy: "good fuel economy",
  range: "good driving range",
  reliability: "strong reliability",
  horsepower: "strong performance",
  acceleration: "quick acceleration",
  bootSpace: "useful boot space",
  seating: "fits your seating needs",
  serviceCost: "lower servicing costs",
  insurance: "lower insurance costs",
  cityFit: "well suited to city driving",
  drivetrain: "suits your driving style",
  comfort: "good comfort fit",
};

const parseNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeText = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

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

const determinePrimaryDriverType = (answers = {}) => {
  const scores = {};

  ["drive_style", "usage_pattern", "passengers_space"].forEach((questionKey) => {
    const answer = answers[questionKey];
    addScores(scores, DRIVER_TYPE_RULES[questionKey]?.[answer]);
  });

  let primaryDriverType = "long_distance";
  Object.keys(scores).forEach((type) => {
    if ((scores[type] || 0) > (scores[primaryDriverType] || 0)) {
      primaryDriverType = type;
    }
  });

  return { primaryDriverType, typeScores: scores };
};

const getBaseWeightsForType = (driverType) => ({
  ...(BASE_WEIGHTS[driverType] || BASE_WEIGHTS.long_distance),
});

const applyWeightModifiers = (baseWeights, answers = {}) => {
  const weights = { ...baseWeights };

  addScores(weights, MODIFIERS.priority[answers.priority]);
  addScores(weights, MODIFIERS.usage_pattern[answers.usage_pattern]);
  addScores(weights, MODIFIERS.features[answers.features]);

  if (
    answers.drive_style === "q1_long_distance" &&
    answers.priority === "q6_performance"
  ) {
    addScores(weights, { horsepower: 0.08, acceleration: 0.08, economy: 0.04 });
  }

  if (
    answers.drive_style === "q1_city" &&
    (answers.passengers_space === "q5_family" ||
      answers.usage_pattern === "q8_family")
  ) {
    addScores(weights, { cityFit: 0.08 });
  }

  return normalizeWeights(weights);
};

const translateAnswersToHardFilters = (answers = {}) => {
  const dbFilters = {};
  const criteria = {};

  Object.entries(HARD_FILTERS).forEach(([questionKey, options]) => {
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
    if (rule.minBootSpace !== undefined) criteria.minBootSpace = rule.minBootSpace;
  });

  return { dbFilters, criteria };
};

const getFuelType = (car) => {
  const engine = normalizeText(car.standard_engine);
  const type = normalizeText(car.type);
  if (car.is_ev || engine.includes("electric") || type.includes("ev")) return "electric";
  if (engine.includes("hybrid") || type.includes("hybrid")) return "hybrid";
  if (engine.includes("diesel")) return "diesel";
  if (engine.includes("petrol") || engine.includes("gasoline") || engine.includes("turbo")) {
    return "petrol";
  }
  return "";
};

const getTransmissionType = (car) => {
  if (car.is_ev) return "automatic";
  const transmission = normalizeText(car.transmission);
  if (
    transmission.includes("auto") ||
    transmission.includes("cvt") ||
    transmission.includes("dual-clutch") ||
    transmission.includes("single-speed")
  ) {
    return "automatic";
  }
  if (transmission.includes("manual")) return "manual";
  return "";
};

const getMetricValue = (car, key) => {
  switch (key) {
    case "horsepower":
      return parseNumber(car.horsepower);
    case "acceleration":
      return parseNumber(car.zero_to_sixty_mph);
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
      return parseNumber(car.max_seating_capacity ?? car.seat_count);
    case "bootSpace":
      return parseNumber(car.boot_space_liters ?? car.cargo_capacity);
    case "comfort":
      return parseNumber(car.model_year);
    default:
      return null;
  }
};

const passesHardFilters = (car, criteria) => {
  const price = parseNumber(car.price);
  const seats = getMetricValue(car, "seating");
  const bootSpace = getMetricValue(car, "bootSpace");

  if (criteria.minPrice !== undefined && (price === null || price < criteria.minPrice)) {
    return false;
  }
  if (criteria.maxPrice !== undefined && (price === null || price > criteria.maxPrice)) {
    return false;
  }
  if (criteria.transmission && getTransmissionType(car) !== criteria.transmission) {
    return false;
  }
  if (criteria.fuel && getFuelType(car) !== criteria.fuel) {
    return false;
  }
  if (criteria.minSeats !== undefined && (seats === null || seats < criteria.minSeats)) {
    return false;
  }
  if (
    criteria.minBootSpace !== undefined &&
    (bootSpace === null || bootSpace < criteria.minBootSpace)
  ) {
    return false;
  }

  return true;
};

const buildRanges = (cars, weightKeys) => {
  const ranges = {};

  weightKeys.forEach((key) => {
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

const scoreSpecialMetric = (car, key, primaryDriverType) => {
  if (key === "cityFit") {
    const bodyStyle = normalizeText(car.body_style);
    if (bodyStyle.includes("hatch") || bodyStyle.includes("compact")) return 1;
    if (bodyStyle.includes("suv")) return primaryDriverType === "family" ? 0.8 : 0.5;
    return 0.6;
  }

  if (key === "drivetrain") {
    const drivetrain = normalizeText(car.drivetrain);
    if (primaryDriverType === "performance") {
      return drivetrain.includes("rwd") || drivetrain.includes("awd") ? 1 : 0.5;
    }
    if (primaryDriverType === "long_distance") {
      return drivetrain.includes("awd") ? 1 : 0.6;
    }
    return drivetrain.includes("fwd") ? 1 : 0.6;
  }

  return 0;
};

const scoreCar = (car, weights, ranges, primaryDriverType) => {
  const contributions = Object.entries(weights).map(([key, weight]) => {
    let value;

    if (key === "acceleration" || key === "serviceCost" || key === "insurance") {
      value = normalizeMetric(getMetricValue(car, key), ranges[key], false);
    } else if (key === "cityFit" || key === "drivetrain") {
      value = scoreSpecialMetric(car, key, primaryDriverType);
    } else {
      value = normalizeMetric(getMetricValue(car, key), ranges[key], true);
    }

    return {
      key,
      value: value * weight,
    };
  });

  return {
    score: Number(
      contributions.reduce((sum, item) => sum + item.value, 0).toFixed(4),
    ),
    topReasons: contributions
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map((item) => REASON_LABELS[item.key]),
  };
};

const recommendCars = (cars = [], answers = {}, limit = 5) => {
  const { primaryDriverType, typeScores } = determinePrimaryDriverType(answers);
  const baseWeights = getBaseWeightsForType(primaryDriverType);
  const weights = applyWeightModifiers(baseWeights, answers);
  const { dbFilters, criteria } = translateAnswersToHardFilters(answers);
  const filteredCars = cars.filter((car) => passesHardFilters(car, criteria));
  const ranges = buildRanges(filteredCars, Object.keys(weights));

  const recommendations = filteredCars
    .map((car) => ({
      ...car,
      ...scoreCar(car, weights, ranges, primaryDriverType),
      primaryDriverType,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return {
    dbFilters,
    criteria,
    primaryDriverType,
    typeScores,
    weights,
    recommendations,
  };
};

module.exports = {
  determinePrimaryDriverType,
  getBaseWeightsForType,
  applyWeightModifiers,
  translateAnswersToHardFilters,
  recommendCars,
};
