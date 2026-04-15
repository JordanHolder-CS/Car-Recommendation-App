import { View, StyleSheet } from "react-native";
import Map, { DEFAULT_MAP_REGION } from "../ui/Maps/MapView";
import Button, { ButtonTray } from "../ui/Navigation/ContinueButton";

export const MapScreen = ({ navigation, route }) => {
  const initialRegion = route?.params?.initialRegion || DEFAULT_MAP_REGION;

  return (
    <View style={styles.Container}>
      <Map initialRegion={initialRegion} />
      <View style={styles.ButtonWrap}>
        <ButtonTray>
          <Button label="Back To Dealer" onPress={() => navigation.goBack()} />
        </ButtonTray>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  ButtonWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
  },
});

export default MapScreen;
