import { StyleSheet, View, Text } from "react-native";
import Selector from "../Navigation/Selector";
import { ORANGE } from "../Layout/colors";

export const QButton = ({ id, Title, Description, selectedId, onPress }) => {
  const selectedValues = Array.isArray(selectedId)
    ? selectedId
    : selectedId !== null && selectedId !== undefined
      ? [selectedId]
      : [];
  const isSelected = selectedValues.includes(id);

  const handlePress = () => {
    onPress?.(id);
  };

  return (
    <Selector
      onPress={handlePress}
      style={[styles.button, isSelected ? styles.buttonSelected : null]}
      pressedStyle={styles.buttonPressed}
    >
      <View style={styles.textWrap}>
        <Text style={[styles.title, isSelected ? styles.titleSelected : null]}>
          {Title}
        </Text>
        {Description ? (
          <Text style={[styles.desc, isSelected ? styles.descSelected : null]}>
            {Description}
          </Text>
        ) : null}
      </View>
    </Selector>
  );
};
const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 28,
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 74,
  },
  buttonSelected: {
    backgroundColor: ORANGE.main,
    borderColor: ORANGE.main,
    shadowColor: ORANGE.dark,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
  textWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flexShrink: 1,
    textAlign: "center",
  },
  titleSelected: {
    color: "#FFFFFF",
  },
  desc: {
    marginTop: 5,
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
    flexShrink: 1,
    textAlign: "center",
  },
  descSelected: {
    color: "rgba(255,255,255,0.86)",
  },
});

export default QButton;
