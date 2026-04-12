export const SCORE_ROW_CONFIGS = {
  brandFit: {
    label: "Brand fit",
    description:
      "Shows whether the car matches one of the brands you explicitly preferred.",
  },
  commuteFit: {
    label: "Commute fit",
    description:
      "Based on city suitability, running costs, comfort and any reliability data available.",
  },
  cityFit: {
    label: "City fit",
    description: "Based on body style and overall size for urban driving.",
  },
  runningCostFit: {
    label: "Running-cost fit",
    description:
      "Based on purchase price, fuel economy and any servicing data available.",
  },
  comfortFit: {
    label: "Comfort fit",
    description:
      "Based on comfort-oriented body style and how premium the car sits in the range.",
  },
  practicalFit: {
    label: "Practicality fit",
    description:
      "Based on body style, boot or cargo space, and seating practicality.",
  },
  spaceFit: {
    label: "Passenger / space fit",
    description:
      "Based on body style, seating and luggage space against your questionnaire preference.",
  },
  sizeFit: {
    label: "Size fit",
    description:
      "Based on vehicle weight, seating and boot size against your preferred vehicle size.",
  },
  techFit: {
    label: "Technology fit",
    description: "Uses model year as a rough proxy for newer cabin and tech features.",
  },
  performanceFit: {
    label: "Performance fit",
    description:
      "Based on body style, horsepower, acceleration, power-to-weight and drivetrain.",
  },
  roadTripFit: {
    label: "Road-trip fit",
    description:
      "Based on comfort, range or fuel economy, luggage space and any reliability data available.",
  },
  workFit: {
    label: "Work fit",
    description:
      "Based on practicality, cargo space and any work-use signals available.",
  },
  familyFit: {
    label: "Family fit",
    description:
      "Based on passenger space, practicality, body style and any reliability data available.",
  },
  dailyFit: {
    label: "Daily-use fit",
    description:
      "Based on commute suitability, running costs and everyday usability.",
  },
  balancedFit: {
    label: "Balanced fit",
    description:
      "Based on the mix of comfort, performance and all-round usability.",
  },
  luxuryFit: {
    label: "Luxury fit",
    description: "Based on premium brand cues and higher-end positioning.",
  },
};

export const FACTUAL_ROW_CONFIGS = {
  price: {
    label: "Price",
    description: "Straight purchase price. Lower is better.",
    kind: "currency",
    direction: "low",
  },
  efficiency: {
    label: "MPG / Range",
    description:
      "Shows electric range for EVs and MPG for petrol, diesel or hybrid cars.",
    kind: "efficiency",
  },
  seats: {
    label: "Seats",
    description: "Maximum seating capacity.",
    kind: "numeric",
    direction: "high",
    suffix: "",
  },
  cargoSpace: {
    label: "Cargo space",
    description: "Boot or cargo space capacity. Higher is better.",
    kind: "numeric",
    direction: "high",
    suffix: " L",
  },
  fuelType: {
    label: "Fuel type",
    description: "Derived from EV data and engine or fuel descriptions.",
    kind: "text",
  },
  horsepower: {
    label: "Horsepower",
    description: "Engine power output. Higher usually feels stronger.",
    kind: "numeric",
    direction: "high",
    suffix: " hp",
  },
  zeroToSixty: {
    label: "0-60 mph",
    description: "Acceleration to 60 mph. Lower is quicker.",
    kind: "numeric",
    direction: "low",
    suffix: " s",
  },
  drivetrain: {
    label: "Drivetrain",
    description: "Which wheels receive power from the drivetrain.",
    kind: "text",
  },
  bodyStyle: {
    label: "Body style",
    description: "The overall vehicle shape this car belongs to.",
    kind: "text",
  },
  towingCapacity: {
    label: "Towing capacity",
    description: "Maximum towing capacity from the source data.",
    kind: "numeric",
    direction: "high",
    suffix: "",
  },
};

export const COMMON_COMPARE_FACTUAL_KEYS = [
  "price",
  "efficiency",
  "seats",
  "cargoSpace",
  "fuelType",
];

export const USE_CASE_COMPARE_FACTUAL_KEYS = {
  city: ["bodyStyle"],
  family: ["bodyStyle"],
  work: ["towingCapacity", "drivetrain"],
  long_distance: ["drivetrain", "bodyStyle"],
  weekend: ["horsepower", "zeroToSixty", "drivetrain"],
};

export const INTENT_COMPARE_FACTUAL_KEYS = {
  practicality: ["bodyStyle"],
  comfort: ["bodyStyle"],
  luxury: ["bodyStyle"],
  performance: ["horsepower", "zeroToSixty"],
};
