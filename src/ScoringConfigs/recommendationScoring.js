const {
  BODY_STYLE_FAMILY_TERMS,
  BODY_STYLE_METRIC_SCORES,
  BODY_STYLE_OPTION_LABELS,
  normalizeBrandKey,
} = require("./recommendationConfig");

// Parses nullable numeric source values into a consistent number-or-null shape.
const parseNumber = (value) => {
  const parsedValue = Number.parseFloat(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

// Normalizes raw strings before matching body styles, engines, or brands.
const normalizeText = (value = "") =>
  `${value}`.trim().toLowerCase().replace(/\s+/g, " ");

// Keeps fit scores bounded between 0 and 1.
const clamp = (value) => Math.max(0, Math.min(1, value));

// Averages available scores while falling back to a neutral midpoint when data is sparse.
const averageScores = (scores = [], fallback = 0.5) => {
  const validScores = scores.filter(
    (score) => score !== null && Number.isFinite(score),
  );
  if (!validScores.length) return fallback;
  return validScores.reduce((total, score) => total + score, 0) / validScores.length;
};

// Builds min/max ranges once for the active shortlist so each fit score is relative.
const buildRanges = (cars = []) => {
  const metricGetters = {
    price: (car) => parseNumber(car?.price),
    efficiency: (car) =>
      parseNumber(
        car?.is_ev ? car?.ev_range ?? car?.estimated_electric_range : car?.combined_mpg ?? car?.epa_combined,
      ),
    horsepower: (car) => parseNumber(car?.horsepower),
    acceleration: (car) => parseNumber(car?.zero_to_sixty_mph),
    seating: (car) => parseNumber(car?.max_seating_capacity ?? car?.seat_count),
    bootSpace: (car) => parseNumber(car?.boot_space_liters ?? car?.cargo_capacity),
    curbWeight: (car) => parseNumber(car?.curb_weight),
  };

  return Object.fromEntries(
    Object.entries(metricGetters).map(([key, getter]) => {
      const values = cars
        .map((car) => getter(car))
        .filter((value) => value !== null && Number.isFinite(value));

      if (!values.length) return [key, null];

      return [
        key,
        {
          min: Math.min(...values),
          max: Math.max(...values),
        },
      ];
    }),
  );
};

// Scores higher numeric values as better relative to the active shortlist.
const normalizeHigher = (value, range) => {
  if (value === null || !range) return null;
  if (range.max === range.min) return 1;
  return clamp((value - range.min) / (range.max - range.min));
};

// Scores lower numeric values as better relative to the active shortlist.
const normalizeLower = (value, range) => {
  if (value === null || !range) return null;
  if (range.max === range.min) return 1;
  return clamp(1 - (value - range.min) / (range.max - range.min));
};

// Scores values that sit closest to the middle of a range.
const normalizeMiddle = (value, range) => {
  if (value === null || !range) return null;
  if (range.max === range.min) return 1;
  const midpoint = (range.max + range.min) / 2;
  const halfSpan = (range.max - range.min) / 2 || 1;
  return clamp(1 - Math.abs(value - midpoint) / halfSpan);
};

// Collapses raw body-style strings into one small family set.
const getBodyStyleFamily = (car = {}) => {
  const bodyStyle = normalizeText(car?.body_style);
  for (const [family, terms] of Object.entries(BODY_STYLE_FAMILY_TERMS)) {
    if (terms.some((term) => bodyStyle.includes(term))) return family;
  }
  return "other";
};

// Looks up the static body-style fit value for a metric.
const getBodyStyleScore = (metricKey, car) => {
  const family = getBodyStyleFamily(car);
  return BODY_STYLE_METRIC_SCORES[metricKey]?.[family] ?? 0.5;
};

// Converts the user’s selected body styles into readable UI copy.
const getSelectedBodyStyleLabel = (criteria = {}) => {
  const labels = (criteria.bodyStyleKeys || [])
    .map((key) => BODY_STYLE_OPTION_LABELS[key])
    .filter(Boolean);

  if (!labels.length) return "selected body-style";
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} or ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, or ${labels[labels.length - 1]}`;
};

// Builds the metric-level scorer and the user-facing note for each fit category.
const METRIC_BUILDERS = {
  brandFit: {
    label: "Brand fit",
    getScore: (car, context) => {
      if (!context.criteria.preferredBrands?.length) return null;
      return context.criteria.preferredBrands.includes(
        normalizeBrandKey(car?.brand_name),
      )
        ? 1
        : 0.2;
    },
    getNote: (car, context, score) =>
      score >= 0.75
        ? `Matches your preferred brand choice: ${car?.brand_name || "selected brand"}.`
        : "Does not match one of your preferred brands.",
  },
  runningCostFit: {
    label: "Running-cost fit",
    getScore: (car, context) =>
      averageScores(
        [
          normalizeLower(parseNumber(car?.price), context.ranges.price),
          normalizeHigher(
            parseNumber(
              car?.is_ev
                ? car?.ev_range ?? car?.estimated_electric_range
                : car?.combined_mpg ?? car?.epa_combined,
            ),
            context.ranges.efficiency,
          ),
        ],
        0.5,
      ),
    getNote: (car, _context, score) =>
      score >= 0.7
        ? "Looks strong on price and day-to-day running cost."
        : "Weaker on price or efficiency than the stronger shortlist options.",
  },
  cityFit: {
    label: "City fit",
    getScore: (car, context) =>
      averageScores(
        [
          getBodyStyleScore("cityFit", car),
          normalizeLower(
            parseNumber(car?.curb_weight),
            context.ranges.curbWeight,
          ),
        ],
        0.5,
      ),
    getNote: (car, _context, score) =>
      score >= 0.7
        ? "More compact and town-friendly for urban driving."
        : "Bulkier or less city-focused than the best urban matches.",
  },
  comfortFit: {
    label: "Comfort fit",
    getScore: (car, context) =>
      averageScores(
        [
          getBodyStyleScore("comfortFit", car),
          normalizeHigher(parseNumber(car?.price), context.ranges.price),
        ],
        0.5,
      ),
    getNote: (_car, _context, score) =>
      score >= 0.7
        ? "Leans more toward calm, comfortable long-term use."
        : "Less comfort-led than the strongest shortlist options.",
  },
  performanceFit: {
    label: "Performance fit",
    getScore: (car, context) =>
      averageScores(
        [
          getBodyStyleScore("performanceFit", car),
          normalizeHigher(
            parseNumber(car?.horsepower),
            context.ranges.horsepower,
          ),
          normalizeLower(
            parseNumber(car?.zero_to_sixty_mph),
            context.ranges.acceleration,
          ),
        ],
        0.5,
      ),
    getNote: (_car, _context, score) =>
      score >= 0.7
        ? "Stronger pace and acceleration for this shortlist."
        : "Less performance-focused than the sharper alternatives here.",
  },
  practicalFit: {
    label: "Practicality fit",
    getScore: (car, context) =>
      averageScores(
        [
          getBodyStyleScore("practicalFit", car),
          normalizeHigher(
            parseNumber(car?.boot_space_liters ?? car?.cargo_capacity),
            context.ranges.bootSpace,
          ),
          normalizeHigher(
            parseNumber(car?.max_seating_capacity ?? car?.seat_count),
            context.ranges.seating,
          ),
        ],
        0.5,
      ),
    getNote: (_car, _context, score) =>
      score >= 0.7
        ? "Offers stronger everyday usefulness through seats and cargo space."
        : "Gives up some day-to-day practicality compared with the stronger options.",
  },
  roadTripFit: {
    label: "Road-trip fit",
    getScore: (car, context) =>
      averageScores(
        [
          getBodyStyleScore("roadTripFit", car),
          normalizeHigher(
            parseNumber(
              car?.is_ev
                ? car?.ev_range ?? car?.estimated_electric_range
                : car?.combined_mpg ?? car?.epa_combined,
            ),
            context.ranges.efficiency,
          ),
          normalizeHigher(
            parseNumber(car?.boot_space_liters ?? car?.cargo_capacity),
            context.ranges.bootSpace,
          ),
        ],
        0.5,
      ),
    getNote: (_car, _context, score) =>
      score >= 0.7
        ? "Better suited to longer trips with stronger range and luggage ability."
        : "Less convincing for longer trips than the best tourer-style matches.",
  },
  spaceFit: {
    label: "Passenger / space fit",
    getScore: (car, context) => {
      const bodyStyle = normalizeText(car?.body_style);
      const styleMatch = context.criteria.bodyStyleTerms?.length
        ? context.criteria.bodyStyleTerms.some((term) => bodyStyle.includes(term))
          ? 1
          : 0.2
        : null;

      return averageScores(
        [
          styleMatch,
          normalizeHigher(
            parseNumber(car?.max_seating_capacity ?? car?.seat_count),
            context.ranges.seating,
          ),
          normalizeHigher(
            parseNumber(car?.boot_space_liters ?? car?.cargo_capacity),
            context.ranges.bootSpace,
          ),
        ],
        0.5,
      );
    },
    getNote: (_car, context, score) =>
      score >= 0.7
        ? `Lines up well with your ${getSelectedBodyStyleLabel(context.criteria)} preference.`
        : `Less aligned with your ${getSelectedBodyStyleLabel(context.criteria)} preference.`,
  },
  sizeFit: {
    label: "Size fit",
    getScore: (car, context) => {
      const weight = parseNumber(car?.curb_weight);
      const bootSpace = parseNumber(car?.boot_space_liters ?? car?.cargo_capacity);
      const seating = parseNumber(car?.max_seating_capacity ?? car?.seat_count);

      switch (context.criteria.vehicleSize) {
        case "q_size_small":
          return averageScores(
            [
              normalizeLower(weight, context.ranges.curbWeight),
              normalizeLower(bootSpace, context.ranges.bootSpace),
            ],
            0.5,
          );
        case "q_size_large":
          return averageScores(
            [
              normalizeHigher(weight, context.ranges.curbWeight),
              normalizeHigher(bootSpace, context.ranges.bootSpace),
              normalizeHigher(seating, context.ranges.seating),
            ],
            0.5,
          );
        case "q_size_medium":
          return averageScores(
            [
              normalizeMiddle(weight, context.ranges.curbWeight),
              normalizeMiddle(bootSpace, context.ranges.bootSpace),
            ],
            0.5,
          );
        default:
          return 0.5;
      }
    },
    getNote: (_car, context, score) => {
      const label =
        context.criteria.vehicleSize === "q_size_small"
          ? "smaller / lighter"
          : context.criteria.vehicleSize === "q_size_large"
            ? "larger / roomier"
            : "mid-size / balanced";

      return score >= 0.7
        ? `Closer to your preferred ${label} feel.`
        : `Less aligned with your preferred ${label} feel.`;
    },
  },
};

// Uses the strongest weighted metrics as the "priority" rows in UI breakdowns.
const getPriorityKeys = (weights = {}) =>
  Object.entries(weights)
    .filter(([, weight]) => Number.isFinite(weight) && weight > 0)
    .sort(([, leftWeight], [, rightWeight]) => rightWeight - leftWeight)
    .slice(0, 3)
    .map(([key]) => key);

// Turns weighted metric results into the breakdown rows used by the UI and tooling.
const buildBreakdown = (metricResults = [], totalScore = 0, priorityKeys = []) =>
  metricResults
    .filter((result) => result.weight > 0)
    .sort((left, right) => right.contribution - left.contribution)
    .map((result) => ({
      key: result.key,
      label: result.label,
      fitScore: Math.round(result.fit * 100),
      impactPercent:
        totalScore > 0
          ? Math.max(1, Math.round((result.contribution / totalScore) * 100))
          : 0,
      note: result.note,
      priority: priorityKeys.includes(result.key),
    }));

// Keeps the card copy readable by using the strongest positive breakdown notes.
const buildTopReasons = (breakdown = []) => {
  const reasons = [];
  const seenReasons = new Set();

  breakdown.forEach((entry) => {
    if (reasons.length >= 3) return;
    if (entry.fitScore < 60) return;
    if (!entry.note || seenReasons.has(entry.note)) return;
    seenReasons.add(entry.note);
    reasons.push(entry.note);
  });

  return reasons;
};

// Creates one scoring instance for a recommendation run.
const createRecommendationScoring = ({
  cars = [],
  criteria = {},
  weights = {},
} = {}) => {
  const ranges = buildRanges(cars);
  const priorityKeys = getPriorityKeys(weights);

  // Scores one car against the active questionnaire context.
  const scoreCar = (car, meta = {}) => {
    const metricResults = Object.entries(weights)
      .filter(([, weight]) => Number.isFinite(weight) && weight > 0)
      .map(([metricKey, weight]) => {
        const builder = METRIC_BUILDERS[metricKey];
        if (!builder) return null;

        const fit = clamp(
          builder.getScore(car, {
            criteria,
            ranges,
          }) ?? 0.5,
        );

        return {
          key: metricKey,
          label: builder.label,
          weight,
          fit,
          contribution: fit * weight,
          note: builder.getNote(car, { criteria, ranges }, fit),
        };
      })
      .filter(Boolean);

    const score = Number(
      metricResults
        .reduce((total, result) => total + result.contribution, 0)
        .toFixed(4),
    );

    const recommendationBreakdown = buildBreakdown(
      metricResults,
      score,
      priorityKeys,
    );

    return {
      ...car,
      score,
      matchScore: score,
      recommendationBreakdown,
      topReasons: buildTopReasons(recommendationBreakdown),
      useCase: meta.useCase,
      intent: meta.intent,
      profileLabel: meta.profileLabel,
      primaryDriverType: meta.useCase,
    };
  };

  // Scores and orders the shortlist in one pass.
  const buildScoredCars = ({
    cars: inputCars = [],
    useCase,
    intent,
    profileLabel,
  } = {}) =>
    inputCars
      .map((car) =>
        scoreCar(car, {
          useCase,
          intent,
          profileLabel,
        }),
      )
      .sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;
        return (parseNumber(left?.price) ?? Infinity) - (parseNumber(right?.price) ?? Infinity);
      });

  return { buildScoredCars };
};

module.exports = { createRecommendationScoring };
