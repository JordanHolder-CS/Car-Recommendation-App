export const Questions = {
  Q1: [
    {
      id: "q1_long_distance",
      QuestionTitle: "Long-distance commuter",
      QuestionDescription:
        "Best suited for motorway journeys and frequent high-mileage driving.",
    },
    {
      id: "q1_city",
      QuestionTitle: "City driver",
      QuestionDescription:
        "For low-speed, shorter trips, tight parking, and stop-start traffic.",
    },
    {
      id: "q1_mixed",
      QuestionTitle: "Mixed driving",
      QuestionDescription:
        "A balance of town and motorway driving with varied trip lengths.",
    },
    {
      id: "q1_weekend",
      QuestionTitle: "Occasional / weekend use",
      QuestionDescription:
        "Mostly short, infrequent journeys rather than daily commuting.",
    },
  ],

  Q2: [
    {
      id: "budget_range",
      type: "slider",
      QuestionTitle: "Set your maximum budget",
      QuestionDescription:
        "Choose the highest amount you are willing to spend, or drag to the top for any price.",
      min: 5000,
      max: 100_000,
      step: 100,
      format: "currency",
      suffix: "",
      minimumLabel: "5k",
      maximumLabel: "Any price",
    },
  ],

  Q3: [
    {
      id: "q3_petrol",
      QuestionTitle: "Petrol",
      QuestionDescription:
        "Often cheaper upfront; great for lower annual mileage and mixed driving.",
    },
    {
      id: "q3_diesel",
      QuestionTitle: "Diesel",
      QuestionDescription:
        "Typically better for motorway mileage and fuel economy on long trips.",
    },
    {
      id: "q3_hybrid",
      QuestionTitle: "Hybrid",
      QuestionDescription:
        "Good balance of efficiency and convenience without full-time charging.",
    },
    {
      id: "q3_electric",
      QuestionTitle: "Electric (EV)",
      QuestionDescription:
        "Low running costs and smooth driving; best if you can charge reliably.",
    },
    {
      id: "q3_no_pref",
      QuestionTitle: "No preference",
      QuestionDescription:
        "We'll recommend the best match based on your driving style and budget.",
    },
  ],

  Q4: [
    {
      id: "q4_auto",
      QuestionTitle: "Automatic",
      QuestionDescription:
        "Easier in traffic; often preferred for city driving and comfort.",
    },
    {
      id: "q4_manual",
      QuestionTitle: "Manual",
      QuestionDescription:
        "Often cheaper and more common in used cars; more driver control.",
    },
    {
      id: "q4_either",
      QuestionTitle: "No preference",
      QuestionDescription:
        "We won't filter by transmission unless it conflicts with your choices.",
    },
  ],

  Q5: [
    {
      id: "q5_coupe",
      QuestionTitle: "Coupe / convertible",
      QuestionDescription:
        "Smaller, sportier body styles that suit solo use or two people better than full family duty.",
    },
    {
      id: "q5_hatchback",
      QuestionTitle: "Hatchback / compact",
      QuestionDescription:
        "Compact and easy to park, with flexible everyday practicality for town driving.",
    },
    {
      id: "q5_sedan",
      QuestionTitle: "Saloon / sedan",
      QuestionDescription:
        "A more mature all-rounder with a separate boot, better road-trip comfort, and everyday usability.",
    },
    {
      id: "q5_suv",
      QuestionTitle: "SUV / crossover",
      QuestionDescription:
        "Higher ride height, easier access, and family-friendly space for regular daily use.",
    },
    {
      id: "q5_estate",
      QuestionTitle: "Estate / wagon",
      QuestionDescription:
        "Best if you want a bigger boot and long-body practicality for luggage, dogs, or bulky gear.",
    },
    {
      id: "q5_pickup",
      QuestionTitle: "Pickup / utility",
      QuestionDescription:
        "Better for work gear, dirty loads, towing, or open-bed practicality over comfort.",
    },
  ],

  Q5Size: [
    {
      id: "q_size_small",
      QuestionTitle: "Smaller / lighter",
      QuestionDescription:
        "Prefer the tighter, lighter version of this body style if it feels easier, sharper, or less bulky.",
    },
    {
      id: "q_size_medium",
      QuestionTitle: "Mid-size / balanced",
      QuestionDescription:
        "A middle ground between easy everyday use and enough space to live with comfortably.",
    },
    {
      id: "q_size_large",
      QuestionTitle: "Larger / roomier",
      QuestionDescription:
        "Prefer the bigger, roomier version of this body style if comfort, presence, or carrying ability matters more.",
    },
  ],

  Q6: [
    {
      id: "q6_running_costs",
      QuestionTitle: "Low running costs",
      QuestionDescription:
        "Prioritise higher MPG and a lower purchase price, with sensible upkeep costs.",
    },
    {
      id: "q6_comfort",
      QuestionTitle: "Comfort",
      QuestionDescription:
        "Favour refined SUVs and saloons that feel more relaxed and premium, even if they cost a bit more.",
    },
    {
      id: "q6_performance",
      QuestionTitle: "Performance",
      QuestionDescription:
        "Prioritise horsepower and lower weight so the car feels stronger for its size.",
    },
    {
      id: "q6_practicality",
      QuestionTitle: "Practicality",
      QuestionDescription:
        "Prioritise cargo space and SUV or estate-style usefulness over sporty looks.",
    },
  ],

  Q8: [
    {
      id: "q8_commute",
      QuestionTitle: "Daily commute",
      QuestionDescription:
        "Consistency matters: comfort, economy, and reliability are key.",
    },
    {
      id: "q8_errands",
      QuestionTitle: "Errands and local trips",
      QuestionDescription:
        "Short journeys, easy parking, and low-speed comfort matter most.",
    },
    {
      id: "q8_roadtrips",
      QuestionTitle: "Road trips / travelling",
      QuestionDescription:
        "Prioritise motorway comfort, range, and luggage space.",
    },
    {
      id: "q8_work",
      QuestionTitle: "Work use (tools / equipment)",
      QuestionDescription:
        "Practicality and boot space matter more than sporty styling.",
    },
    {
      id: "q8_family",
      QuestionTitle: "Family duties (school runs, weekends)",
      QuestionDescription:
        "Space, safety, and convenience features become the priority.",
    },
  ],

  Q9: [
    {
      id: "q9_daily",
      QuestionTitle: "Sensible daily driver",
      QuestionDescription:
        "Prioritise reliability, running costs, and everyday practicality over badge appeal or pace.",
    },
    {
      id: "q9_balanced",
      QuestionTitle: "Balanced with some excitement",
      QuestionDescription:
        "Keep it easy to live with, but leave room for stronger styling, performance, and desirability.",
    },
    {
      id: "q9_fun",
      QuestionTitle: "Weekend / fun-first car",
      QuestionDescription:
        "I can give up some comfort or practicality if the car feels special and enjoyable to drive.",
    },
    {
      id: "q9_luxury",
      QuestionTitle: "Luxury / status",
      QuestionDescription:
        "Prioritise prestige, cabin quality, and premium marques like Bentley, Ferrari, Lexus, or Aston Martin over pure value.",
    },
    {
      id: "q9_pure_performance",
      QuestionTitle: "Pure performance",
      QuestionDescription:
        "Focus on speed, drama, and driver appeal first, even if comfort, economy, and practicality take a hit.",
    },
  ],
};

export default Questions;
