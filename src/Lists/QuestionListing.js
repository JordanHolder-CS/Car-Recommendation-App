import { StyleSheet, View } from "react-native";
import { useState } from "react";
import QuestionItem from "./QuestionItem";

const QuestionList = ({ Questions: question }) => {
  const [selectedId, setSelectedId] = useState(null);
  return (
    <View>
      {question.map((question, index) => (
        <QuestionItem
          key={question.id}
          question={question}
          id={String(index)}
          selectedId={selectedId}
          onPress={setSelectedId}
        />
      ))}
    </View>
  );
};

export default QuestionList;
