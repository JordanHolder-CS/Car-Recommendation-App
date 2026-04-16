import Screen from "../ui/Layout/screen.js";
import { useState } from "react";
import QuestionList from "../Lists/QuestionListing.js";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import Button from "../ui/Navigation/ContinueButton.js";
import BackButton from "../ui/Navigation/BackButton.js";
import { ButtonTray } from "../ui/Navigation/ContinueButton.js";
import { QPages } from "../Data (Temp)/QuestionPages.js";
import { ProgressBar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export const QuestionScreen = ({ navigation }) => {
  const steps = QPages;

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const step = steps[stepIndex];
  const selectedValue =
    step.selectionMode === "multiple"
      ? Array.isArray(answers[step.key])
        ? answers[step.key]
        : []
      : answers[step.key] ?? null;
  const hasAnswer = step.optional
    ? true
    : Array.isArray(selectedValue)
      ? selectedValue.length > 0
      : selectedValue !== null && selectedValue !== undefined;

  const onSelect = (nextValue) => {
    setAnswers((prev) => {
      if (step.selectionMode === "multiple") {
        const currentValues = Array.isArray(prev[step.key]) ? prev[step.key] : [];
        const isSelected = currentValues.includes(nextValue);
        const updatedValues = isSelected
          ? currentValues.filter((value) => value !== nextValue)
          : step.maxSelections && currentValues.length >= step.maxSelections
            ? currentValues
            : [...currentValues, nextValue];

        return { ...prev, [step.key]: updatedValues };
      }

      return { ...prev, [step.key]: nextValue ?? null };
    });
  };

  const onBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };
  const onContinue = () => {
    if (!hasAnswer) return;
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
    else {
      navigation.push("ResultScreen", {
        answers,
        requestKey: Date.now().toString(),
      });
    }
  };
  return (
    <Screen>
      <SafeAreaView style={styles.Header} edges={["top"]}>
        <BackButton onBack={onBack} />
        <Text style={styles.HeaderTitle}>Questionnaire</Text>
        <View style={{ width: 44 }} />
      </SafeAreaView>
      <View style={styles.ProgressShell}>
        <ProgressBar
          progress={(stepIndex + 1) / steps.length}
          color="#3B82F6"
          style={styles.ProgressBar}
        />
      </View>
      <View style={styles.SafeArea}>
        <ScrollView
          style={styles.ContentScroll}
          contentContainerStyle={styles.Content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.Title}>{step.title}</Text>
          <Text style={styles.Desc}>{step.desc}</Text>
          <QuestionList
            questions={step.questions}
            selectedId={selectedValue}
            onSelect={onSelect}
          />
        </ScrollView>

        <ButtonTray trayStyle={styles.BottomTray}>
          <Button label="Continue" onPress={onContinue} />
        </ButtonTray>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  Title: { fontWeight: "700", marginTop: 15, fontSize: 22 },
  Desc: {
    marginTop: 0,
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
  },
  SafeArea: { marginHorizontal: 15, flex: 1 },
  ContentScroll: {
    flex: 1,
  },
  Content: {
    rowGap: 12,
    paddingBottom: 12,
  },
  BottomTray: {
    paddingBottom: 30,
  },
  ProgressShell: {
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  ProgressBar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  Header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: "white",
  },
  HeaderTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
});

export default QuestionScreen;
