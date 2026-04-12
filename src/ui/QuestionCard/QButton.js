import { StyleSheet, View, Text } from "react-native";
import { Pressable } from "react-native";
import RadioButton from "./RadioButton";

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
    <Pressable onPress={handlePress}>
      <View style={[styles.button]}>
        <RadioButton
          selectedId={isSelected ? "1" : null}
          options={[{ id: "1", value: "2" }]}
        />
        <Text style={styles.title}>
          {Title}
          {"\n"}
          <Text style={styles.desc}>{Description}</Text>
        </Text>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  button: {
    //borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingRight: 14,
    marginVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
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
    //flex: 1,
    flexShrink: 1,
  },

  desc: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 10,
    flex: 1,
    flexShrink: 1,
  },
});

export default QButton;
