import Screen from "../ui/Layout/screen.js";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import Button from "../ui/Navigation/ContinueButton.js";
import BackButton from "../ui/Navigation/BackButton.js";
import { ButtonTray } from "../ui/Navigation/ContinueButton.js";
import { SafeAreaView } from "react-native-safe-area-context";
import RecommendationContent from "../ui/RecommendationCard/Content.js";
import RecommendationList from "../Lists/RecommendationList.js";
import { useState, useEffect } from "react";

export const ResultScreen = ({ navigation }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //hardcoded query params for testing - replace with dynamic values from questionnaire
  const queryParams = new URLSearchParams({
    body_style: "SUV",
    min_price: "30000",
    max_price: "50000",
    is_ev: "true",
  }).toString();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(
          `https://car-recommendation-database.co.uk/api/car/filter?${queryParams}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCars(data);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const onBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.CenterContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.LoadingText}>Loading cars...</Text>
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
        <Text style={styles.HeaderTitle}>Top {cars.length} Matches</Text>
        <View style={{ width: 44 }} />
      </SafeAreaView>
      <View style={styles.SafeArea}>
        <ScrollView>
          <RecommendationList cars={cars} />
        </ScrollView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  SafeArea: { marginHorizontal: 15, flex: 1 },
  Content: { rowGap: 12, paddingBottom: 12, flex: 1 },
  BottomTray: {
    paddingBottom: 30,
    backgroundColor: "white",
  },
  Header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  HeaderTitle: {
    fontSize: 17,
    fontWeight: "600",
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
});

export default ResultScreen;
