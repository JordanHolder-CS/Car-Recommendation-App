import Screen from "../ui/Layout/screen.js";
import { useState } from "react";
import QuestionList from "../Lists/QuestionListing.js";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import Button from "../ui/Navigation/ContinueButton.js";
import { ButtonTray } from "../ui/Navigation/ContinueButton.js";
import { QPages } from "../Data (Temp)/QuestionPages.js";

export const QuestionScreen = ({}) => {
  const steps = QPages;

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const step = steps[stepIndex];
  const selectedId = answers[step.key] ?? null;

  const onSelect = (optionIdOrNull) => {
    setAnswers((prev) => ({ ...prev, [step.key]: optionIdOrNull ?? null }));
  };

  const onContinue = () => {
    if (!selectedId) return;
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
    else {
    }
  };
  return (
    <Screen>
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
});
export default QuestionScreen;
