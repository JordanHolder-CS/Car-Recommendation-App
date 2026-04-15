import { Animated, StyleSheet, View } from "react-native";
import Map, { DEFAULT_MAP_REGION } from "../ui/Maps/MapView";
import { DealerContent } from "../ui/DealerCard/collapsedDealer";
import Selector from "../ui/Navigation/Selector";
import useMapScreenTransition from "../ui/Animation/useMapScreenTransition";

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
            <DealerContent dealer={selectedDealer} />
          </Selector>
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
});

export default MapScreen;
