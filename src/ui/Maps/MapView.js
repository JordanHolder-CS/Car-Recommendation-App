import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { View, StyleSheet } from "react-native";

export const DEFAULT_MAP_REGION = {
  latitude: 53.4808,
  longitude: -2.2426,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const Map = ({
  initialRegion = DEFAULT_MAP_REGION,
  interactive = true,
  containerStyle = null,
  markerCoordinate = null,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={interactive}
        pitchEnabled={interactive}
        toolbarEnabled={interactive}
      >
        {markerCoordinate ? <Marker coordinate={markerCoordinate} /> : null}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default Map;
