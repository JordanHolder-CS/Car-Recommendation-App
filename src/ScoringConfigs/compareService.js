import {
  COMMON_COMPARE_FACTUAL_KEYS,
  FACTUAL_ROW_CONFIGS,
  INTENT_COMPARE_FACTUAL_KEYS,
  SCORE_ROW_CONFIGS,
  USE_CASE_COMPARE_FACTUAL_KEYS,
} from "./compareMetricConfig";

const DEFAULT_COMPARE_IMAGE =
  "https://hips.hearstapps.com/hmg-prod/images/2024-mercedes-amg-gt63-643-66b52543c907c.jpg?crop=0.683xw:0.511xh;0.0976xw,0.409xh&resize=1200:*";

const parseNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const match = value.match(/-?\d[\d,]*(?:\.\d+)?/);
    if (!match) return null;
    const parsedValue = Number.parseFloat(match[0].replace(/,/g, ""));
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }
  return null;
};

const parseComparableNumber = (value) => {
  const parsedValue = parseNumber(value);
  return parsedValue !== null && parsedValue > 0 ? parsedValue : null;
};

const formatMetricText = (value, suffix = "") => {
  const parsedValue = parseComparableNumber(value);
  if (parsedValue === null) return "N/A";
  return `${Number(parsedValue).toLocaleString("en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}${suffix}`;
};

const formatPercentText = (value) => {
  const parsedValue = parseNumber(value);
  return parsedValue === null ? "N/A" : `${Math.round(parsedValue)}%`;
};

const formatTitleCase = (value) => {
  if (typeof value !== "string" || !value.trim()) return "N/A";
  return value
    .trim()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((segment) => {
      const normalizedSegment = segment.toLowerCase();
      if (["suv", "mpv", "awd", "fwd", "rwd"].includes(normalizedSegment)) {
        return normalizedSegment.toUpperCase();
      }
      if (normalizedSegment === "4wd") return "4WD";
      return normalizedSegment.charAt(0).toUpperCase() + normalizedSegment.slice(1);
    })
    .join(" ");
};

export const formatCompareCurrency = (value) => {
  const parsedValue = parseComparableNumber(value);
  return parsedValue !== null
    ? Number(parsedValue).toLocaleString("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    : "N/A";
};

export const getCarCompareKey = (car = {}) => {
  if (car?.car_id !== undefined && car?.car_id !== null) return `id:${car.car_id}`;
  return [
    car?.brand_name ?? car?.brand ?? "",
    car?.car_name ?? car?.name ?? "",
    car?.price ?? "",
  ]
    .join("|")
    .toLowerCase();
};

export const getVehicleBrand = (car = {}) => car?.brand_name ?? car?.brand ?? "";

export const getVehicleName = (car = {}) =>
  car?.car_name ?? car?.name ?? "Vehicle unavailable";

export const getVehicleImage = (car = {}) =>
  car?.image_url ?? car?.image ?? DEFAULT_COMPARE_IMAGE;

export const getUniqueComparisonVehicles = (selectedCar, recommendedCars = []) => {
  const uniqueCars = [];
  const seenKeys = new Set();

  [selectedCar, ...(Array.isArray(recommendedCars) ? recommendedCars : [])].forEach(
    (car) => {
      const carKey = getCarCompareKey(car);
      if (!carKey || seenKeys.has(carKey)) return;
      seenKeys.add(carKey);
      uniqueCars.push(car);
    },
  );

  return uniqueCars;
};

export const getAvailableVehiclesForSide = (cars = [], blockedCar) => {
  const blockedKey = getCarCompareKey(blockedCar);
  return cars.filter((car) => getCarCompareKey(car) !== blockedKey);
};

export const resolveVehicleSelection = ({
  vehicles = [],
  blockedCar = null,
  currentCar = null,
  preferredCar = null,
}) => {
  const availableVehicles = getAvailableVehiclesForSide(vehicles, blockedCar);
  if (!availableVehicles.length) return null;

  const currentKey = getCarCompareKey(currentCar);
  const currentMatch = availableVehicles.find(
    (car) => getCarCompareKey(car) === currentKey,
  );
  if (currentMatch) return currentMatch;

  const preferredKey = getCarCompareKey(preferredCar);
  const preferredMatch = availableVehicles.find(
    (car) => getCarCompareKey(car) === preferredKey,
  );
  if (preferredMatch) return preferredMatch;

  return availableVehicles[0];
};

export const buildRationaleMessage = (selectedCar = {}) => {
  const profileLabel =
    typeof selectedCar.profileLabel === "string"
      ? selectedCar.profileLabel.trim()
      : "";
  const topReason = Array.isArray(selectedCar.topReasons)
    ? `${selectedCar.topReasons[0] ?? ""}`.trim()
    : "";

  if (profileLabel && topReason) return `${profileLabel}. ${topReason}`;
  if (profileLabel) return profileLabel;
  if (topReason) return topReason;
  return "Strong match for your budget and driving preferences.";
};

const getWinner = (leftScore, rightScore, direction) => {
  if (!Number.isFinite(leftScore) || !Number.isFinite(rightScore)) return null;
  if (leftScore === rightScore) return null;
  if (direction === "low") return leftScore < rightScore ? "left" : "right";
  return leftScore > rightScore ? "left" : "right";
};

const getBreakdownEntry = (car = {}, metricKey) =>
  (Array.isArray(car?.recommendationBreakdown)
    ? car.recommendationBreakdown
    : []
  ).find((entry) => entry?.key === metricKey) ?? null;

const getBreakdownReasonText = (entry) => {
  const note =
    typeof entry?.note === "string" && entry.note.trim() ? entry.note.trim() : "";
  if (!note) return null;

  const noteParts = note
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    noteParts.find((part) => !/\bimpact\b/i.test(part)) ??
    noteParts[noteParts.length - 1] ??
    null
  );
};

const isElectricCar = (car = {}) => car?.is_ev === true;

const getFuelTypeLabel = (car = {}) => {
  if (isElectricCar(car)) return "Electric";
  const rawEngineDescription =
    car?.standard_engine ?? car?.engine_type ?? car?.fuel_type ?? "";
  const engineDescription =
    typeof rawEngineDescription === "string"
      ? rawEngineDescription.trim().toLowerCase()
      : "";
  if (!engineDescription) return "N/A";

  if (
    engineDescription.includes("plug in hybrid") ||
    engineDescription.includes("plug-in hybrid") ||
    engineDescription.includes("phev")
  ) {
    return "PHEV";
  }
  if (
    engineDescription.includes("hybrid") ||
    engineDescription.includes("hev") ||
    engineDescription.includes("mhev") ||
    engineDescription.includes("e power") ||
    engineDescription.includes("e-power")
  ) {
    return "Hybrid";
  }
  if (engineDescription.includes("diesel")) return "Diesel";
  if (
    engineDescription.includes("petrol") ||
    engineDescription.includes("gasoline")
  ) {
    return "Petrol";
  }
  return "Petrol";
};

const getDynamicScoreKeys = (focusCar = {}) => {
  const breakdownEntries = Array.isArray(focusCar?.recommendationBreakdown)
    ? focusCar.recommendationBreakdown
    : [];
  const eligibleEntries = breakdownEntries.filter(
    (entry) => entry?.key && SCORE_ROW_CONFIGS[entry.key],
  );

  if (!eligibleEntries.length) return [];

  const preferredEntries = eligibleEntries.some((entry) => entry?.priority)
    ? eligibleEntries.filter((entry) => entry?.priority)
    : eligibleEntries;

  return preferredEntries.slice(0, 3).map((entry) => entry.key);
};

const getFactualRowKeys = (focusCar = {}) => {
  const useCaseKeys =
    USE_CASE_COMPARE_FACTUAL_KEYS[
      focusCar?.useCase ?? focusCar?.primaryDriverType ?? ""
    ] || [];
  const intentKeys = INTENT_COMPARE_FACTUAL_KEYS[focusCar?.intent ?? ""] || [];

  return [...new Set([...COMMON_COMPARE_FACTUAL_KEYS, ...useCaseKeys, ...intentKeys])];
};

const buildScoreRow = (metricKey, leftCar, rightCar) => {
  const config = SCORE_ROW_CONFIGS[metricKey];
  if (!config) return null;

  const leftEntry = getBreakdownEntry(leftCar, metricKey);
  const rightEntry = getBreakdownEntry(rightCar, metricKey);
  const leftScore = parseNumber(leftEntry?.fitScore);
  const rightScore = parseNumber(rightEntry?.fitScore);

  if (leftScore === null && rightScore === null) return null;

  return {
    key: `score:${metricKey}`,
    label: config.label || leftEntry?.label || rightEntry?.label || metricKey,
    description: config.description || null,
    leftText: formatPercentText(leftScore),
    rightText: formatPercentText(rightScore),
    leftDetail: getBreakdownReasonText(leftEntry),
    rightDetail: getBreakdownReasonText(rightEntry),
    winner: getWinner(leftScore, rightScore, "high"),
  };
};

const FACTUAL_VALUE_GETTERS = {
  price: (car) => car?.price,
  seats: (car) => car?.max_seating_capacity ?? car?.seat_count,
  cargoSpace: (car) => car?.boot_space_liters ?? car?.cargo_capacity,
  fuelType: (car) => getFuelTypeLabel(car),
  horsepower: (car) => car?.horsepower,
  zeroToSixty: (car) => car?.zero_to_sixty_mph,
  drivetrain: (car) => car?.drivetrain,
  bodyStyle: (car) => car?.body_style,
  towingCapacity: (car) => car?.towing_capacity,
};

const buildStandardFactualRow = (rowKey, leftCar, rightCar) => {
  const config = FACTUAL_ROW_CONFIGS[rowKey];
  const getValue = FACTUAL_VALUE_GETTERS[rowKey];
  if (!config || !getValue) return null;

  const leftValue = getValue(leftCar);
  const rightValue = getValue(rightCar);

  if (config.kind === "currency") {
    const leftScore = parseComparableNumber(leftValue);
    const rightScore = parseComparableNumber(rightValue);
    if (leftScore === null && rightScore === null) return null;

    return {
      key: rowKey,
      label: config.label,
      description: config.description,
      leftText: formatCompareCurrency(leftValue),
      rightText: formatCompareCurrency(rightValue),
      leftDetail: null,
      rightDetail: null,
      winner: getWinner(leftScore, rightScore, config.direction),
    };
  }

  if (config.kind === "numeric") {
    const leftScore = parseComparableNumber(leftValue);
    const rightScore = parseComparableNumber(rightValue);
    if (leftScore === null && rightScore === null) return null;
    return {
      key: rowKey,
      label: config.label,
      description: config.description,
      leftText: formatMetricText(leftValue, config.suffix || ""),
      rightText: formatMetricText(rightValue, config.suffix || ""),
      leftDetail: null,
      rightDetail: null,
      winner: getWinner(leftScore, rightScore, config.direction),
    };
  }

  const leftText = formatTitleCase(leftValue);
  const rightText = formatTitleCase(rightValue);
  if (leftText === "N/A" && rightText === "N/A") return null;
  return {
    key: rowKey,
    label: config.label,
    description: config.description,
    leftText,
    rightText,
    leftDetail: null,
    rightDetail: null,
    winner: null,
  };
};

const getEfficiencyMetric = (car = {}) => {
  if (isElectricCar(car)) {
    const value = car?.ev_range ?? car?.estimated_electric_range;
    return {
      kind: "range",
      value,
      text: formatMetricText(value, " mi"),
    };
  }

  const value = car?.combined_mpg ?? car?.epa_combined;
  return {
    kind: "mpg",
    value,
    text: formatMetricText(value, " MPG"),
  };
};

const getEfficiencyRowMeta = (leftMetric, rightMetric) => {
  if (leftMetric.kind === "range" && rightMetric.kind === "range") {
    return {
      label: "Range",
      description: "Estimated electric driving range. Higher is better.",
      compareDirection: "high",
    };
  }

  if (leftMetric.kind === "mpg" && rightMetric.kind === "mpg") {
    return {
      label: "MPG",
      description: "Fuel economy for non-EVs. Higher is better.",
      compareDirection: "high",
    };
  }

  return {
    label: FACTUAL_ROW_CONFIGS.efficiency.label,
    description: FACTUAL_ROW_CONFIGS.efficiency.description,
    compareDirection: null,
  };
};

const buildEfficiencyRow = (leftCar, rightCar) => {
  const leftMetric = getEfficiencyMetric(leftCar);
  const rightMetric = getEfficiencyMetric(rightCar);
  const rowMeta = getEfficiencyRowMeta(leftMetric, rightMetric);

  if (
    parseComparableNumber(leftMetric.value) === null &&
    parseComparableNumber(rightMetric.value) === null
  ) {
    return null;
  }

  return {
    key: "efficiency",
    label: rowMeta.label,
    description: rowMeta.description,
    leftText: leftMetric.text,
    rightText: rightMetric.text,
    leftDetail: null,
    rightDetail: null,
    winner: rowMeta.compareDirection
      ? getWinner(
          parseComparableNumber(leftMetric.value),
          parseComparableNumber(rightMetric.value),
          rowMeta.compareDirection,
        )
      : null,
  };
};

const buildFactualRow = (rowKey, leftCar, rightCar) =>
  rowKey === "efficiency"
    ? buildEfficiencyRow(leftCar, rightCar)
    : buildStandardFactualRow(rowKey, leftCar, rightCar);

export const buildComparisonRows = (leftCar, rightCar) => {
  const scoreRows = getDynamicScoreKeys(rightCar)
    .map((metricKey) => buildScoreRow(metricKey, leftCar, rightCar))
    .filter(Boolean);

  const factualRows = getFactualRowKeys(rightCar)
    .map((rowKey) => buildFactualRow(rowKey, leftCar, rightCar))
    .filter(Boolean);

  return [...scoreRows, ...factualRows];
};
