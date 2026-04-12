import { useEffect, useMemo, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronDown } from "lucide-react-native";
import BackButton from "../ui/Navigation/BackButton";
import Selector from "../ui/Navigation/Selector";
import SelectionSheet from "../ui/SelectionSheet/SelectionSheet";
import {
  buildComparisonRows,
  buildRationaleMessage,
  formatCompareCurrency,
  getAvailableVehiclesForSide,
  getCarCompareKey,
  getUniqueComparisonVehicles,
  getVehicleBrand,
  getVehicleImage,
  getVehicleName,
  resolveVehicleSelection,
} from "../ScoringConfigs/compareService";

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
              <Text style={styles.VehicleBrandText}>
                {getVehicleBrand(car)}
              </Text>
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

const CompareScreen = ({ navigation, route }) => {
  const selectedCar = route?.params?.selectedCar || null;
  const recommendedCars = Array.isArray(route?.params?.recommendedCars)
    ? route.params.recommendedCars
    : [];
  const allVehicles = useMemo(
    () => getUniqueComparisonVehicles(selectedCar, recommendedCars),
    [selectedCar, recommendedCars],
  );
  const [leftCar, setLeftCar] = useState(null);
  const [rightCar, setRightCar] = useState(selectedCar ?? null);
  const [activePickerSide, setActivePickerSide] = useState(null);

  useEffect(() => {
    setRightCar((currentValue) => {
      return (
        resolveVehicleSelection({
          vehicles: allVehicles,
          currentCar: currentValue,
          preferredCar: selectedCar,
        }) ?? selectedCar
      );
    });
  }, [allVehicles, selectedCar]);

  useEffect(() => {
    setLeftCar((currentValue) => {
      return resolveVehicleSelection({
        vehicles: allVehicles,
        blockedCar: rightCar,
        currentCar: currentValue,
      });
    });
  }, [allVehicles, rightCar]);

  const focusCar = rightCar ?? selectedCar;
  const leftPickerOptions = useMemo(
    () => getAvailableVehiclesForSide(allVehicles, rightCar),
    [allVehicles, rightCar],
  );
  const rightPickerOptions = useMemo(
    () => getAvailableVehiclesForSide(allVehicles, leftCar),
    [allVehicles, leftCar],
  );
  const activePickerOptions =
    activePickerSide === "right" ? rightPickerOptions : leftPickerOptions;
  const activeSelectedCar = activePickerSide === "right" ? rightCar : leftCar;
  const leftCardDisabled = allVehicles.length < 2;
  const rightCardDisabled = allVehicles.length < 2;
  const comparisonRows = useMemo(
    () => buildComparisonRows(leftCar, focusCar),
    [leftCar, focusCar],
  );

  if (!selectedCar) {
    return (
      <View style={styles.Screen}>
        <SafeAreaView style={styles.Header} edges={["top"]}>
          <BackButton onBack={() => navigation.goBack()} />
          <View style={styles.HeaderText}>
            <Text style={styles.HeaderTitle}>Compare Cars</Text>
          </View>
          <View style={styles.HeaderSpacer} />
        </SafeAreaView>
        <View style={styles.EmptyStateWrap}>
          <Text style={styles.EmptyStateTitle}>Comparison unavailable</Text>
          <Text style={styles.EmptyStateText}>
            Open compare from a recommendation to start a side-by-side view.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.Screen}>
      <SafeAreaView style={styles.Header} edges={["top"]}>
        <BackButton onBack={() => navigation.goBack()} />
        <View style={styles.HeaderText}>
          <Text style={styles.HeaderTitle}>Compare Cars</Text>
        </View>
        <View style={styles.HeaderSpacer} />
      </SafeAreaView>

      <ScrollView
        style={styles.ScrollView}
        contentContainerStyle={styles.ScrollContent}
      >
        <View style={styles.BannerCard}>
          <Text style={styles.BannerTitle}>Best for you because...</Text>
          <Text style={styles.BannerText}>
            {buildRationaleMessage(focusCar)}
          </Text>
        </View>

        <View style={styles.VehicleCardsRow}>
          <View style={styles.VehicleCardColumn}>
            <CompareVehicleCard
              car={leftCar}
              title="Compare against"
              isSelectable
              isDisabled={leftCardDisabled}
              onPress={() => setActivePickerSide("left")}
            />
          </View>
          <View style={styles.VehicleCardColumn}>
            <CompareVehicleCard
              car={focusCar}
              title="Focus vehicle"
              isSelectable
              isDisabled={rightCardDisabled}
              onPress={() => setActivePickerSide("right")}
            />
          </View>
        </View>

        {allVehicles.length < 2 ? (
          <Text style={styles.EmptyCompareText}>
            No other top matches are available to compare yet.
          </Text>
        ) : null}

        <View style={styles.TableCard}>
          <Text style={styles.TableTitle}>Why this over that</Text>
          <Text style={styles.TableSubtitle}>
            Fit scores are explained in plain English so the percentages are not
            just black-box numbers.
          </Text>
          <View style={styles.RowsWrap}>
            {comparisonRows.map((row) => (
              <View key={row.key} style={styles.ComparisonBlock}>
                <View style={styles.RowHeader}>
                  <Text style={styles.RowLabel}>{row.label}</Text>
                  {row.description ? (
                    <Text style={styles.RowDescription}>{row.description}</Text>
                  ) : null}
                </View>

                <View style={styles.ComparisonRow}>
                  <View
                    style={[
                      styles.ValueCell,
                      row.winner === "left" ? styles.WinnerCell : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.ValueText,
                        row.winner === "left" ? styles.WinnerText : null,
                      ]}
                    >
                      {row.leftText}
                    </Text>
                    {row.leftDetail ? (
                      <Text style={styles.ValueDetail}>{row.leftDetail}</Text>
                    ) : null}
                  </View>

                  <View style={styles.ValueDivider}>
                    <Text style={styles.ValueDividerText}>vs</Text>
                  </View>

                  <View
                    style={[
                      styles.ValueCell,
                      row.winner === "right" ? styles.WinnerCell : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.ValueText,
                        row.winner === "right" ? styles.WinnerText : null,
                      ]}
                    >
                      {row.rightText}
                    </Text>
                    {row.rightDetail ? (
                      <Text style={styles.ValueDetail}>{row.rightDetail}</Text>
                    ) : null}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <SelectionSheet
        visible={Boolean(activePickerSide)}
        title={
          activePickerSide === "right"
            ? "Choose focus vehicle"
            : "Choose comparison vehicle"
        }
        subtitle="Pick any other top recommendation for this side of the comparison."
        options={activePickerOptions}
        selectedKey={getCarCompareKey(activeSelectedCar)}
        getOptionKey={getCarCompareKey}
        getOptionLabel={(candidate) =>
          `${getVehicleBrand(candidate)} ${getVehicleName(candidate)}`.trim()
        }
        getOptionMeta={(candidate) => formatCompareCurrency(candidate?.price)}
        onSelect={(candidate) => {
          if (activePickerSide === "right") {
            setRightCar(candidate);
          } else {
            setLeftCar(candidate);
          }

          setActivePickerSide(null);
        }}
        onClose={() => setActivePickerSide(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  Header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  HeaderText: {
    alignItems: "center",
  },
  HeaderTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },
  HeaderSpacer: {
    width: 44,
  },
  ScrollView: {
    flex: 1,
  },
  ScrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 28,
  },
  BannerCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  BannerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },
  BannerText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: "#6B7280",
  },
  VehicleCardsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  VehicleCardColumn: {
    flex: 1,
  },
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
  EmptyCompareText: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    color: "#6B7280",
  },
  TableCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },
  TableTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  TableSubtitle: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 16,
    color: "#6B7280",
  },
  RowsWrap: {
    marginTop: 10,
    gap: 12,
  },
  ComparisonBlock: {
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 14,
    backgroundColor: "#FCFCFD",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  RowHeader: {
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  ComparisonRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 8,
  },
  ValueCell: {
    flex: 1,
    minHeight: 68,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  WinnerCell: {
    borderColor: "#BBF7D0",
    backgroundColor: "#F0FDF4",
  },
  ValueText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  ValueDetail: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 13,
    color: "#6B7280",
    textAlign: "center",
  },
  WinnerText: {
    color: "#15803D",
  },
  ValueDivider: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  ValueDividerText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
  },
  RowLabel: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  RowDescription: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  EmptyStateWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  EmptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  EmptyStateText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default CompareScreen;
