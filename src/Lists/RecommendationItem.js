import { StyleSheet, Text, View } from "react-native";
import RecommendationContent from "../ui/RecommendationCard/Content";

const RecommendationItem = ({ Name, Model, Brand, Image }) => {
  return (
    <View>
      <RecommendationContent
        Name={Name}
        Model={Model}
        Brand={Brand}
        Image={Image}
      />
    </View>
  );
};

export default RecommendationItem;
