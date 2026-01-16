import { StyleSheet, ScrollView } from "react-native";
import QuestionItem from "./QuestionItem";

const QuestionList = ({ Questions: question }) => {
  return (
    <ScrollView>
      {question.map((question) => (
        <QuestionItem key={question.id} question={question} />
      ))}
    </ScrollView>
  );
};

export default QuestionList;
