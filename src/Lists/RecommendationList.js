import { View } from "react-native";
import RecommendationItem from "./RecommendationItem";

const RecommendationList = ({ cars, onSelect = () => {} }) => {
  return (
    <View>
      {cars.map((car) => (
        <RecommendationItem key={car.car_id} car={car} onSelect={onSelect} />
      ))}
    </View>
  );
};

export default RecommendationList;
