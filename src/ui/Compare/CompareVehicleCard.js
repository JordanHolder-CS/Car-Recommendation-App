import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { ChevronDown } from "lucide-react-native";
import Selector from "../Navigation/Selector";
import {
  formatCompareCurrency,
  getVehicleBrand,
  getVehicleImage,
  getVehicleName,
} from "../../ScoringConfigs/compareService";

const CompareVehicleCard = ({
  car,
  title,
  isSelectable = false,
  isDisabled = false,
  onPress = () => {},
}) => {
  const content = (
    <View style={styles.VehicleCard}>
      <ImageBackground
        source={{ uri: getVehicleImage(car) }}
        style={styles.VehicleHero}
        imageStyle={styles.VehicleHeroImage}
      >
        <View style={styles.VehicleHeroOverlay}>
          <View style={styles.VehicleHeroBottom}>
            {getVehicleBrand(car) ? (
              <Text style={styles.VehicleBrandText}>{getVehicleBrand(car)}</Text>
            ) : null}
            <Text style={styles.VehicleNameText}>{getVehicleName(car)}</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.VehicleCardBody}>
        <Text style={styles.VehicleMetaLabel}>{title}</Text>
        <Text style={styles.VehiclePriceText}>
          {formatCompareCurrency(car?.price)}
        </Text>
        {isSelectable ? (
          <View
            style={[
              styles.VehicleSelectorRow,
              isDisabled ? styles.VehicleSelectorRowDisabled : null,
            ]}
          >
            <Text
              style={[
                styles.VehicleSelectorLabel,
                isDisabled ? styles.VehicleSelectorLabelDisabled : null,
              ]}
            >
              {isDisabled ? "No other top matches" : "Choose vehicle"}
            </Text>
            <ChevronDown size={16} color={isDisabled ? "#9CA3AF" : "#111827"} />
          </View>
        ) : (
          <Text style={styles.VehicleMetaHint}>Selected vehicle</Text>
        )}
      </View>
    </View>
  );

  if (!isSelectable || isDisabled) {
    return content;
  }

  return (
    <Selector
      onPress={onPress}
      style={styles.VehicleCardPressable}
      pressedStyle={styles.VehicleCardPressed}
    >
      {content}
    </Selector>
  );
};

const styles = StyleSheet.create({
  VehicleCardPressable: {
    borderRadius: 18,
  },
  VehicleCardPressed: {
    opacity: 0.92,
  },
  VehicleCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    overflow: "hidden",
  },
  VehicleHero: {
    minHeight: 124,
    justifyContent: "flex-end",
    backgroundColor: "#1F2937",
  },
  VehicleHeroImage: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  VehicleHeroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 12,
    backgroundColor: "rgba(10, 14, 20, 0.42)",
  },
  VehicleHeroBottom: {
    alignItems: "flex-start",
  },
  VehicleBrandText: {
    maxWidth: "92%",
    fontSize: 13,
    lineHeight: 16,
    color: "rgba(255, 255, 255, 0.82)",
    fontWeight: "300",
  },
  VehicleNameText: {
    marginTop: 2,
    maxWidth: "92%",
    fontSize: 18,
    lineHeight: 22,
    color: "#FFFFFF",
    fontWeight: "300",
  },
  VehicleCardBody: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
  },
  VehicleMetaLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  VehiclePriceText: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
  },
  VehicleMetaHint: {
    marginTop: 8,
    fontSize: 12,
    color: "#6B7280",
  },
  VehicleSelectorRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  VehicleSelectorRowDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  VehicleSelectorLabel: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "500",
  },
  VehicleSelectorLabelDisabled: {
    color: "#9CA3AF",
  },
});

export default CompareVehicleCard;
