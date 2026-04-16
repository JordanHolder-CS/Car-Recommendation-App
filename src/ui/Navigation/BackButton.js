import { StyleSheet, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import Selector from "./Selector";

const BackButton = ({ onBack, iconColor = "black", size = 25 }) => {
  return (
    <Selector
      onPress={onBack}
      style={[styles.button]}
      pressedStyle={styles.pressedButton}
    >
      <View style={styles.ButtonStyle}>
        <ChevronLeft size={size} color={iconColor} />
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
