import { Pressable, StyleSheet, View, Image, Text } from "react-native";
import { useRef } from "react";
import { Button } from "react-native-paper";
import Map from "../Maps/MapView";

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
  mapRegion = null,
  markerCoordinate = null,
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
          <Pressable ref={mapCardRef} style={styles.MapCard} onPress={handleOpenMap}>
            <Map
              initialRegion={mapRegion || undefined}
              interactive={false}
              containerStyle={styles.MapPreview}
              markerCoordinate={markerCoordinate}
            />
            <View style={styles.MapCardLabelWrap}>
              <Text style={styles.MapCardText}>Map view</Text>
            </View>
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
    backgroundColor: "#F4F4F4",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    overflow: "hidden",
  },
  MapPreview: {
    height: 140,
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
