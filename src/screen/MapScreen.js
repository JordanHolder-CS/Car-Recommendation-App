import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Map, { DEFAULT_MAP_REGION } from "../ui/Maps/MapView";
import { DealerContent } from "../ui/DealerCard/collapsedDealer";
import { openInGoogleMaps } from "../ui/Maps/googleMaps";
import Selector from "../ui/Navigation/Selector";
import useMapScreenTransition from "../ui/Animation/useMapScreenTransition";
import { ORANGE } from "../ui/Layout/colors";

export const MapScreen = ({ navigation, route }) => {
  const initialRegion = route?.params?.initialRegion || DEFAULT_MAP_REGION;
  const markerCoordinate = route?.params?.markerCoordinate || null;
  const selectedDealer = route?.params?.selectedDealer || null;
  const originRect = route?.params?.originRect || null;
  const {
    animatedMapStyle,
    animatedBackdropStyle,
    animatedCardStyle,
    closeMap,
  } = useMapScreenTransition({
    originRect,
    onCloseComplete: () => navigation.goBack(),
  });

  const handleOpenGoogleMaps = () =>
    openInGoogleMaps({
      markerCoordinate,
    });

  return (
    <View style={styles.Container}>
      <Animated.View style={[styles.Backdrop, animatedBackdropStyle]} />
      <Animated.View style={[styles.MapWrap, animatedMapStyle]}>
        <Map
          initialRegion={initialRegion}
          markerCoordinate={markerCoordinate}
        />
      </Animated.View>
      {selectedDealer ? (
        <Animated.View style={[styles.CardWrap, animatedCardStyle]}>
          <Selector onPress={closeMap}>
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
            <Text style={styles.GoogleMapsButtonText}>Open in Google Maps</Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  Backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
  },
  MapWrap: {
    position: "absolute",
    overflow: "hidden",
  },
  CardWrap: {
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

export default MapScreen;
