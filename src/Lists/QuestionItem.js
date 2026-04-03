import { View } from "react-native";
import QButton from "../ui/QuestionCard/QButton";
import QSlider from "../ui/QuestionCard/QSlider";

const QuestionItem = ({ question, id, value, onChange }) => {
  if (question.type === "slider") {
    return (
      <View>
        <QSlider
          id={id}
          Title={question.QuestionTitle}
          Description={question.QuestionDescription}
          value={value}
          min={question.min}
          max={question.max}
          step={question.step}
          format={question.format}
          suffix={question.suffix}
          minimumLabel={question.minimumLabel}
          maximumLabel={question.maximumLabel}
          onChange={onChange}
        />
      </View>
    );
  }

  return (
    <View>
      <QButton
        Title={question.QuestionTitle}
        Description={question.QuestionDescription}
        id={id}
        selectedId={value}
        onPress={onChange}
      ></QButton>
    </View>
  );
};

export default QuestionItem;
