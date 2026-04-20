import { Pressable, StyleSheet, View, Image, Text } from "react-native";
import { useRef } from "react";
import { ORANGE } from "../Layout/colors";

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

export const ExpandedDealer = ({
  dealer = {},
  children,
  onOpenMap = null,
}) => {
  const mapCardRef = useRef(null);
  const dealerType = dealer.is_franchised
    ? "Franchised dealer"
    : "Independent dealer";
  const inventoryCount = getInventoryCount(dealer.inventory_count);
  const inventoryLabel = getInventoryLabel(inventoryCount);

  const handleOpenMap = () => {
    if (!onOpenMap) return;

    mapCardRef.current?.measureInWindow?.((x, y, width, height) => {
      onOpenMap({
        x,
        y,
        width,
        height,
      });
    });
  };

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
            Location: {dealer.location || "Location unavailable"}
            {"\n"}
            Type: {dealerType}
          </Text>
        </View>

        {onOpenMap ? (
          <Pressable
            ref={mapCardRef}
            style={styles.MapCard}
            onPress={handleOpenMap}
          >
            <View style={styles.MapCardBody}>
              <Text style={styles.MapCardTitle}>Open dealer map</Text>
            </View>
            <View style={styles.MapCardLabelWrap}>
              <Text style={styles.MapCardText}>Tap to open interactive map</Text>
            </View>
          </Pressable>
        ) : null}

        {children}
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
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
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
    color: ORANGE.dark,
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
    color: ORANGE.dark,
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
    backgroundColor: "#F4F4F4",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    overflow: "hidden",
  },
  MapCardBody: {
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2F7",
    paddingHorizontal: 16,
  },
  MapCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  MapCardLabelWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.88)",
  },
  MapCardText: {
    fontSize: 13,
    color: "#6B7280",
  },
});

export default ExpandedDealer;
