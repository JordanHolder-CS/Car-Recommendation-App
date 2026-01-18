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

export default QuestionItem;
