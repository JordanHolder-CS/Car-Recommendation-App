import { View } from "react-native";
import RecommendationItem from "./RecommendationItem";

const RecommendationList = ({ cars, onSelect = () => {} }) => {
  return (
    <View>
      {cars.map((car, index) => (
        <RecommendationItem
          key={car.listKey ?? `${car.car_id ?? "car"}-${index}`}
          car={car}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
};

export default RecommendationList;
