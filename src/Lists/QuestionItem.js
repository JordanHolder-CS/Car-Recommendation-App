import { StyleSheet, Text, View } from "react-native";
import QButton from "../ui/QuestionCard/QButton";

const QuestionItem = ({ question, id, selectedId, onPress }) => {
  return (
    <View>
      <QButton
        Title={question.QuestionTitle}
        Description={question.QuestionDescription}
        id={id}
        selectedId={selectedId}
        onPress={onPress}
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
