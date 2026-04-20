import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

// use https://fonts.google.com/icons for icons

const Icons = ({ icon, size, style = "Default" }) => {
  const resolvedSize =
    typeof size === "string" ? Number.parseFloat(size) : size;
  const iconSize = Number.isFinite(resolvedSize) ? resolvedSize : 24;

  return (
    <MaterialIcons
      name={icon}
      size={iconSize}
      color={styles[style]?.color || styles.Default.color}
    />
  );
};

const styles = StyleSheet.create({
  Default: { color: "#5d5d5d" },
  Pro: { color: "#25cb00" },
  Con: { color: "#d50000" },
});

export default Icons;
