import { StyleSheet, Text, View } from "react-native";
import Selector from "../Navigation/Selector";
import BrandLogo from "../BrandLogo/BrandLogo";
import { ORANGE } from "../Layout/colors";

const QBrandButton = ({ id, Title, selectedValues, onPress }) => {
  const selectedBrandIds = Array.isArray(selectedValues) ? selectedValues : [];
  const isSelected = selectedBrandIds.includes(id);

  return (
    <Selector
      onPress={() => onPress?.(id)}
      style={[styles.Button, isSelected ? styles.SelectedButton : null]}
      pressedStyle={styles.PressedButton}
    >
      <View style={styles.LogoWrap}>
        <BrandLogo
          brand={Title}
          size={88}
          containerStyle={styles.LogoBadge}
          imageStyle={styles.LogoImage}
        />
      </View>
      <Text style={[styles.Title, isSelected ? styles.SelectedTitle : null]}>
        {Title}
      </Text>
    </Selector>
  );
};

const styles = StyleSheet.create({
  Button: {
    width: "100%",
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 22,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  SelectedButton: {
    borderWidth: 2,
    borderColor: ORANGE.main,
  },
  PressedButton: {
    opacity: 0.92,
  },
  LogoWrap: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  LogoBadge: {
    width: "100%",
    height: "100%",
    borderWidth: 0,
    backgroundColor: "transparent",
    padding: 0,
  },
  LogoImage: {
    width: "100%",
    height: "100%",
  },
  Title: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  SelectedTitle: {
    color: "#0F172A",
  },
});

export default QBrandButton;
