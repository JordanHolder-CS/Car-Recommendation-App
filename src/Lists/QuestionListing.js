import { StyleSheet, View } from "react-native";
import QuestionItem from "./QuestionItem";

const QuestionList = ({ questions, selectedId, onSelect, value, onChange }) => {
  const currentValue = value ?? selectedId ?? null;
  const handleChange = onChange ?? onSelect;
  const isBrandGrid = questions.every(
    (question) => question.type === "brand_tile",
  );

  return (
    <View style={isBrandGrid ? styles.Grid : styles.List}>
      {questions.map((question) => (
        <View
          key={question.id}
          style={isBrandGrid ? styles.GridItem : styles.ListItem}
        >
          <QuestionItem
            question={question}
            id={question.id}
            value={currentValue}
            onChange={handleChange}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  List: {
    width: "100%",
  },
  ListItem: {
    width: "100%",
  },
  Grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  GridItem: {
    width: "48%",
  },
});

export default QuestionList;
