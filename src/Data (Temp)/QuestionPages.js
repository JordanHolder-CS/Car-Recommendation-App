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
    title: "What’s your budget range?",
    desc: "This helps filter cars that match what you’re comfortable spending.",
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
    title: "How much space do you need?",
    desc: "We’ll prioritise cars that fit your passengers, boot space, and daily needs.",
    questions: Questions.Q5,
  },

  {
    key: "priority",
    title: "What matters most to you?",
    desc: "This helps us weight the recommendation to suit your priorities.",
    questions: Questions.Q6,
  },

  {
    key: "features",
    title: "Which features do you care about?",
    desc: "Pick what you’d like most so we can match the right trim level and tech.",
    questions: Questions.Q7,
  },

  {
    key: "usage_pattern",
    title: "How will you use the car most often?",
    desc: "Your usage pattern helps us balance comfort, practicality, and cost.",
    questions: Questions.Q8,
  },
];
