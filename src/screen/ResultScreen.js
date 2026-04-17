import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Screen from "../ui/Layout/screen.js";
import Button from "../ui/Navigation/ContinueButton.js";
import BackButton from "../ui/Navigation/BackButton.js";
import Selector from "../ui/Navigation/Selector.js";
import RecommendationList from "../Lists/RecommendationList.js";
import { ORANGE } from "../ui/Layout/colors.js";
import useRetakeButtonReveal from "../ui/Animation/useRetakeButtonReveal.js";

const BATCH_SIZE = 5;
const RESULT_LIMIT = 10;
const MINIMUM_MATCH_SCORE = 0.5;

const API_BASE_URL =
  process.env.HTTPS_URL || "https://car-recommendation-database.co.uk/api";
const CAR_API_URL = `${API_BASE_URL}/car`;

const isRecommendationMatch = (car) =>
  typeof car?.matchScore === "number" && car.matchScore >= MINIMUM_MATCH_SCORE;

export const ResultScreen = ({ navigation, route }) => {
  const [cars, setCars] = useState([]);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useCase, setUseCase] = useState("");
  const [intent, setIntent] = useState("");
  const [profileLabel, setProfileLabel] = useState("");
  const [budgetFallbackApplied, setBudgetFallbackApplied] = useState(false);
  const answers = route?.params?.answers || {};
  const requestKey = route?.params?.requestKey || "";
  const serializedAnswers = JSON.stringify(answers);
  const {
    showRetakeButton,
    resetRetakeButton,
    handleResultsScroll,
    retakeButtonEntering,
  } = useRetakeButtonReveal();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        setCars([]);
        setVisibleCount(BATCH_SIZE);
        resetRetakeButton();

        const response = await fetch(`${CAR_API_URL}/recommend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: JSON.parse(serializedAnswers),
            limit: RESULT_LIMIT,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const profile = data.profile || {};
        const meta = data.meta || {};

        setCars((data.recommendations || []).filter(isRecommendationMatch));
        setUseCase(profile.useCase || data.useCase || "");
        setIntent(profile.intent || data.intent || "");
        setProfileLabel(profile.label || data.profileLabel || "");
        setBudgetFallbackApplied(
          Boolean(meta.budgetFallbackApplied ?? data.budgetFallbackApplied),
        );
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

  const visibleCars = cars.slice(0, visibleCount);
  const canShowMore = visibleCount < cars.length;

  const onSelectRecommendation = (car) => {
    navigation.navigate("ExpandedResult", {
      selectedCar: car,
      recommendedCars: cars,
    });
  };

  const onRetakeQuestionnaire = () => {
    navigation.navigate("Questionnaire");
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
            Top {visibleCars.length}
            {cars.length > visibleCars.length ? ` of ${cars.length}` : ""}{" "}
            Matches
            {budgetFallbackApplied ? " (Budget Assessed)" : ""}
          </Text>
          {profileLabel ? (
            <Text style={styles.HeaderProfile}>{profileLabel}</Text>
          ) : null}
          {cars.length && (useCase || intent) ? (
            <Text style={styles.HeaderSubtitle}>
              {useCase ? `Use case: ${useCase.replace(/_/g, " ")}` : ""}
              {useCase && intent ? " | " : ""}
              {intent ? `Intent: ${intent.replace(/_/g, " ")}` : ""}
            </Text>
          ) : null}
        </View>
        <View style={styles.HeaderSpacer} />
      </SafeAreaView>
      <View style={styles.SafeArea}>
        {cars.length ? (
          <ScrollView
            onScroll={handleResultsScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.ResultsScrollContent}
          >
            <RecommendationList
              cars={visibleCars}
              onSelect={onSelectRecommendation}
            />
            {canShowMore ? (
              <Selector
                onPress={() =>
                  setVisibleCount((currentCount) =>
                    Math.min(currentCount + BATCH_SIZE, cars.length),
                  )
                }
                style={styles.ShowMoreCard}
                pressedStyle={styles.ShowMoreCardPressed}
              >
                <View style={styles.ShowMoreIcon}>
                  <Text style={styles.ShowMoreIconText}>+</Text>
                </View>
                <Text style={styles.ShowMoreTitle}>
                  Show next {BATCH_SIZE} cars?
                </Text>
                <Text style={styles.ShowMoreSubtitle}>
                  These are less likely to match your requirements
                </Text>
              </Selector>
            ) : null}
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

        {showRetakeButton ? (
          <Animated.View
            entering={retakeButtonEntering}
            style={styles.RetakeButtonWrap}
          >
            <Button
              label="Retake Questionnaire"
              onPress={onRetakeQuestionnaire}
            />
          </Animated.View>
        ) : null}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  SafeArea: { marginHorizontal: 15, flex: 1 },
  ResultsScrollContent: {
    paddingBottom: 96,
  },
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
    color: ORANGE.dark,
  },
  HeaderSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: ORANGE.deep,
    textTransform: "capitalize",
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
  RetakeButtonWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 18,
    paddingHorizontal: 18,
  },
  MoreButtonWrap: {
    marginTop: 4,
    marginBottom: 24,
  },
  ShowMoreCard: {
    marginTop: 6,
    marginBottom: 20,
    borderRadius: 14,
    backgroundColor: "#1F1F1F",
    shadowColor: "#000000",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  ShowMoreCardPressed: {
    backgroundColor: "#2B2B2B",
  },
  ShowMoreIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  ShowMoreIconText: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "500",
    color: "#111111",
  },
  ShowMoreTitle: {
    fontSize: 15,
    lineHeight: 18,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "500",
  },
  ShowMoreSubtitle: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 13,
    color: "#D1D5DB",
    textAlign: "center",
    maxWidth: 190,
  },
});

export default ResultScreen;
