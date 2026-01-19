import { StyleSheet, View } from "react-native";
import QuestionItem from "./QuestionItem";

const QuestionList = ({ questions, selectedId, onSelect }) => {
  return (
    <View>
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          id={question.id}
          selectedId={selectedId}
          onPress={onSelect}
        />
      ))}
    </View>
  );
};

export default QuestionList;
