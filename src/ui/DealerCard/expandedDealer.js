import { Pressable, StyleSheet, View, Image, Text } from "react-native";
import { Button } from "react-native-paper";

const DEFAULT_DEALER_IMAGE =
  "https://www.palmcoastford.com/static/dealer-16495/Used_car_dealer_33_banner.jpg";

const getInventoryCount = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const getInventoryLabel = (inventoryCount) =>
  inventoryCount === 1
    ? "1 vehicle in dealer inventory"
    : `${inventoryCount} vehicles in dealer inventory`;

export const ExpandedDealer = ({ dealer = {}, children, onOpenMap = null }) => {
  const dealerType = dealer.is_franchised
    ? "Franchised dealer"
    : "Independent dealer";
  const inventoryCount = getInventoryCount(dealer.inventory_count);
  const inventoryLabel = getInventoryLabel(inventoryCount);

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
        <Text style={styles.HighlightText}>{inventoryLabel}</Text>
        <Text style={styles.SubtitleText}>{dealerType}</Text>

        <View style={styles.Section}>
          <Text style={styles.SectionTitle}>Dealer details</Text>
          <Text style={styles.MetaText}>
            Dealer ID: {dealer.dealer_id ?? "N/A"}
            {"\n"}
            Location: {dealer.location || "Location unavailable"}
            {"\n"}
            Type: {dealerType}
          </Text>
        </View>

        <View style={styles.Section}>
          <Text style={styles.SectionTitle}>Inventory overview</Text>
          <Text style={styles.MetaText}>{inventoryLabel}</Text>
        </View>

        {onOpenMap ? (
          <Pressable style={styles.MapCard} onPress={onOpenMap}>
            <Text style={styles.MapCardText}>Map view</Text>
          </Pressable>
        ) : null}

        {children}
        <Button>View dealer inventory</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    // borderWidth: 1,
    // borderColor: "white",
    // borderRadius: 16,
    // backgroundColor: "#FFFFFF",
    // padding: 5,
    // marginVertical: 7,
    // flexDirection: "column",
    // gap: 7,
  },
  HeaderWrapper: {
    alignItems: "center",
  },
  ImageHeader: {
    height: 220,
    width: "100%",
    // borderRadius: 12,
  },
  TextWrapper: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  NameText: {
    fontWeight: "700",
    fontSize: 24,
    color: "#111827",
  },
  HighlightText: {
    marginTop: 6,
    fontWeight: "700",
    fontSize: 14,
    color: "#0F766E",
  },
  SubtitleText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  Section: {
    paddingTop: 14,
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
  MapCard: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  MapCardText: {
    fontSize: 13,
    color: "#6B7280",
  },
});

export default ExpandedDealer;
