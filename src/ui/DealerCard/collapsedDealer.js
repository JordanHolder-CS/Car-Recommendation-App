import { StyleSheet, View, Image, Text } from "react-native";
import BrandLogo from "../BrandLogo/BrandLogo";

const DEFAULT_DEALER_IMAGE =
  "https://www.palmcoastford.com/static/dealer-16495/Used_car_dealer_33_banner.jpg";

const parseBrandValue = (brand = "") =>
  `${brand}`.replace(/^"+|"+$/g, "").trim();

const getDealerBrandNames = (dealer = {}) => {
  const rawBrandNames = dealer.brand_names ?? dealer.brands ?? [];

  if (Array.isArray(rawBrandNames)) {
    return rawBrandNames.map(parseBrandValue).filter(Boolean);
  }

  if (typeof rawBrandNames === "string" && rawBrandNames.trim()) {
    return rawBrandNames
      .replace(/^\{|\}$/g, "")
      .split(",")
      .map(parseBrandValue)
      .filter(Boolean);
  }

  return [];
};

export const DealerContent = ({ dealer = {} }) => {
  const dealerType = dealer.is_franchised
    ? "Franchised dealer"
    : "Independent dealer";
  const brandNames = getDealerBrandNames(dealer);
  const visibleBrandNames = brandNames.slice(0, 4);
  const hiddenBrandCount = Math.max(0, brandNames.length - visibleBrandNames.length);
  const brandLabel = brandNames.length ? brandNames.join(", ") : "Brands unavailable";

  return (
    <View style={styles.Container}>
      <View style={styles.HeaderWrapper}>
        <Image
          style={styles.ImageHeader}
          source={{
            uri: DEFAULT_DEALER_IMAGE,
          }}
        />
      </View>
      <View style={styles.TextWrapper}>
        <Text style={styles.NameText}>
          {dealer.dealer_name || "Dealer unavailable"}
        </Text>
        <Text style={styles.MatchText}>{dealerType}</Text>
        <Text style={styles.ProfileText}>
          {dealer.location || "Location unavailable"}
        </Text>
        <View style={styles.BrandSection}>
          <Text style={styles.BrandTitle}>Brands</Text>
          {visibleBrandNames.length ? (
            <View style={styles.BrandLogoRow}>
              {visibleBrandNames.map((brandName) => (
                <BrandLogo
                  key={`${dealer.dealer_id ?? dealer.dealer_name ?? "dealer"}-${brandName}`}
                  brand={brandName}
                  size={42}
                />
              ))}
              {hiddenBrandCount ? (
                <View style={styles.BrandOverflowBadge}>
                  <Text style={styles.BrandOverflowText}>+{hiddenBrandCount}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
          <Text style={styles.TypeText}>{brandLabel}</Text>
        </View>
        <Text style={styles.PriceText}>
          Dealer ID: {dealer.dealer_id ?? "N/A"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  TextWrapper: {
    padding: 9,
  },
  HeaderWrapper: {
    alignItems: "center",
  },
  ImageHeader: {
    height: 120,
    width: "100%",
    borderRadius: 12,
  },
  NameText: {
    fontWeight: "700",
    fontSize: 20,
  },
  MatchText: {
    marginTop: 4,
    fontWeight: "700",
    fontSize: 13,
    color: "#0F766E",
  },
  ProfileText: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  TypeText: {
    marginTop: 6,
    fontSize: 11,
    color: "#6B7280",
    textTransform: "capitalize",
  },
  BrandSection: {
    marginTop: 8,
  },
  BrandTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  BrandLogoRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  BrandOverflowBadge: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  BrandOverflowText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B5563",
  },
  PriceText: {
    paddingTop: 4,
    fontWeight: "500",
    fontSize: 18,
    color: "#007BFF",
  },
  SectionTitle: {
    fontWeight: "600",
    color: "#111827",
    fontSize: 14,
  },
  ProTitle: {
    fontWeight: "600",
    color: "#25CB00",
    fontSize: 14,
  },
  Bullet: {
    color: "#25CB00",
    fontSize: 20,
    lineHeight: 20,
    marginRight: 6,
  },
  Item: {
    flexDirection: "row",
    paddingLeft: 2,
    marginTop: 7,
    alignItems: "flex-start",
  },
  ItemText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  MetaText: {
    marginTop: 6,
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
  },
  Container: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#F4F4F4",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    padding: 8,
    marginVertical: 7,
    flexDirection: "column",
  },
});

export default DealerContent;
