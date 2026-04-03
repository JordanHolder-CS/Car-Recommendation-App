import { StyleSheet, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import Selector from "./Selector";

const BackButton = ({ onBack }) => {
  return (
    <Selector
      onPress={onBack}
      style={[styles.button]}
      pressedStyle={styles.pressedButton}
    >
      <View style={styles.ButtonStyle}>
        <ChevronLeft size={25} color="black" />
      </View>
    </Selector>
  );
};

const styles = StyleSheet.create({
  ButtonStyle: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BackButton;
