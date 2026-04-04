import RecommendationContent from "./collapsedContent";

const ExpandedContent = ({ selectedCar, detailsAnimatedStyle }) => {
  if (!selectedCar) {
    return null;
  }

  return (
    <RecommendationContent
      name={selectedCar.car_name}
      brand={selectedCar.brand_name}
      image={selectedCar.image_url}
      price={selectedCar.price}
      horsepower={selectedCar.horsepower}
      mpg={selectedCar.combined_mpg || selectedCar.epa_combined}
      engine={selectedCar.standard_engine}
      drivetrain={selectedCar.drivetrain}
      transmission={selectedCar.transmission}
      seats={selectedCar.max_seating_capacity || selectedCar.seat_count}
      zeroToSixty={selectedCar.zero_to_sixty_mph}
      topSpeed={selectedCar.top_speed}
      torque={selectedCar.torque}
      bodyStyle={selectedCar.body_style}
      isEV={selectedCar.is_ev}
      evRange={selectedCar.ev_range || selectedCar.estimated_electric_range}
      reliability={selectedCar.reliability}
      serviceCost={selectedCar.service_cost}
      insuranceEstimate={selectedCar.insurance_estimate}
      score={selectedCar.score}
      matchScore={selectedCar.matchScore}
      useCase={selectedCar.useCase}
      intent={selectedCar.intent}
      profileLabel={selectedCar.profileLabel}
      primaryDriverType={selectedCar.primaryDriverType}
      topReasons={selectedCar.topReasons}
      fullScreen
      detailsAnimatedStyle={detailsAnimatedStyle}
    />
  );
};

export default ExpandedContent;
