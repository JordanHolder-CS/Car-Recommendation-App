const fs = require("node:fs");
const path = require("node:path");

require("dotenv").config();
require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });

const carModel = require("../models/carModel");
const {
  determineIntent,
  determineUseCase,
  getBaseWeightsForUseCase,
  applyWeightModifiers,
  recommendCars,
} = require("../services/recommendationService");

const LIMIT = 5;

const USE_CASE_AXES = {
  drive_style: ["q1_city", "q1_long_distance", "q1_mixed", "q1_weekend"],
  usage_pattern: [
    "q8_commute",
    "q8_errands",
    "q8_roadtrips",
    "q8_work",
    "q8_family",
  ],
};

const INTENT_AXES = {
  priority: [
    "q6_running_costs",
    "q6_comfort",
    "q6_performance",
    "q6_practicality",
  ],
  ownership_intent: [
    "q9_daily",
    "q9_balanced",
    "q9_fun",
    "q9_luxury",
    "q9_pure_performance",
  ],
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

const createCar = (overrides) => ({
  transmission: "Automatic",
  reliability: 80,
  ...overrides,
});

const buildDemoCars = () => {
  const cars = [];

  for (let index = 0; index < 10; index += 1) {
    cars.push(
      createCar({
        car_id: index + 1,
        car_name: `City Hatch ${index + 1}`,
        brand_name: "Metro",
        price: 14000 + index * 900,
        body_style: "hatchback",
        horsepower: 82 + index * 6,
        zero_to_sixty_mph: 12.4 - index * 0.2,
        combined_mpg: 58 - index * 1.1,
        service_cost: 240 + index * 18,
        insurance_estimate: 410 + index * 22,
        max_seating_capacity: 5,
        boot_space_liters: 280 + index * 9,
        model_year: 2021 + (index % 4),
        curb_weight: 940 + index * 18,
        drivetrain: "FWD",
      }),
    );
  }

  for (let index = 0; index < 10; index += 1) {
    cars.push(
      createCar({
        car_id: 100 + index + 1,
        car_name: `Family SUV ${index + 1}`,
        brand_name: "Summit",
        price: 30000 + index * 1200,
        body_style: "suv",
        horsepower: 165 + index * 8,
        zero_to_sixty_mph: 9.1 - index * 0.13,
        combined_mpg: 41 - index * 0.6,
        service_cost: 420 + index * 20,
        insurance_estimate: 760 + index * 28,
        max_seating_capacity: 5 + (index % 3 === 0 ? 2 : 0),
        boot_space_liters: 560 + index * 14,
        model_year: 2022 + (index % 3),
        curb_weight: 1620 + index * 24,
        drivetrain: index % 2 === 0 ? "AWD" : "FWD",
      }),
    );
  }

  for (let index = 0; index < 10; index += 1) {
    cars.push(
      createCar({
        car_id: 200 + index + 1,
        car_name: `Sport Coupe ${index + 1}`,
        brand_name: "Apex",
        price: 39000 + index * 2200,
        body_style: "coupe",
        horsepower: 255 + index * 18,
        zero_to_sixty_mph: 6.2 - index * 0.18,
        combined_mpg: 34 - index * 0.5,
        service_cost: 620 + index * 30,
        insurance_estimate: 1100 + index * 55,
        max_seating_capacity: 4,
        boot_space_liters: 260 + index * 7,
        model_year: 2022 + (index % 3),
        curb_weight: 1380 + index * 22,
        drivetrain: index % 3 === 0 ? "AWD" : "RWD",
      }),
    );
  }

  for (let index = 0; index < 8; index += 1) {
    cars.push(
      createCar({
        car_id: 300 + index + 1,
        car_name: `Executive Sedan ${index + 1}`,
        brand_name: "Regent",
        price: 33000 + index * 1700,
        body_style: "sedan",
        horsepower: 185 + index * 10,
        zero_to_sixty_mph: 8.0 - index * 0.14,
        combined_mpg: 47 - index * 0.6,
        service_cost: 460 + index * 22,
        insurance_estimate: 820 + index * 35,
        max_seating_capacity: 5,
        boot_space_liters: 430 + index * 8,
        model_year: 2022 + (index % 3),
        curb_weight: 1500 + index * 20,
        drivetrain: index % 2 === 0 ? "AWD" : "FWD",
      }),
    );
  }

  for (let index = 0; index < 8; index += 1) {
    cars.push(
      createCar({
        car_id: 400 + index + 1,
        car_name: `Work Utility ${index + 1}`,
        brand_name: "Tasker",
        price: 32000 + index * 1500,
        body_style: index % 2 === 0 ? "pickup" : "estate",
        horsepower: 175 + index * 9,
        zero_to_sixty_mph: 9.8 - index * 0.12,
        combined_mpg: 36 - index * 0.4,
        service_cost: 500 + index * 22,
        insurance_estimate: 880 + index * 40,
        max_seating_capacity: 5,
        boot_space_liters: 620 + index * 18,
        model_year: 2021 + (index % 4),
        curb_weight: 1760 + index * 28,
        drivetrain: "AWD",
      }),
    );
  }

  return cars;
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const parsed = { limit: LIMIT };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--cars") {
      parsed.carsPath = args[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--demo") {
      parsed.demo = true;
      continue;
    }

    if (arg === "--limit") {
      const parsedLimit = Number.parseInt(args[index + 1], 10);
      if (Number.isFinite(parsedLimit) && parsedLimit > 0) {
        parsed.limit = parsedLimit;
      }
      index += 1;
    }
  }

  return parsed;
};

const loadCarsFromJson = (carsPath) => {
  const absolutePath = path.resolve(carsPath);
  const contents = fs.readFileSync(absolutePath, "utf8");
  const parsed = JSON.parse(contents);

  if (!Array.isArray(parsed)) {
    throw new Error(`Expected JSON array in ${absolutePath}`);
  }

  return parsed;
};

const loadCars = async (options = {}) => {
  if (options.carsPath) {
    return { cars: loadCarsFromJson(options.carsPath), source: options.carsPath };
  }

  if (!options.demo && process.env.DATABASE_URL) {
    return { cars: await carModel.findFiltered({}), source: "database" };
  }

  return { cars: buildDemoCars(), source: "demo-fixture" };
};

const getScoreMargin = (scores = {}, chosenKey) => {
  const orderedScores = Object.entries(scores)
    .map(([key, value]) => [key, Number(value) || 0])
    .sort((left, right) => right[1] - left[1]);
  const chosenScore = orderedScores.find(([key]) => key === chosenKey)?.[1] || 0;
  const runnerUpScore =
    orderedScores.find(([key]) => key !== chosenKey)?.[1] || 0;

  return chosenScore - runnerUpScore;
};

const chooseUseCasePresets = () => {
  const presets = {};

  USE_CASE_AXES.drive_style.forEach((driveStyle) => {
    USE_CASE_AXES.usage_pattern.forEach((usagePattern) => {
      const answers = { drive_style: driveStyle, usage_pattern: usagePattern };
      const result = determineUseCase(answers);
      const margin = getScoreMargin(result.useCaseScores, result.useCase);
      const existing = presets[result.useCase];

      if (
        !existing ||
        margin > existing.margin ||
        (margin === existing.margin &&
          Object.values(result.useCaseScores).reduce((sum, value) => sum + value, 0) >
            existing.totalScore)
      ) {
        presets[result.useCase] = {
          answers,
          actual: result.useCase,
          scores: result.useCaseScores,
          margin,
          totalScore: Object.values(result.useCaseScores).reduce(
            (sum, value) => sum + value,
            0,
          ),
        };
      }
    });
  });

  return Object.fromEntries(
    USE_CASE_ORDER.filter((key) => presets[key]).map((key) => [key, presets[key]]),
  );
};

const chooseIntentPresets = () => {
  const presets = {};

  INTENT_AXES.priority.forEach((priority) => {
    INTENT_AXES.ownership_intent.forEach((ownershipIntent) => {
      const answers = {
        priority,
        ownership_intent: ownershipIntent,
      };
      const result = determineIntent(answers);
      const margin = getScoreMargin(result.intentScores, result.intent);
      const existing = presets[result.intent];

      if (
        !existing ||
        margin > existing.margin ||
        (margin === existing.margin &&
          Object.values(result.intentScores).reduce((sum, value) => sum + value, 0) >
            existing.totalScore)
      ) {
        presets[result.intent] = {
          answers,
          actual: result.intent,
          scores: result.intentScores,
          margin,
          totalScore: Object.values(result.intentScores).reduce(
            (sum, value) => sum + value,
            0,
          ),
        };
      }
    });
  });

  return Object.fromEntries(
    INTENT_ORDER.filter((key) => presets[key]).map((key) => [key, presets[key]]),
  );
};

const getTopIds = (recommendations = [], limit = LIMIT) =>
  recommendations.slice(0, limit).map((car) => car.car_id);

const countIntersection = (left = [], right = []) => {
  const rightSet = new Set(right);
  return left.filter((value) => rightSet.has(value)).length;
};

const getWeightDistance = (leftWeights = {}, rightWeights = {}) => {
  const keys = [...new Set([...Object.keys(leftWeights), ...Object.keys(rightWeights)])];

  return keys.reduce(
    (sum, key) => sum + Math.abs((leftWeights[key] || 0) - (rightWeights[key] || 0)),
    0,
  );
};

const createRun = (cars, answers, limit) => {
  const useCaseResult = determineUseCase(answers);
  const intentResult = determineIntent(answers);
  const { baseWeights } = getBaseWeightsForUseCase(
    useCaseResult.useCase,
    useCaseResult.useCaseScores,
  );
  const weights = applyWeightModifiers(
    baseWeights,
    answers,
    intentResult.intent,
  );
  const recommendationResult = recommendCars(cars, answers, limit);

  return {
    answers,
    useCase: useCaseResult.useCase,
    intent: intentResult.intent,
    weights,
    topIds: getTopIds(recommendationResult.recommendations, limit),
    leadId: recommendationResult.recommendations[0]?.car_id ?? null,
  };
};

const summarizeScenarioRuns = (runs = [], limit = LIMIT) => {
  const pairwiseRows = [];
  const uniqueTopIds = new Set();
  const uniqueLeadIds = new Set();

  runs.forEach((run) => {
    run.topIds.forEach((id) => uniqueTopIds.add(id));
    if (run.leadId !== null) uniqueLeadIds.add(run.leadId);
  });

  for (let leftIndex = 0; leftIndex < runs.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < runs.length; rightIndex += 1) {
      const leftRun = runs[leftIndex];
      const rightRun = runs[rightIndex];
      const overlapCount = countIntersection(leftRun.topIds, rightRun.topIds);

      pairwiseRows.push({
        top1Changed: leftRun.leadId !== rightRun.leadId ? 1 : 0,
        overlapPct: overlapCount / Math.max(1, limit),
        entrantCount: Math.max(0, limit - overlapCount),
        weightDistance: getWeightDistance(leftRun.weights, rightRun.weights),
      });
    }
  }

  const pairCount = pairwiseRows.length;

  return {
    runCount: runs.length,
    pairCount,
    uniqueTop5Cars: uniqueTopIds.size,
    uniqueLeadCars: uniqueLeadIds.size,
    top1ChangeRate:
      pairwiseRows.reduce((sum, row) => sum + row.top1Changed, 0) /
      Math.max(1, pairCount),
    avgTop5OverlapPct:
      pairwiseRows.reduce((sum, row) => sum + row.overlapPct, 0) /
      Math.max(1, pairCount),
    avgNewEntrants:
      pairwiseRows.reduce((sum, row) => sum + row.entrantCount, 0) /
      Math.max(1, pairCount),
    avgWeightDistance:
      pairwiseRows.reduce((sum, row) => sum + row.weightDistance, 0) /
      Math.max(1, pairCount),
  };
};

const formatPct = (value) => `${(value * 100).toFixed(1)}%`;
const formatNumber = (value) => value.toFixed(2);

const printPresetTable = (title, presets, order, type) => {
  const header = [
    type.padEnd(14),
    "Answers".padEnd(42),
    "Margin".padStart(8),
  ].join(" ");

  console.log(`\n${title}`);
  console.log(header);
  console.log("-".repeat(header.length));

  order.forEach((key) => {
    const preset = presets[key];
    if (!preset) return;

    const answerText = Object.entries(preset.answers)
      .map(([answerKey, value]) => `${answerKey}=${value}`)
      .join(", ");

    console.log(
      [key.padEnd(14), answerText.padEnd(42), formatNumber(preset.margin).padStart(8)].join(
        " ",
      ),
    );
  });
};

const printScenarioTable = (title, rows, labelKey) => {
  const header = [
    labelKey.padEnd(14),
    "Runs".padStart(6),
    "Pairs".padStart(6),
    "#1Change".padStart(10),
    "Top5Keep".padStart(10),
    "NewInTop5".padStart(10),
    "UniqueTop5".padStart(11),
    "Unique#1".padStart(9),
    "WeightΔ".padStart(9),
  ].join(" ");

  console.log(`\n${title}`);
  console.log(header);
  console.log("-".repeat(header.length));

  rows.forEach((row) => {
    console.log(
      [
        row.label.padEnd(14),
        String(row.runCount).padStart(6),
        String(row.pairCount).padStart(6),
        formatPct(row.top1ChangeRate).padStart(10),
        formatPct(row.avgTop5OverlapPct).padStart(10),
        formatNumber(row.avgNewEntrants).padStart(10),
        String(row.uniqueTop5Cars).padStart(11),
        String(row.uniqueLeadCars).padStart(9),
        formatNumber(row.avgWeightDistance).padStart(9),
      ].join(" "),
    );
  });
};

const summarizeRows = (rows = []) => ({
  top1ChangeRate:
    rows.reduce((sum, row) => sum + row.top1ChangeRate, 0) / Math.max(1, rows.length),
  avgTop5OverlapPct:
    rows.reduce((sum, row) => sum + row.avgTop5OverlapPct, 0) /
    Math.max(1, rows.length),
  avgNewEntrants:
    rows.reduce((sum, row) => sum + row.avgNewEntrants, 0) / Math.max(1, rows.length),
  avgWeightDistance:
    rows.reduce((sum, row) => sum + row.avgWeightDistance, 0) /
    Math.max(1, rows.length),
});

const main = async () => {
  const args = parseArgs();
  const catalog = await loadCars(args);
  const useCasePresets = chooseUseCasePresets();
  const intentPresets = chooseIntentPresets();

  const intentVariationRows = USE_CASE_ORDER.filter((useCase) => useCasePresets[useCase]).map(
    (useCase) => {
      const runs = INTENT_ORDER.filter((intent) => intentPresets[intent]).map((intent) =>
        createRun(catalog.cars, {
          ...useCasePresets[useCase].answers,
          ...intentPresets[intent].answers,
        }, args.limit),
      );

      return {
        label: useCase,
        ...summarizeScenarioRuns(runs, args.limit),
      };
    },
  );

  const useCaseVariationRows = INTENT_ORDER.filter((intent) => intentPresets[intent]).map(
    (intent) => {
      const runs = USE_CASE_ORDER.filter((useCase) => useCasePresets[useCase]).map((useCase) =>
        createRun(catalog.cars, {
          ...useCasePresets[useCase].answers,
          ...intentPresets[intent].answers,
        }, args.limit),
      );

      return {
        label: intent,
        ...summarizeScenarioRuns(runs, args.limit),
      };
    },
  );

  const intentVariationSummary = summarizeRows(intentVariationRows);
  const useCaseVariationSummary = summarizeRows(useCaseVariationRows);

  console.log(
    `Analyzed ${catalog.cars.length} cars from ${catalog.source}. Top ${args.limit} recommendations compared per run.`,
  );
  console.log(
    "This isolates soft-scoring changes only: hard filters are left neutral so the candidate pool stays comparable.",
  );

  printPresetTable(
    "Representative use-case presets",
    useCasePresets,
    USE_CASE_ORDER,
    "Use case",
  );
  printPresetTable(
    "Representative intent presets",
    intentPresets,
    INTENT_ORDER,
    "Intent",
  );

  printScenarioTable(
    "Vary intent while holding use case fixed",
    intentVariationRows,
    "Use case",
  );
  printScenarioTable(
    "Vary use case while holding intent fixed",
    useCaseVariationRows,
    "Intent",
  );

  console.log("\nOverall comparison");
  console.log(
    `- Intent variation: #1 changed ${formatPct(intentVariationSummary.top1ChangeRate)}, top ${args.limit} overlap stayed at ${formatPct(intentVariationSummary.avgTop5OverlapPct)}, average new entrants ${formatNumber(intentVariationSummary.avgNewEntrants)}, average weight distance ${formatNumber(intentVariationSummary.avgWeightDistance)}.`,
  );
  console.log(
    `- Use-case variation: #1 changed ${formatPct(useCaseVariationSummary.top1ChangeRate)}, top ${args.limit} overlap stayed at ${formatPct(useCaseVariationSummary.avgTop5OverlapPct)}, average new entrants ${formatNumber(useCaseVariationSummary.avgNewEntrants)}, average weight distance ${formatNumber(useCaseVariationSummary.avgWeightDistance)}.`,
  );
  console.log(
    "- If use-case variation produces lower overlap and more new entrants than intent variation, that supports the claim that use case dominates intent for this catalog and weighting setup.",
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
