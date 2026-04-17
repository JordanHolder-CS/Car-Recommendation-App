import { Text, StyleSheet, View } from "react-native";
import Selector from "../Navigation/Selector";
import { ORANGE } from "../Layout/colors";

const Button = ({ label, onPress = () => {}, textStyle }) => {
  return (
    <Selector
      onPress={onPress}
      style={[styles.button]}
      pressedStyle={styles.pressedButton}
    >
      <Text style={[styles.label, textStyle]}>{label}</Text>
    </Selector>
  );
};

export const ButtonTray = ({ children, trayStyle }) => {
  return <View style={[styles.buttonTray, trayStyle]}>{children}</View>;
};

const styles = StyleSheet.create({
  buttonTray: {
    flexDirection: "row",
    gap: 15,
    paddingVertical: 5,
  },

  button: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: ORANGE.main,
    backgroundColor: ORANGE.main,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    flex: 1,
  },
  innerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    marginRight: 8,
  },
  modify: {
    backgroundColor: "white",
  },
  delete: {
    backgroundColor: "#d32f2f",
    borderColor: "#000000ff",
  },
  label: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  deleteLabel: {
    color: "white",
    fontWeight: "600",
  },
  pressedButton: {
    backgroundColor: ORANGE.press,
    shadowColor: ORANGE.dark,
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});

export default Button;
