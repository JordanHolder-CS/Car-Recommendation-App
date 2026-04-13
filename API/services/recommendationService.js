const {
  DEFAULT_INTENT,
  DEFAULT_USE_CASE,
  HARD_FILTERS,
  INTENT_RULES,
  INTENT_WEIGHT_MODIFIERS,
  MINIMUM_RECOMMENDATION_MATCH_SCORE,
  PREFERRED_BRAND_PROMOTION_MAX_MATCH_GAP,
  PROFILE_LABELS,
  QUESTION_WEIGHT_MODIFIERS,
  USE_CASE_BLEND_MAX_SECONDARY_SHARE,
  USE_CASE_BLEND_RUNNER_UP_RATIO,
  USE_CASE_BASE_WEIGHTS,
  USE_CASE_RULES,
  normalizeBrandKey,
  toSelections,
} = require("../../src/ScoringConfigs/recommendationConfig");
const {
  createRecommendationScoring,
} = require("../../src/ScoringConfigs/recommendationScoring");

const USE_CASE_ORDER = ["family", "work", "weekend", "city", "long_distance"];
const INTENT_ORDER = [
  "luxury",
  "performance",
  "comfort",
  "practicality",
  "value",
  "balanced",
];

// Parses nullable numeric values without throwing on dirty source data.
const parseNumber = (value) => {
  const parsedValue = Number.parseFloat(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

// Normalizes text before matching engines, transmissions, and body styles.
const normalizeText = (value = "") =>
  `${value}`.trim().toLowerCase().replace(/\s+/g, " ");

// Adds one score object into another without assuming every key already exists.
const addScores = (target, source = {}) => {
  Object.entries(source).forEach(([key, value]) => {
    target[key] = (target[key] || 0) + value;
  });
  return target;
};

// Keeps the final weight object bounded to a clean 0..1 total.
const normalizeWeights = (weights = {}) => {
  const positiveEntries = Object.entries(weights).filter(
    ([, value]) => Number.isFinite(value) && value > 0,
  );
  const totalWeight = positiveEntries.reduce(
    (runningTotal, [, value]) => runningTotal + value,
    0,
  );

  if (!totalWeight) return {};

  return Object.fromEntries(
    positiveEntries.map(([key, value]) => [
      key,
      Number((value / totalWeight).toFixed(4)),
    ]),
  );
};

// Picks the strongest category while keeping tie-breaks deterministic.
const pickTopKey = (scores = {}, orderedKeys = [], fallback) =>
  orderedKeys.reduce((bestKey, currentKey) => {
    if ((scores[currentKey] || 0) > (scores[bestKey] || 0)) return currentKey;
    return bestKey;
  }, fallback);

// Produces both raw category scores and a normalized blend view for debugging.
const buildCategoryResult = (scores = {}, orderedKeys = [], fallback) => {
  const chosenKey = pickTopKey(scores, orderedKeys, fallback);
  const totalScore = orderedKeys.reduce(
    (runningTotal, key) => runningTotal + Math.max(0, scores[key] || 0),
    0,
  );

  const normalizedScores = Object.fromEntries(
    orderedKeys.map((key) => [
      key,
      totalScore ? Number(((scores[key] || 0) / totalScore).toFixed(4)) : 0,
    ]),
  );

  return {
    key: chosenKey,
    scores,
    normalizedScores,
  };
};

// Applies one questionnaire rule set to a score bucket.
const scoreRuleGroups = (rules = {}, answers = {}) => {
  const scores = {};

  Object.entries(rules).forEach(([questionKey, optionRules]) => {
    toSelections(answers[questionKey]).forEach((selection) => {
      addScores(scores, optionRules[selection] || {});
    });
  });

  return scores;
};

// Infers the user's practical use case from driving-style answers.
const determineUseCase = (answers = {}) => {
  const scores = scoreRuleGroups(USE_CASE_RULES, answers);
  const result = buildCategoryResult(scores, USE_CASE_ORDER, DEFAULT_USE_CASE);

  return {
    useCase: result.key,
    useCaseScores: result.scores,
    useCaseBlend: result.normalizedScores,
  };
};

// Infers the user's ownership intent from preference-style answers.
const determineIntent = (answers = {}) => {
  const scores = scoreRuleGroups(INTENT_RULES, answers);
  const result = buildCategoryResult(scores, INTENT_ORDER, DEFAULT_INTENT);

  return {
    intent: result.key,
    intentScores: result.scores,
  };
};

// Maps the use-case/intent pair into the label shown in the UI.
const getProfileLabel = (useCase, intent) =>
  PROFILE_LABELS[useCase]?.[intent] ||
  `${useCase.replace(/_/g, " ")} / ${intent.replace(/_/g, " ")}`;

// Scales one weight profile so two use cases can share the same base mix.
const scaleWeights = (weights = {}, factor = 1) =>
  Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [key, value * factor]),
  );

// Returns the dominant and runner-up use cases in priority-safe order.
const getRankedUseCases = (useCaseScores = {}) =>
  USE_CASE_ORDER.map((key, priority) => ({
    key,
    priority,
    score: Math.max(0, useCaseScores[key] || 0),
  })).sort((left, right) => right.score - left.score || left.priority - right.priority);

// Builds the base weight profile from the dominant use case and, when close enough,
// blends in a capped share of the runner-up use case.
const getBaseWeightsForUseCase = (useCase, useCaseScores = {}) => {
  const primaryWeights =
    USE_CASE_BASE_WEIGHTS[useCase] || USE_CASE_BASE_WEIGHTS[DEFAULT_USE_CASE];
  const [primaryUseCase, secondaryUseCase] = getRankedUseCases(useCaseScores);

  if (
    !primaryUseCase?.score ||
    primaryUseCase.key !== useCase ||
    !secondaryUseCase?.score
  ) {
    return {
      baseWeights: { ...primaryWeights },
      useCaseWeightBlend: { [useCase]: 1 },
    };
  }

  const secondaryRatio = secondaryUseCase.score / primaryUseCase.score;

  if (secondaryRatio < USE_CASE_BLEND_RUNNER_UP_RATIO) {
    return {
      baseWeights: { ...primaryWeights },
      useCaseWeightBlend: { [useCase]: 1 },
    };
  }

  const secondaryShare = Math.min(
    secondaryUseCase.score / (primaryUseCase.score + secondaryUseCase.score),
    USE_CASE_BLEND_MAX_SECONDARY_SHARE,
  );
  const primaryShare = 1 - secondaryShare;
  const secondaryWeights = USE_CASE_BASE_WEIGHTS[secondaryUseCase.key] || {};
  const baseWeights = normalizeWeights(
    addScores(
      scaleWeights(primaryWeights, primaryShare),
      scaleWeights(secondaryWeights, secondaryShare),
    ),
  );

  return {
    baseWeights,
    useCaseWeightBlend: {
      [primaryUseCase.key]: Number(primaryShare.toFixed(4)),
      [secondaryUseCase.key]: Number(secondaryShare.toFixed(4)),
    },
  };
};

// Applies intent and smaller questionnaire nudges onto the base weights.
const applyWeightModifiers = (baseWeights = {}, answers = {}, intent) => {
  const weights = { ...baseWeights };

  addScores(weights, INTENT_WEIGHT_MODIFIERS[intent] || {});

  Object.entries(QUESTION_WEIGHT_MODIFIERS).forEach(
    ([questionKey, optionModifiers]) => {
      if (questionKey === "preferred_brands") {
        if (toSelections(answers.preferred_brands).length) {
          addScores(weights, optionModifiers.__selected__ || {});
        }
        return;
      }

      toSelections(answers[questionKey]).forEach((selection) => {
        addScores(weights, optionModifiers[selection] || {});
      });
    },
  );

  return normalizeWeights(weights);
};

// Merges one hard-filter fragment into the final SQL + JS criteria object.
const mergeHardFilterFragment = (target, fragment = {}) => {
  if (fragment.dbFilters) {
    Object.assign(target.dbFilters, fragment.dbFilters);
  }

  if (!fragment.criteria) return target;

  Object.entries(fragment.criteria).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      target.criteria[key] = [
        ...new Set([...(target.criteria[key] || []), ...value]),
      ];
      return;
    }

    target.criteria[key] = value;
  });

  return target;
};

// Translates questionnaire answers into the small set of hard constraints we enforce.
const translateAnswersToHardFilters = (answers = {}) =>
  Object.entries(HARD_FILTERS).reduce(
    (result, [questionKey, translator]) =>
      mergeHardFilterFragment(
        result,
        translator(answers[questionKey], answers),
      ),
    { dbFilters: {}, criteria: {} },
  );

// Derives a normalized fuel type from the raw specs payload.
const getFuelType = (car = {}) => {
  if (car?.is_ev === true) return "electric";

  const engineDescription = normalizeText(
    car?.standard_engine ?? car?.engine_type ?? car?.fuel_type,
  );

  if (!engineDescription) return null;
  if (
    engineDescription.includes("plug in hybrid") ||
    engineDescription.includes("plug-in hybrid") ||
    engineDescription.includes("phev") ||
    engineDescription.includes("hybrid") ||
    engineDescription.includes("mhev") ||
    engineDescription.includes("hev") ||
    engineDescription.includes("e-power") ||
    engineDescription.includes("e power")
  ) {
    return "hybrid";
  }
  if (engineDescription.includes("diesel")) return "diesel";
  if (
    engineDescription.includes("petrol") ||
    engineDescription.includes("gasoline")
  ) {
    return "petrol";
  }
  return "petrol";
};

// Derives a normalized transmission type from the raw specs payload.
const getTransmissionType = (car = {}) => {
  const transmission = normalizeText(car?.transmission);

  if (!transmission) return null;
  if (
    transmission.includes("auto") ||
    transmission.includes("automatic") ||
    transmission.includes("dct") ||
    transmission.includes("cvt") ||
    transmission.includes("pdk") ||
    transmission.includes("geartronic") ||
    transmission.includes("tiptronic")
  ) {
    return "automatic";
  }
  if (transmission.includes("manual")) return "manual";
  return null;
};

// Applies the explicit budget ceiling if one was selected.
const matchesBudget = (car, criteria = {}) => {
  if (criteria.maxPrice === undefined) return true;
  const price = parseNumber(car?.price);
  return price !== null && price <= criteria.maxPrice;
};

// Applies the explicit fuel preference when the user selected one.
const matchesFuel = (car, criteria = {}) => {
  if (!criteria.fuel) return true;
  return getFuelType(car) === criteria.fuel;
};

// Applies the explicit transmission preference when the user selected one.
const matchesTransmission = (car, criteria = {}) => {
  if (!criteria.transmission) return true;
  return getTransmissionType(car) === criteria.transmission;
};

// Checks whether a car belongs to one of the preferred body-style families.
const matchesPreferredBodyStyle = (car, criteria = {}) => {
  if (!criteria.bodyStyleTerms?.length) return true;
  const bodyStyle = normalizeText(car?.body_style);
  return criteria.bodyStyleTerms.some((term) => bodyStyle.includes(term));
};

// Runs every explicit hard filter against one car row.
const passesHardFilters = (car, criteria = {}) =>
  matchesBudget(car, criteria) &&
  matchesFuel(car, criteria) &&
  matchesTransmission(car, criteria);

// Narrows the shortlist by preferred body style, but falls back cleanly when the
// catalogue simply has no cars in that shape.
const getPreferredBodyStyleMatches = (cars = [], criteria = {}) => {
  if (!criteria.bodyStyleTerms?.length) return cars;
  return cars.filter((car) => matchesPreferredBodyStyle(car, criteria));
};

// Builds the filter-debug breakdown returned by the endpoint's debug mode.
const getHardFilterBreakdown = (cars = [], criteria = {}) => {
  const checks = [
    {
      key: "budget",
      active: criteria.maxPrice !== undefined,
      passes: (car) => matchesBudget(car, criteria),
      label: "Budget",
    },
    {
      key: "fuel",
      active: Boolean(criteria.fuel),
      passes: (car) => matchesFuel(car, criteria),
      label: "Fuel type",
    },
    {
      key: "transmission",
      active: Boolean(criteria.transmission),
      passes: (car) => matchesTransmission(car, criteria),
      label: "Transmission",
    },
    {
      key: "bodyStyle",
      active:
        Array.isArray(criteria.bodyStyleTerms) &&
        criteria.bodyStyleTerms.length > 0,
      passes: (car) => matchesPreferredBodyStyle(car, criteria),
      label: "Body style",
    },
  ].filter((check) => check.active);

  let remainingCars = [...cars];

  return checks.map((check) => {
    remainingCars = remainingCars.filter((car) => check.passes(car));
    return {
      key: check.key,
      label: check.label,
      remainingCount: remainingCars.length,
    };
  });
};

// Drops hard filters that the current shortlist cannot support because the
// source data is effectively absent.
const adjustUnsupportedCriteria = (cars = [], criteria = {}) => {
  const nextCriteria = { ...criteria };
  const criteriaAdjustments = [];

  if (criteria.transmission) {
    const recognizedCount = cars.filter((car) =>
      Boolean(getTransmissionType(car)),
    ).length;
    const coverage = cars.length ? recognizedCount / cars.length : 0;

    if (coverage < 0.1) {
      delete nextCriteria.transmission;
      criteriaAdjustments.push({
        key: "transmission",
        reason:
          "Transmission preference was not enforced because this shortlist has almost no transmission data.",
      });
    }
  }

  return {
    criteria: nextCriteria,
    criteriaAdjustments,
  };
};

// Relaxes one over-strict fuel preference when it eliminates the entire shortlist.
const relaxEmptyFuelFilter = (cars = [], criteria = {}) => {
  if (!criteria.fuel || criteria.fuel === "electric") {
    return {
      criteria,
      criteriaAdjustments: [],
      filteredCars: cars.filter((car) => passesHardFilters(car, criteria)),
    };
  }

  const filteredCars = cars.filter((car) => passesHardFilters(car, criteria));
  if (filteredCars.length) {
    return { criteria, criteriaAdjustments: [], filteredCars };
  }

  const relaxedCriteria = { ...criteria };
  delete relaxedCriteria.fuel;

  return {
    criteria: relaxedCriteria,
    criteriaAdjustments: [
      {
        key: "fuel",
        reason:
          "Fuel preference was not enforced because it removed the entire shortlist.",
      },
    ],
    filteredCars: cars.filter((car) => passesHardFilters(car, relaxedCriteria)),
  };
};

// Enforces the 50% threshold used by the result screen.
const filterRecommendationsByMatchScore = (cars = []) =>
  cars.filter(
    (car) =>
      Number.isFinite(car?.matchScore) &&
      car.matchScore >= MINIMUM_RECOMMENDATION_MATCH_SCORE,
  );

// Lets a preferred-brand car take the lead when it is already close enough in fit.
const promotePreferredBrandLead = (rankedCars = [], answers = {}) => {
  const preferredBrands = toSelections(answers.preferred_brands).map(
    normalizeBrandKey,
  );
  if (rankedCars.length < 2 || !preferredBrands.length) return rankedCars;

  const leadCar = rankedCars[0];
  const leadIsPreferred = preferredBrands.includes(
    normalizeBrandKey(leadCar?.brand_name),
  );
  if (leadIsPreferred) return rankedCars;

  const preferredBrandCar = rankedCars.find((car) =>
    preferredBrands.includes(normalizeBrandKey(car?.brand_name)),
  );
  if (!preferredBrandCar) return rankedCars;

  const leadScore = parseNumber(leadCar?.matchScore);
  const preferredScore = parseNumber(preferredBrandCar?.matchScore);
  if (
    leadScore === null ||
    preferredScore === null ||
    leadScore - preferredScore > PREFERRED_BRAND_PROMOTION_MAX_MATCH_GAP
  ) {
    return rankedCars;
  }

  return [
    preferredBrandCar,
    ...rankedCars.filter((car) => car !== preferredBrandCar),
  ];
};

// Runs the full recommendation pipeline over an already-fetched candidate set.
const recommendCars = (cars = [], answers = {}, limit = 5) => {
  const { useCase, useCaseScores, useCaseBlend } = determineUseCase(answers);
  const { intent, intentScores } = determineIntent(answers);
  const profileLabel = getProfileLabel(useCase, intent);
  const { baseWeights, useCaseWeightBlend } = getBaseWeightsForUseCase(
    useCase,
    useCaseScores,
  );
  const weights = applyWeightModifiers(baseWeights, answers, intent);
  const { criteria: requestedCriteria, dbFilters } =
    translateAnswersToHardFilters(answers);
  const {
    criteria: supportedCriteria,
    criteriaAdjustments: supportAdjustments,
  } = adjustUnsupportedCriteria(cars, requestedCriteria);
  const {
    criteria,
    criteriaAdjustments: emptyFuelAdjustments,
    filteredCars: hardFilteredCars,
  } = relaxEmptyFuelFilter(cars, supportedCriteria);
  const criteriaAdjustments = [...supportAdjustments, ...emptyFuelAdjustments];
  const hardFilterBreakdown = getHardFilterBreakdown(cars, criteria);
  const requestedHardFilterBreakdown = getHardFilterBreakdown(
    cars,
    requestedCriteria,
  );
  const preferredBodyStyleMatches = getPreferredBodyStyleMatches(
    hardFilteredCars,
    criteria,
  );
  const exactMatches = preferredBodyStyleMatches.length
    ? preferredBodyStyleMatches
    : hardFilteredCars;
  const scoring = createRecommendationScoring({
    cars: exactMatches,
    criteria,
    weights,
  });

  const rankedCars = scoring.buildScoredCars({
    cars: exactMatches,
    useCase,
    intent,
    profileLabel,
  });

  const promotedCars = promotePreferredBrandLead(rankedCars, answers);
  const recommendations = filterRecommendationsByMatchScore(promotedCars).slice(
    0,
    limit,
  );

  let recommendationNote = "";
  if (!hardFilteredCars.length) {
    recommendationNote = "No cars met your explicit hard filters.";
  } else if (!recommendations.length) {
    recommendationNote =
      "Cars passed the filters, but none cleared the 50% match threshold.";
  } else if (
    criteria.bodyStyleTerms?.length &&
    !preferredBodyStyleMatches.length
  ) {
    recommendationNote =
      "No cars matched your preferred body style exactly, so the closest overall fits were shown instead.";
  }

  if (criteriaAdjustments.length) {
    const adjustmentText = criteriaAdjustments
      .map((item) => item.reason)
      .join(" ");
    recommendationNote = recommendationNote
      ? `${adjustmentText} ${recommendationNote}`
      : adjustmentText;
  }

  return {
    dbFilters,
    criteria,
    requestedCriteria: { ...requestedCriteria },
    useCase,
    useCaseScores,
    useCaseBlend,
    useCaseWeightBlend,
    intent,
    intentScores,
    profileLabel,
    primaryDriverType: useCase,
    typeScores: useCaseScores,
    weights,
    recommendations,
    exactMatchCount: preferredBodyStyleMatches.length || exactMatches.length,
    exactMatchIds: (preferredBodyStyleMatches.length
      ? preferredBodyStyleMatches
      : exactMatches
    )
      .map((car) => car.car_id)
      .filter(Boolean),
    budgetFallbackApplied: false,
    recommendationNote,
    criteriaAdjustments,
    requestedHardFilterBreakdown,
    hardFilterBreakdown,
  };
};

module.exports = {
  determineUseCase,
  determineIntent,
  getProfileLabel,
  getBaseWeightsForUseCase,
  applyWeightModifiers,
  translateAnswersToHardFilters,
  getFuelType,
  getTransmissionType,
  passesHardFilters,
  recommendCars,
};
