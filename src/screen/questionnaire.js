import Screen from "../ui/Layout/screen.js";
import { useState } from "react";
import QuestionList from "../Lists/QuestionListing.js";
import { ScrollView, Text, StyleSheet, View } from "react-native";
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
  const selectedId = answers[step.key] ?? null;

  const onSelect = (optionIdOrNull) => {
    setAnswers((prev) => ({ ...prev, [step.key]: optionIdOrNull ?? null }));
  };

  const goToResultScreen = () => navigation.navigate("ResultScreen");

  const onBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };
  const onContinue = () => {
    if (!selectedId) return;
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
    else {
      navigation.navigate("ResultScreen");
    }
  };
  return (
    <Screen>
      <SafeAreaView style={styles.Header} edges={["top"]}>
        <BackButton onBack={onBack} />
        <Text style={styles.HeaderTitle}>Questionnaire</Text>
        <View style={{ width: 44 }} />
      </SafeAreaView>
      <ProgressBar
        progress={stepIndex / steps.length}
        color="#3B82F6"
        style={styles.ProgressBar}
      />
      <View style={styles.SafeArea}>
        <View style={styles.Content}>
          <Text style={styles.Title}>{step.title}</Text>
          <Text style={styles.Desc}>{step.desc}</Text>
          <QuestionList
            questions={step.questions}
            selectedId={selectedId}
            onSelect={onSelect}
          />
          {/* <QButton></QButton> */}
        </View>

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
  },
  SafeArea: { marginHorizontal: 20, flex: 1 },
  Content: { rowGap: 12, paddingBottom: 12, flex: 1 },
  BottomTray: {
    paddingBottom: 30,
    backgroundColor: "white",
  },
  ProgressBar: {
    height: 6,
    marginBottom: 10,
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
});

export default QuestionScreen;
