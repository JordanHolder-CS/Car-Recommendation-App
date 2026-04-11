import { Image, StyleSheet, Text, View } from "react-native";

const BRAND_LOGO_SOURCES = {
  alfaromeo: require("../../../assets/logos/alfaromeo.png"),
  astonmartin: require("../../../assets/logos/astonmartin.png"),
  audi: require("../../../assets/logos/audi.png"),
  bentley: require("../../../assets/logos/bentley.png"),
  bmw: require("../../../assets/logos/bmw.png"),
  bugatti: require("../../../assets/logos/bugatti.png"),
  cadillac: require("../../../assets/logos/cadillac.png"),
  chevrolet: require("../../../assets/logos/chevrolet.png"),
  chrysler: require("../../../assets/logos/chrysler.png"),
  dodge: require("../../../assets/logos/dodge.png"),
  ferrari: require("../../../assets/logos/ferrari.png"),
  fiat: require("../../../assets/logos/fiat.png"),
  ford: require("../../../assets/logos/ford.png"),
  honda: require("../../../assets/logos/honda.png"),
  hyundai: require("../../../assets/logos/hyundai.png"),
  jaguar: require("../../../assets/logos/jaguar.png"),
  kia: require("../../../assets/logos/kia.png"),
  lamborghini: require("../../../assets/logos/lamborghini.png"),
  lancia: require("../../../assets/logos/lancia.png"),
  lexus: require("../../../assets/logos/lexus.png"),
  lotus: require("../../../assets/logos/lotus.png"),
  mazda: require("../../../assets/logos/madza.png"),
  mercedes: require("../../../assets/logos/mercedes.png"),
  mercedesbenz: require("../../../assets/logos/mercedes.png"),
  mini: require("../../../assets/logos/mini.png"),
  mitsubishi: require("../../../assets/logos/mitsibishi.png"),
  nissan: require("../../../assets/logos/nissan.png"),
  opel: require("../../../assets/logos/opel.png"),
  peugeot: require("../../../assets/logos/peugeot.png"),
  porsche: require("../../../assets/logos/porsche.png"),
  renault: require("../../../assets/logos/renault.png"),
  rollsroyce: require("../../../assets/logos/rollsroyce.png"),
  saab: require("../../../assets/logos/saab.png"),
  smart: require("../../../assets/logos/smart.png"),
  subaru: require("../../../assets/logos/subaru.png"),
  tesla: require("../../../assets/logos/tesla.png"),
  toyota: require("../../../assets/logos/toyota.png"),
  volkswagen: require("../../../assets/logos/volkswagen.png"),
  volvo: require("../../../assets/logos/volvo.png"),
  vw: require("../../../assets/logos/volkswagen.png"),
};

const normalizeBrandKey = (brand = "") =>
  `${brand}`.toLowerCase().replace(/[^a-z0-9]/g, "");

const getBrandMonogram = (brand = "") => {
  const parts = `${brand}`
    .split(/[\s-]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export const getBrandLogoSource = (brand = "") =>
  BRAND_LOGO_SOURCES[normalizeBrandKey(brand)] ?? null;

export const BrandLogo = ({ brand, size = 42, containerStyle, imageStyle }) => {
  const source = getBrandLogoSource(brand);
  const badgeRadius = Math.max(10, Math.round(size * 0.24));
  const badgePadding = Math.max(6, Math.round(size * 0.14));
  const fallbackFontSize = Math.max(9, Math.round(size * 0.22));

  return (
    <View
      style={[
        styles.Badge,
        {
          width: size,
          height: size,
          borderRadius: badgeRadius,
          padding: badgePadding,
        },
        containerStyle,
      ]}
    >
      {source ? (
        <Image
          source={source}
          resizeMode="contain"
          style={[styles.Image, imageStyle]}
        />
      ) : (
        <Text style={[styles.FallbackText, { fontSize: fallbackFontSize }]}>
          {getBrandMonogram(brand)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Badge: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  Image: {
    width: "100%",
    height: "100%",
  },
  FallbackText: {
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.4,
  },
});

export default BrandLogo;
