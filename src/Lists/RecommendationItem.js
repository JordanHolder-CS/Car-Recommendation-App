import { StyleSheet, Text, View } from "react-native";
import RecommendationContent from "../ui/RecommendationCard/Content";

const RecommendationItem = ({ car }) => {
  return (
    <View>
      <RecommendationContent
        name={car.car_name}
        brand={car.brand_name}
        image={car.image_url}
        price={car.price}
        horsepower={car.horsepower}
        mpg={car.combined_mpg || car.epa_combined}
        engine={car.standard_engine}
        drivetrain={car.drivetrain}
        transmission={car.transmission}
        seats={car.max_seating_capacity || car.seat_count}
        zeroToSixty={car.zero_to_sixty_mph}
        topSpeed={car.top_speed}
        torque={car.torque}
        bodyStyle={car.body_style}
        isEV={car.is_ev}
        evRange={car.ev_range || car.estimated_electric_range}
        reliability={car.reliability}
        serviceCost={car.service_cost}
        insuranceEstimate={car.insurance_estimate}
        score={car.score}
        primaryDriverType={car.primaryDriverType}
        topReasons={car.topReasons}
      />
    </View>
  );
};

export default RecommendationItem;
