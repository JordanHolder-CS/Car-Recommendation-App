import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Screen from "../ui/Layout/screen.js";
import BackButton from "../ui/Navigation/BackButton.js";
import DealerList from "../Lists/DealerList.js";
import { ORANGE } from "../ui/Layout/colors.js";

const API_BASE_URL =
  process.env.HTTPS_URL || "https://car-recommendation-database.co.uk/api";
const DEALER_API_URL = `${API_BASE_URL}/dealers`;

export const DealerScreen = ({ navigation, route }) => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const selectedCar = route?.params?.selectedCar || null;
  const recommendedCars = Array.isArray(route?.params?.recommendedCars)
    ? route.params.recommendedCars
    : [];
  const candidateCars = recommendedCars.length
    ? recommendedCars
    : selectedCar
      ? [selectedCar]
      : [];
  const recommendedCarIds = [...new Set(
    candidateCars
      .map((car) => Number.parseInt(car?.car_id, 10))
      .filter(Number.isFinite),
  )];
  const serializedCarIds = JSON.stringify(recommendedCarIds);

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        setLoading(true);
        setError(null);
        setDealers([]);

        const query = recommendedCarIds.length
          ? `?carIds=${recommendedCarIds.join(",")}`
          : "";

        const response = await fetch(`${DEALER_API_URL}${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDealers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching dealers:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDealers();
  }, [serializedCarIds]);

  const onBack = () => {
    navigation.goBack();
  };

  const onSelectDealer = (dealer) => {
    navigation.push("ExpandedDealer", {
      selectedDealer: dealer,
    });
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.CenterContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.LoadingText}>Loading dealers...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View style={styles.CenterContainer}>
          <Text style={styles.ErrorText}>Error: {error}</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <SafeAreaView style={styles.Header} edges={["top"]}>
        <BackButton onBack={onBack} />
        <View style={styles.HeaderText}>
          <Text style={styles.HeaderTitle}>
            {recommendedCarIds.length ? "Matching Dealers" : "Dealers"}
          </Text>
          {selectedCar ? (
            <Text style={styles.HeaderSubtitle}>
              Showing dealers for {selectedCar.brand_name} {selectedCar.car_name}
            </Text>
          ) : null}
        </View>
        <View style={styles.HeaderSpacer} />
      </SafeAreaView>
      <View style={styles.SafeArea}>
        {dealers.length ? (
          <ScrollView>
            <DealerList dealers={dealers} onSelect={onSelectDealer} />
          </ScrollView>
        ) : (
          <View style={styles.CenterContainer}>
            <Text style={styles.EmptyTitle}>No dealers found</Text>
            <Text style={styles.EmptyText}>
              {recommendedCarIds.length
                ? "No dealerships currently stock any of these recommended cars."
                : "Try again once the dealer endpoint is available."}
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  SafeArea: { marginHorizontal: 15, flex: 1 },
  Header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  HeaderText: {
    alignItems: "center",
  },
  HeaderTitle: {
    fontSize: 21,
    fontWeight: "600",
  },
  HeaderProfile: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  HeaderSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: ORANGE.deep,
    textTransform: "capitalize",
  },
  HeaderNotice: {
    marginTop: 4,
    maxWidth: 260,
    fontSize: 11,
    color: ORANGE.deeper,
    textAlign: "center",
  },
  HeaderSpacer: {
    width: 44,
  },
  CenterContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  LoadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  ErrorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  EmptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  EmptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  EmptyButtonWrap: {
    width: 220,
  },
});

export default DealerScreen;
