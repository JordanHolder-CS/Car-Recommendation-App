import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { ORANGE } from "../Layout/colors";

const DEFAULT_INVENTORY_IMAGE =
  "https://evcentral.com.au/wp-content/uploads/2022/12/Mercedes-AMG-C63-tracking-corner-Ascari.jpg";

const formatPrice = (value) =>
  Number.isFinite(Number(value))
    ? `GBP ${Number(value).toLocaleString("en-GB")}`
    : "Price unavailable";

const formatMileage = (value) =>
  Number.isFinite(Number(value))
    ? `${Number(value).toLocaleString("en-GB")} miles`
    : "Mileage unavailable";

export const InventoryContent = ({ listing = {} }) => {
  const vehicleName = [listing.brand_name, listing.car_name]
    .filter(Boolean)
    .join(" ");
  const vehicleImage = listing.image_url ?? listing.image ?? DEFAULT_INVENTORY_IMAGE;
  const content = (
    <View style={styles.TextWrapper}>
      <Text style={styles.NameText}>
        {vehicleName || "Vehicle unavailable"}
      </Text>

      <View style={styles.Section}>
        <Text style={styles.SectionTitle}>Listing details</Text>
        <Text style={styles.MetaText}>
          Condition: {listing.condition || "Condition unavailable"}
          {"\n"}
          Year: {listing.year || "Year unavailable"}
          {"\n"}
          Mileage: {formatMileage(listing.milage)}
          {"\n"}
          Price: {formatPrice(listing.price)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.Container}>
      {vehicleImage ? (
        <ImageBackground
          source={{ uri: vehicleImage }}
          style={styles.BackgroundImage}
          imageStyle={styles.BackgroundImageAsset}
        >
          <View style={styles.BackgroundOverlay}>{content}</View>
        </ImageBackground>
      ) : (
        <View style={[styles.BackgroundOverlay, styles.FallbackBackground]}>
          {content}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#111827",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    marginVertical: 7,
    overflow: "hidden",
  },
  BackgroundImage: {
    width: "100%",
  },
  BackgroundImageAsset: {
    resizeMode: "cover",
  },
  BackgroundOverlay: {
    backgroundColor: "rgba(15, 23, 42, 0.78)",
  },
  FallbackBackground: {
    backgroundColor: "#111827",
  },
  TextWrapper: {
    padding: 12,
    gap: 4,
  },
  NameText: {
    fontWeight: "700",
    fontSize: 20,
    color: "#FFFFFF",
  },
  Section: {
    paddingTop: 8,
  },
  SectionTitle: {
    fontWeight: "600",
    color: ORANGE.dark,
    fontSize: 14,
  },
  MetaText: {
    marginTop: 6,
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.88)",
    lineHeight: 20,
  },
});

export default InventoryContent;
