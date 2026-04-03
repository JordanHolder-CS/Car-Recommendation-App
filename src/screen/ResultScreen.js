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
import { SafeAreaView } from "react-native-safe-area-context";
import RecommendationList from "../Lists/RecommendationList.js";
import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.HTTPS_URL || "https://car-recommendation-database.co.uk/api";
const CAR_API_URL = `${API_BASE_URL}/car`;

export const ResultScreen = ({ navigation, route }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useCase, setUseCase] = useState("");
  const [intent, setIntent] = useState("");
  const [profileLabel, setProfileLabel] = useState("");
  const [budgetFallbackApplied, setBudgetFallbackApplied] = useState(false);
  const [recommendationNote, setRecommendationNote] = useState("");
  const answers = route?.params?.answers || {};
  const requestKey = route?.params?.requestKey || "";
  const serializedAnswers = JSON.stringify(answers);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        setCars([]);

        const response = await fetch(`${CAR_API_URL}/recommend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: JSON.parse(serializedAnswers),
            limit: 5,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCars(data.recommendations || []);
        setUseCase(data.useCase || "");
        setIntent(data.intent || "");
        setProfileLabel(data.profileLabel || "");
        setBudgetFallbackApplied(Boolean(data.budgetFallbackApplied));
        setRecommendationNote(data.recommendationNote || "");
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [requestKey, serializedAnswers]);

  const onBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.CenterContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.LoadingText}>Loading recommendations...</Text>
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
            Top {cars.length} Matches
            {budgetFallbackApplied ? " (Budget Assessed)" : ""}
          </Text>
          {profileLabel ? (
            <Text style={styles.HeaderProfile}>{profileLabel}</Text>
          ) : null}
          {recommendationNote ? (
            <Text style={styles.HeaderNotice}>{recommendationNote}</Text>
          ) : null}
          {cars.length && (useCase || intent) ? (
            <Text style={styles.HeaderSubtitle}>
              {useCase ? `Use case: ${useCase.replace(/_/g, " ")}` : ""}
              {useCase && intent ? " | " : ""}
              {intent ? `Intent: ${intent.replace(/_/g, " ")}` : ""}
            </Text>
          ) : null}
        </View>
        <View style={{ width: 44 }} />
      </SafeAreaView>
      <View style={styles.SafeArea}>
        {cars.length ? (
          <ScrollView>
            <RecommendationList cars={cars} />
          </ScrollView>
        ) : (
          <View style={styles.CenterContainer}>
            <Text style={styles.EmptyTitle}>No exact matches found</Text>
            <Text style={styles.EmptyText}>
              Try changing a hard filter like budget, transmission, or fuel
              type.
            </Text>
            <View style={styles.EmptyButtonWrap}>
              <Button
                label="Retake Questionnaire"
                onPress={() => navigation.navigate("Questionnaire")}
              />
            </View>
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
    fontSize: 17,
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
    color: "#6B7280",
    textTransform: "capitalize",
  },
  HeaderNotice: {
    marginTop: 4,
    maxWidth: 260,
    fontSize: 11,
    color: "#92400E",
    textAlign: "center",
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

export default ResultScreen;
