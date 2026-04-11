import { StyleSheet, View, Image, Text } from "react-native";

const DEFAULT_DEALER_IMAGE =
  "https://www.palmcoastford.com/static/dealer-16495/Used_car_dealer_33_banner.jpg";

const getDealerBrandsLabel = (dealer = {}) => {
  if (Array.isArray(dealer.brand_names)) {
    const brands = dealer.brand_names
      .map((brand) => `${brand}`.trim())
      .filter(Boolean);

    return brands.length ? brands.join(", ") : "Brands unavailable";
  }

  if (typeof dealer.brand_names === "string" && dealer.brand_names.trim()) {
    return dealer.brand_names.trim();
  }

  return "Brands unavailable";
};

export const DealerContent = ({ dealer = {} }) => {
  const dealerType = dealer.is_franchised
    ? "Franchised dealer"
    : "Independent dealer";
  const brandNames = getDealerBrandsLabel(dealer);

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
        <Text style={styles.TypeText}>Brands: {brandNames}</Text>
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
    marginTop: 2,
    fontSize: 11,
    color: "#6B7280",
    textTransform: "capitalize",
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
    backgroundColor: "#FFFFFF",
    padding: 8,
    marginVertical: 7,
    flexDirection: "column",
  },
});

export default DealerContent;
