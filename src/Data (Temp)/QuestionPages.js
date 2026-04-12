import Questions from "./Questions.js";

export const QPages = [
  {
    key: "drive_style",
    title: "How will you mostly drive?",
    desc: "This helps to understand the fuel efficiency that will be required.",
    questions: Questions.Q1,
  },

  {
    key: "budget_range",
    title: "What's your maximum budget?",
    desc: "We treat this as your spending ceiling unless you drag it to the top, which means any price. If nothing matches exactly, we can show the closest options just above budget.",
    questions: Questions.Q2,
  },

  {
    key: "fuel_preference",
    title: "Do you have a fuel preference?",
    desc: "Fuel type affects running costs, range, and where you can refuel or charge.",
    questions: Questions.Q3,
  },

  {
    key: "transmission",
    title: "Which transmission do you prefer?",
    desc: "This helps match you with cars that fit your driving comfort and experience.",
    questions: Questions.Q4,
  },

  {
    key: "passengers_space",
    title: "Which body style fits you best?",
    desc: "Choose the shape of car you naturally lean toward, and we'll still use the description to guide how practical or sporty it should feel.",
    questions: Questions.Q5,
  },

  {
    key: "vehicle_size",
    title: "What size within that body style?",
    desc: "This lets us sort within that shape, so for example you can still prefer a smaller, lighter coupe or a larger, roomier SUV.",
    questions: Questions.Q5Size,
  },

  {
    key: "priority",
    title: "What matters most to you?",
    desc: "This helps us weight the recommendation to suit your priorities.",
    questions: Questions.Q6,
  },

  {
    key: "preferred_brands",
    title: "Any preferred brands?",
    desc: "Choose up to 4 brands you naturally lean toward. This is a soft preference only, and you can leave it blank if you do not care about brand.",
    questions: Questions.Q7Brands,
    selectionMode: "multiple",
    maxSelections: 4,
    optional: true,
  },

  {
    key: "usage_pattern",
    title: "How will you use the car most often?",
    desc: "Your usage pattern helps us balance comfort, practicality, and cost.",
    questions: Questions.Q8,
  },

  {
    key: "ownership_intent",
    title: "What kind of car do you actually want?",
    desc: "This tells us whether to lean toward sensible value, premium marque appeal, or outright performance.",
    questions: Questions.Q9,
  },
];
