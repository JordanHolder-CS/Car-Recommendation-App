import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Screen from "../ui/Layout/screen";
import BackButton from "../ui/Navigation/BackButton";
import ExpandedDealer from "../ui/DealerCard/expandedDealer";
import { DealerContent } from "../ui/DealerCard/collapsedDealer";
import DealerInventList from "../Lists/DealerInventList";
import { DEFAULT_MAP_REGION } from "../ui/Maps/MapView";
import Map from "../ui/Maps/MapView";
import { openInGoogleMaps } from "../ui/Maps/googleMaps";
import Selector from "../ui/Navigation/Selector";
import useMapOverlayTransition from "../ui/Animation/useMapOverlayTransition";
import { ORANGE } from "../ui/Layout/colors";
import { API_BASE_URL } from "../config/api";

const getDealerMapRegion = (dealer) => {
  const latitude = Number.parseFloat(dealer?.latitude);
  const longitude = Number.parseFloat(dealer?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return DEFAULT_MAP_REGION;
  }

  return {
    ...DEFAULT_MAP_REGION,
    latitude,
    longitude,
  };
};

const getDealerMarkerCoordinate = (dealer) => {
  const latitude = Number.parseFloat(dealer?.latitude);
  const longitude = Number.parseFloat(dealer?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
};

const ExpandedDealerScreen = ({ navigation, route }) => {
  const selectedDealer =
    route?.params?.selectedDealer || route?.params?.dealer || null;
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mapRegion = getDealerMapRegion(selectedDealer);
  const markerCoordinate = getDealerMarkerCoordinate(selectedDealer);
  const {
    mapOriginRect,
    isMapOverlayVisible,
    animatedBackdropStyle,
    animatedMapStyle,
    animatedCardStyle,
    openMapOverlay,
    closeMapOverlay,
  } = useMapOverlayTransition();

  const handleOpenGoogleMaps = () =>
    openInGoogleMaps({
      markerCoordinate,
    });

  useEffect(() => {
    const dealerId = selectedDealer?.dealer_id;

    if (!dealerId) {
      setListings([]);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchDealerListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/dealers/${dealerId}/listings`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching dealer listings:", err);
        setError(err.message);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDealerListings();
  }, [selectedDealer?.dealer_id]);

  const handleSelectListing = (listing) => {
    const bookingContext = {
      vehicleName: [listing?.year, listing?.brand_name, listing?.car_name]
        .filter(Boolean)
        .join(" "),
      image_url: listing?.image_url ?? listing?.image ?? null,
      dealerName: selectedDealer?.dealer_name ?? listing?.dealer_name ?? null,
      dealerAddress: selectedDealer?.location ?? listing?.location ?? null,
      dealerId: selectedDealer?.dealer_id ?? listing?.dealer_id ?? null,
      dealerInventoryId: listing?.dealerinventory_id ?? null,
      carId: listing?.car_id ?? null,
    };

    navigation.push("BookingScreen", {
      bookingContext,
    });
  };

  return (
    <Screen>
      <SafeAreaView style={styles.Header} edges={["top"]}>
        <BackButton onBack={() => navigation.goBack()} />
        <View style={styles.HeaderText}>
          <Text style={styles.HeaderTitle}>Dealer</Text>
        </View>
        <View style={styles.HeaderSpacer} />
      </SafeAreaView>

      <View style={styles.SafeArea}>
        {selectedDealer ? (
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <ExpandedDealer
              dealer={selectedDealer}
              mapRegion={mapRegion}
              markerCoordinate={markerCoordinate}
              onOpenMap={openMapOverlay}
            >
              <View style={styles.Section}>
                <Text style={styles.SectionTitle}>Current listings</Text>
                {loading ? (
                  <View style={styles.StatusRow}>
                    <ActivityIndicator size="small" color="#007AFF" />
                    <Text style={styles.StatusText}>Loading listings...</Text>
                  </View>
                ) : error ? (
                  <Text style={styles.ErrorText}>Error: {error}</Text>
                ) : listings.length ? (
                  <DealerInventList
                    listings={listings}
                    onSelect={handleSelectListing}
                  />
                ) : (
                  <Text style={styles.StatusText}>No listings found.</Text>
                )}
              </View>
            </ExpandedDealer>
          </ScrollView>
        ) : (
          <View style={styles.EmptyState}>
            <Text style={styles.EmptyText}>Dealer unavailable</Text>
          </View>
        )}
      </View>
      {isMapOverlayVisible && mapOriginRect ? (
        <View style={styles.MapOverlay}>
          <Animated.View
            style={[styles.MapOverlayBackdrop, animatedBackdropStyle]}
          />
          <Animated.View style={[styles.MapOverlayMapWrap, animatedMapStyle]}>
            <Map
              initialRegion={mapRegion}
              markerCoordinate={markerCoordinate}
            />
          </Animated.View>
          {selectedDealer ? (
            <Animated.View
              style={[styles.MapOverlayCardWrap, animatedCardStyle]}
            >
              <Selector onPress={closeMapOverlay}>
                <DealerContent dealer={selectedDealer} showBrands={false} />
              </Selector>
              <Pressable
                accessibilityRole="button"
                onPress={handleOpenGoogleMaps}
                style={({ pressed }) => [
                  styles.GoogleMapsButton,
                  pressed ? styles.GoogleMapsButtonPressed : null,
                ]}
              >
                <Text style={styles.GoogleMapsButtonText}>
                  Open in Google Maps
                </Text>
              </Pressable>
            </Animated.View>
          ) : null}
        </View>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  SafeArea: {
    // marginHorizontal: 15,
    flex: 1,
  },
  Header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  HeaderText: {
    alignItems: "center",
  },
  HeaderTitle: {
    fontSize: 21,
    fontWeight: "600",
  },
  HeaderSpacer: {
    width: 44,
  },
  Section: {
    paddingTop: 14,
  },
  SectionTitle: {
    fontWeight: "600",
    color: "#111827",
    fontSize: 14,
  },
  StatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  StatusText: {
    marginTop: 8,
    fontSize: 13,
    color: "#6B7280",
  },
  ErrorText: {
    marginTop: 8,
    fontSize: 13,
    color: "#DC2626",
  },
  EmptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  EmptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
  MapOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  MapOverlayBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
  },
  MapOverlayMapWrap: {
    position: "absolute",
    overflow: "hidden",
  },
  MapOverlayCardWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
  },
  GoogleMapsButton: {
    alignSelf: "center",
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  GoogleMapsButtonPressed: {
    opacity: 0.82,
  },
  GoogleMapsButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: ORANGE.dark,
  },
});

export default ExpandedDealerScreen;
