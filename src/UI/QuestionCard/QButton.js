import { StyleSheet, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";

export const QButton = () => {
  return (
    <View style={[styles.button]}>
      <Text style={styles.title}>
        Example answer{"\n"}
        <Text style={styles.faded}>This is an example description</Text>
      </Text>
    </View>
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
    marginVertical: 15,
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
