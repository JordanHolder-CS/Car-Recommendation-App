import { StyleSheet, Text, View } from "react-native";
import QButton from "../UI/QuestionCard/QButton";

const QuestionItem = ({ question }) => {
  return (
    <View>
      <QButton
        Title={question.QuestionTitle}
        Description={question.QuestionDescription}
      ></QButton>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  faded: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
  },
});

export default QuestionItem;
