import { Image, StyleSheet, Text, View } from "react-native";
import { getBrandLogoSource } from "../../ScoringConfigs/brandOptions";

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
