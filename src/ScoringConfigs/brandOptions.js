export const BRAND_OPTIONS = [
  {
    label: "Mercedes-Benz",
    source: require("../../assets/logos/mercedes.png"),
    aliases: ["Mercedes", "Mercedes Benz"],
  },
  {
    label: "Audi",
    source: require("../../assets/logos/audi.png"),
  },
  {
    label: "BMW",
    source: require("../../assets/logos/bmw.png"),
  },
  {
    label: "Toyota",
    source: require("../../assets/logos/toyota.png"),
  },
  {
    label: "Volkswagen",
    source: require("../../assets/logos/volkswagen.png"),
    aliases: ["VW"],
  },
  {
    label: "Ford",
    source: require("../../assets/logos/ford.png"),
  },
  {
    label: "Honda",
    source: require("../../assets/logos/honda.png"),
  },
  {
    label: "Renault",
    source: require("../../assets/logos/renault.png"),
  },
  {
    label: "Volvo",
    source: require("../../assets/logos/volvo.png"),
  },
  {
    label: "Peugeot",
    source: require("../../assets/logos/peugeot.png"),
  },
  {
    label: "Nissan",
    source: require("../../assets/logos/nissan.png"),
  },
  {
    label: "MINI",
    source: require("../../assets/logos/mini.png"),
    aliases: ["Mini"],
  },
  {
    label: "Kia",
    source: require("../../assets/logos/kia.png"),
  },
  {
    label: "Hyundai",
    source: require("../../assets/logos/hyundai.png"),
  },
  {
    label: "Fiat",
    source: require("../../assets/logos/fiat.png"),
  },
  {
    label: "Chevrolet",
    source: require("../../assets/logos/chevrolet.png"),
  },
  {
    label: "Alfa Romeo",
    source: require("../../assets/logos/alfaromeo.png"),
  },
  {
    label: "Aston Martin",
    source: require("../../assets/logos/astonmartin.png"),
  },
  {
    label: "Bentley",
    source: require("../../assets/logos/bentley.png"),
  },
  {
    label: "Bugatti",
    source: require("../../assets/logos/bugatti.png"),
  },
  {
    label: "Cadillac",
    source: require("../../assets/logos/cadillac.png"),
  },
  {
    label: "Chrysler",
    source: require("../../assets/logos/chrysler.png"),
  },
  {
    label: "Dodge",
    source: require("../../assets/logos/dodge.png"),
  },
  {
    label: "Ferrari",
    source: require("../../assets/logos/ferrari.png"),
  },
  {
    label: "Jaguar",
    source: require("../../assets/logos/jaguar.png"),
  },
  {
    label: "Lamborghini",
    source: require("../../assets/logos/lamborghini.png"),
  },
  {
    label: "Lancia",
    source: require("../../assets/logos/lancia.png"),
  },
  {
    label: "Lexus",
    source: require("../../assets/logos/lexus.png"),
  },
  {
    label: "Lotus",
    source: require("../../assets/logos/lotus.png"),
  },
  {
    label: "Mazda",
    source: require("../../assets/logos/madza.png"),
  },
  {
    label: "Mitsubishi",
    source: require("../../assets/logos/mitsibishi.png"),
  },
  {
    label: "Opel",
    source: require("../../assets/logos/opel.png"),
  },
  {
    label: "Porsche",
    source: require("../../assets/logos/porsche.png"),
  },
  {
    label: "Rolls-Royce",
    source: require("../../assets/logos/rollsroyce.png"),
    aliases: ["Rolls Royce"],
  },
  {
    label: "Saab",
    source: require("../../assets/logos/saab.png"),
  },
  {
    label: "Smart",
    source: require("../../assets/logos/smart.png"),
  },
  {
    label: "Subaru",
    source: require("../../assets/logos/subaru.png"),
  },
  {
    label: "Tesla",
    source: require("../../assets/logos/tesla.png"),
  },
];

export const normalizeBrandKey = (brand = "") =>
  `${brand}`.toLowerCase().replace(/[^a-z0-9]/g, "");

const BRAND_LOGO_SOURCE_BY_KEY = BRAND_OPTIONS.reduce((lookup, option) => {
  [option.label, ...(option.aliases || [])].forEach((brandLabel) => {
    lookup[normalizeBrandKey(brandLabel)] = option.source;
  });

  return lookup;
}, {});

export const getBrandLogoSource = (brand = "") =>
  BRAND_LOGO_SOURCE_BY_KEY[normalizeBrandKey(brand)] ?? null;
