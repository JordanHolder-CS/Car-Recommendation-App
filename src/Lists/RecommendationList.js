import { StyleSheet, View } from "react-native";
import QuestionItem from "./QuestionItem";
import RecommendationItem from "./RecommendationItem";

const RecommendationList = ({ cars }) => {
  return (
    <View>
      {cars.map((car) => (
        <RecommendationItem key={car.car_id} car={car} />
      ))}
    </View>
  );
};

export default RecommendationList;
