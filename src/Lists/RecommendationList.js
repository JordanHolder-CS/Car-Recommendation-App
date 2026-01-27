import { StyleSheet, View } from "react-native";
import QuestionItem from "./QuestionItem";
import RecommendationItem from "./RecommendationItem";

const RecommendationList = ({ cars }) => {
  return (
    <View>
      {cars.map((car) => (
        <RecommendationItem
          Name={car.Name}
          Model={car.Model}
          Brand={car.Brand}
          Image={car.Image}
        />
      ))}
    </View>
  );
};

export default RecommendationList;
