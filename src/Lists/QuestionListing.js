import { View } from "react-native";
import QuestionItem from "./QuestionItem";

const QuestionList = ({ questions, selectedId, onSelect, value, onChange }) => {
  const currentValue = value ?? selectedId ?? null;
  const handleChange = onChange ?? onSelect;

  return (
    <View>
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          id={question.id}
          value={currentValue}
          onChange={handleChange}
        />
      ))}
    </View>
  );
};

export default QuestionList;
