import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../ui/Navigation/BackButton";
import CompareVehicleCard from "../ui/Compare/CompareVehicleCard";
import ComparisonRowsCard from "../ui/Compare/ComparisonRowsCard";
import SelectionSheet from "../ui/SelectionSheet/SelectionSheet";
import {
  buildComparisonRows,
  buildRationaleMessage,
  formatCompareCurrency,
  getAvailableVehiclesForSide,
  getCarCompareKey,
  getUniqueComparisonVehicles,
  getVehicleBrand,
  getVehicleName,
  resolveVehicleSelection,
} from "../ScoringConfigs/compareService";

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

        <ComparisonRowsCard rows={comparisonRows} />
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
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 5,
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
  EmptyCompareText: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    color: "#6B7280",
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
