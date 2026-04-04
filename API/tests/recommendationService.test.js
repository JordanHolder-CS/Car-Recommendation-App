const assert = require("node:assert/strict");

const { recommendCars } = require("../services/recommendationService");

const cars = [
  {
    car_id: 1,
    car_name: "City Saver",
    brand_name: "Econo",
    price: 16500,
    body_style: "hatchback",
    horsepower: 98,
    zero_to_sixty_mph: 11.8,
    combined_mpg: 59,
    reliability: 88,
    service_cost: 260,
    insurance_estimate: 420,
    max_seating_capacity: 5,
    boot_space_liters: 310,
    model_year: 2022,
    curb_weight: 980,
    drivetrain: "FWD",
    transmission: "Automatic",
  },
  {
    car_id: 2,
    car_name: "Family Cruiser",
    brand_name: "Pragma",
    price: 34800,
    body_style: "suv",
    horsepower: 205,
    zero_to_sixty_mph: 8.1,
    combined_mpg: 38,
    reliability: 85,
    service_cost: 430,
    insurance_estimate: 760,
    max_seating_capacity: 7,
    boot_space_liters: 640,
    model_year: 2023,
    curb_weight: 1750,
    drivetrain: "AWD",
    transmission: "Automatic",
  },
  {
    car_id: 3,
    car_name: "Weekend RS",
    brand_name: "Volt",
    price: 46200,
    body_style: "coupe",
    horsepower: 395,
    zero_to_sixty_mph: 4.2,
    combined_mpg: 28,
    reliability: 72,
    service_cost: 820,
    insurance_estimate: 1400,
    max_seating_capacity: 4,
    boot_space_liters: 280,
    model_year: 2024,
    curb_weight: 1490,
    drivetrain: "RWD",
    transmission: "Automatic",
  },
  {
    car_id: 4,
    car_name: "Executive Tourer",
    brand_name: "Luxor",
    price: 43800,
    body_style: "sedan",
    horsepower: 255,
    zero_to_sixty_mph: 6.1,
    combined_mpg: 42,
    reliability: 83,
    service_cost: 520,
    insurance_estimate: 980,
    max_seating_capacity: 5,
    boot_space_liters: 470,
    model_year: 2024,
    curb_weight: 1580,
    drivetrain: "AWD",
    transmission: "Automatic",
  },
];

const profiles = {
  city: {
    answers: {
      drive_style: "q1_city",
      budget_range: 25000,
      fuel_preference: "q3_petrol",
      transmission: "q4_auto",
      passengers_space: "q5_hatchback",
      vehicle_size: "q_size_small",
      priority: "q6_running_costs",
      usage_pattern: "q8_commute",
      ownership_intent: "q9_daily",
    },
    expectedWinner: "City Saver",
    expectedBreakdownKeys: [
      "economy",
      "dailyFit",
      "runningCostFit",
      "commuteFit",
      "reliability",
    ],
  },
  family: {
    answers: {
      drive_style: "q1_mixed",
      budget_range: 45000,
      fuel_preference: "q3_petrol",
      transmission: "q4_auto",
      passengers_space: "q5_suv",
      vehicle_size: "q_size_large",
      priority: "q6_practicality",
      usage_pattern: "q8_family",
      ownership_intent: "q9_balanced",
    },
    expectedWinner: "Family Cruiser",
    expectedBreakdownKeys: [
      "familyFit",
      "practicalFit",
      "seating",
      "spaceFit",
      "sizeFit",
    ],
  },
  performance: {
    answers: {
      drive_style: "q1_weekend",
      budget_range: 50000,
      fuel_preference: "q3_petrol",
      transmission: "q4_auto",
      passengers_space: "q5_coupe",
      vehicle_size: "q_size_small",
      priority: "q6_performance",
      usage_pattern: "q8_roadtrips",
      ownership_intent: "q9_pure_performance",
    },
    expectedWinner: "Weekend RS",
    expectedBreakdownKeys: [
      "performanceFit",
      "horsepower",
      "acceleration",
      "powerToWeight",
      "drivetrain",
    ],
  },
};

const extractReasonText = (note = "") => {
  const [, ...parts] = String(note).split(" | ");
  return parts.join(" | ") || null;
};

const driveStyleReorderCars = [
  {
    car_id: 101,
    car_name: "Family Eco SUV",
    brand_name: "Pragma",
    price: 41800,
    body_style: "suv",
    horsepower: 178,
    zero_to_sixty_mph: 8.9,
    combined_mpg: 50,
    reliability: 89,
    service_cost: 380,
    insurance_estimate: 690,
    max_seating_capacity: 7,
    boot_space_liters: 690,
    model_year: 2024,
    curb_weight: 1710,
    drivetrain: "FWD",
    transmission: "Automatic",
  },
  {
    car_id: 102,
    car_name: "Family Sport Touring",
    brand_name: "Jaguar",
    price: 48900,
    body_style: "suv",
    horsepower: 286,
    zero_to_sixty_mph: 6.2,
    combined_mpg: 36,
    reliability: 80,
    service_cost: 560,
    insurance_estimate: 930,
    max_seating_capacity: 5,
    boot_space_liters: 610,
    model_year: 2024,
    curb_weight: 1650,
    drivetrain: "AWD",
    transmission: "Automatic",
  },
  {
    car_id: 103,
    car_name: "Family Middle Ground",
    brand_name: "Summit",
    price: 45200,
    body_style: "suv",
    horsepower: 228,
    zero_to_sixty_mph: 7.4,
    combined_mpg: 42,
    reliability: 84,
    service_cost: 460,
    insurance_estimate: 810,
    max_seating_capacity: 5,
    boot_space_liters: 640,
    model_year: 2024,
    curb_weight: 1680,
    drivetrain: "AWD",
    transmission: "Automatic",
  },
];

const runTest = (name, callback) => {
  try {
    callback();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
};

runTest("question profiles steer recommendations toward the expected car", () => {
  Object.values(profiles).forEach(({ answers, expectedWinner }) => {
    const result = recommendCars(cars, answers, 3);
    assert.equal(result.recommendations[0]?.car_name, expectedWinner);
  });
});

runTest("breakdown stays aligned with scoring output and visible reasons", () => {
  Object.values(profiles).forEach(
    ({ answers, expectedWinner, expectedBreakdownKeys }) => {
      const result = recommendCars(cars, answers, 3);
      const topRecommendation = result.recommendations[0];

      assert.equal(topRecommendation.car_name, expectedWinner);
      assert.ok(topRecommendation.recommendationBreakdown.length > 0);
      assert.ok(topRecommendation.topReasons.length > 0);

      for (
        let index = 1;
        index < topRecommendation.recommendationBreakdown.length;
        index += 1
      ) {
        assert.ok(
          topRecommendation.recommendationBreakdown[index - 1].contribution >=
            topRecommendation.recommendationBreakdown[index].contribution,
        );
      }

      const topBreakdownKeys = topRecommendation.recommendationBreakdown
        .slice(0, 6)
        .map((item) => item.key);
      const alignedKeyCount = expectedBreakdownKeys.filter((key) =>
        topBreakdownKeys.includes(key),
      ).length;

      assert.ok(
        alignedKeyCount >= 3,
        `Expected at least 3 aligned breakdown keys for ${expectedWinner}, got ${topBreakdownKeys.join(", ")}`,
      );

      const breakdownReasons = topRecommendation.recommendationBreakdown
        .map((item) => extractReasonText(item.note))
        .filter(Boolean);

      topRecommendation.topReasons.forEach((reason) => {
        assert.ok(
          breakdownReasons.includes(reason),
          `Expected breakdown to contain reason "${reason}"`,
        );
      });
    },
  );
});

runTest("drive style can reorder comparable family recommendations", () => {
  const baseAnswers = {
    budget_range: 50000,
    fuel_preference: "q3_petrol",
    transmission: "q4_auto",
    passengers_space: "q5_suv",
    vehicle_size: "q_size_large",
    priority: "q6_practicality",
    usage_pattern: "q8_family",
    ownership_intent: "q9_balanced",
  };

  const cityResult = recommendCars(
    driveStyleReorderCars,
    { ...baseAnswers, drive_style: "q1_city" },
    3,
  );
  const weekendResult = recommendCars(
    driveStyleReorderCars,
    { ...baseAnswers, drive_style: "q1_weekend" },
    3,
  );

  assert.deepEqual(
    cityResult.recommendations.map((car) => car.car_id).sort(),
    weekendResult.recommendations.map((car) => car.car_id).sort(),
  );
  assert.equal(cityResult.recommendations[0]?.car_name, "Family Eco SUV");

  const cityOrder = cityResult.recommendations.map((car) => car.car_name);
  const weekendOrder = weekendResult.recommendations.map((car) => car.car_name);

  assert.ok(
    cityOrder.indexOf("Family Sport Touring") >
      cityOrder.indexOf("Family Middle Ground"),
  );
  assert.ok(
    weekendOrder.indexOf("Family Sport Touring") <
      weekendOrder.indexOf("Family Middle Ground"),
  );
});

console.log("All recommendation correlation tests passed.");
