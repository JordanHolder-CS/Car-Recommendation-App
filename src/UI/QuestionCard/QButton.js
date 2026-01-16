import { StyleSheet, View, Text } from "react-native";
import { Pressable } from "react-native";
import RadioButton from "./RadioButton";

export const QButton = ({ id, Title, Description, selectedId, onPress }) => {
  const isSelected = selectedId === id;

  const handlePress = () => {
    onPress?.(isSelected ? undefined : id);
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={[styles.button]}>
        <RadioButton
          selectedId={isSelected ? "1" : null}
          options={[{ id: "1", value: "2" }]}
        />
        <Text style={styles.title}>
          {Title}
          {"\n"}
          <Text style={styles.faded}>{Description}</Text>
        </Text>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 7,
    marginHorizontal: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    backgroundColor: "transparent",
  },

  textWrap: {
    // flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  faded: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
  },
});

export default QButton;
