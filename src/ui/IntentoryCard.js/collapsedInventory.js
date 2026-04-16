import { StyleSheet, Text, View } from "react-native";

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

  return (
    <View style={styles.Container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    padding: 12,
    marginVertical: 7,
  },
  TextWrapper: {
    gap: 4,
  },
  NameText: {
    fontWeight: "700",
    fontSize: 20,
    color: "#111827",
  },
  Section: {
    paddingTop: 8,
  },
  SectionTitle: {
    fontWeight: "600",
    color: "#111827",
    fontSize: 14,
  },
  MetaText: {
    marginTop: 6,
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
  },
});

export default InventoryContent;
