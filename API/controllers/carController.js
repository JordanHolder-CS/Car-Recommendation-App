const carModel = require("../models/carModel");
const {
  recommendCars,
  translateAnswersToHardFilters,
} = require("../services/recommendationService");

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
  }
  return false;
};

const getCars = async (req, res) => {
  try {
    const cars = await carModel.findAll();
    res.status(200).json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving cars", error: error.message });
  }
};

const getFilteredCars = async (req, res) => {
  try {
    const filters = req.query;
    const cars = await carModel.findFiltered(filters);
    res.status(200).json(cars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering cars", error: error.message });
  }
};

const getRecommendedCars = async (req, res) => {
  try {
    const answers =
      req.method === "GET"
        ? req.query || {}
        : req.body?.answers || req.body || {};
    const rawLimit = req.method === "GET" ? req.query?.limit : req.body?.limit;
    const parsedLimit = Number.parseInt(rawLimit, 10);
    const limit =
      Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 5;
    const includeDebug = parseBoolean(
      req.method === "GET" ? req.query?.debug : req.body?.debug,
    );
    const { dbFilters } = translateAnswersToHardFilters(answers);
    const cars = await carModel.findFiltered(dbFilters);
    const recommendationResult = recommendCars(cars, answers, limit);

    const responseBody = {
      profile: {
        useCase: recommendationResult.useCase,
        intent: recommendationResult.intent,
        label: recommendationResult.profileLabel,
      },
      meta: {
        returnedCount: recommendationResult.recommendations.length,
        budgetFallbackApplied: recommendationResult.budgetFallbackApplied,
        recommendationNote: recommendationResult.recommendationNote || "",
      },
      recommendations: recommendationResult.recommendations,
    };

    if (includeDebug) {
      responseBody.debug = {
        answers,
        primaryDriverType: recommendationResult.primaryDriverType,
        typeScores: recommendationResult.typeScores,
        useCaseScores: recommendationResult.useCaseScores,
        intentScores: recommendationResult.intentScores,
        totalCandidates: cars.length,
        exactMatchCount: recommendationResult.exactMatchCount,
        requestedCriteria: recommendationResult.requestedCriteria,
        effectiveCriteria: recommendationResult.criteria,
        criteriaAdjustments: recommendationResult.criteriaAdjustments,
        requestedHardFilterBreakdown:
          recommendationResult.requestedHardFilterBreakdown,
        hardFilterBreakdown: recommendationResult.hardFilterBreakdown,
      };
    }

    res.status(200).json(responseBody);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error recommending cars", error: error.message });
  }
};
const getSpecs = async (req, res) => {
  try {
    const specs = await carModel.findSpecs(req.query);
    res.status(200).json(specs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving specs", error: error.message });
  }
};

module.exports = {
  getCars,
  getSpecs,
  getFilteredCars,
  getRecommendedCars,
};
