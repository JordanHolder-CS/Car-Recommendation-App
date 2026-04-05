import { StyleSheet, Text, View } from "react-native";
import RecommendationContent from "./collapsedContent";

const MAX_BREAKDOWN_ITEMS = 6;

const buildRecommendationBreakdown = (selectedCar) =>
  Array.isArray(selectedCar?.recommendationBreakdown)
    ? selectedCar.recommendationBreakdown
        .slice(0, MAX_BREAKDOWN_ITEMS)
        .map((metric) => ({
          label: metric.priority ? `${metric.label} (priority)` : metric.label,
          score: `${Math.max(0, Math.min(100, Math.round(metric.fitScore || 0)))}/100`,
          note: metric.note,
        }))
    : [];

const ExpandedContent = ({ selectedCar, detailsAnimatedStyle }) => {
  if (!selectedCar) {
    return null;
  }

  const recommendationBreakdown = buildRecommendationBreakdown(selectedCar);

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
    >
      {recommendationBreakdown.length ? (
        <View style={styles.Section}>
          <Text style={styles.SectionTitle}>Recommendation breakdown</Text>
          {recommendationBreakdown.map((metric) => (
            <View style={styles.MetricRow} key={`${selectedCar.car_id}-${metric.label}`}>
              <View style={styles.MetricTextWrap}>
                <Text style={styles.MetricLabel}>{metric.label}</Text>
                {metric.note ? (
                  <Text style={styles.MetricNote}>{metric.note}</Text>
                ) : null}
              </View>
              <Text style={styles.MetricScore}>{metric.score}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </RecommendationContent>
  );
};

const styles = StyleSheet.create({
  Section: {
    paddingBottom: 8,
  },
  SectionTitle: {
    fontWeight: "600",
    color: "#111827",
    fontSize: 14,
  },
  MetricRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  MetricTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  MetricLabel: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "500",
  },
  MetricNote: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    color: "#6B7280",
  },
  MetricScore: {
    fontSize: 13,
    color: "#0F766E",
    fontWeight: "700",
    paddingTop: 1,
  },
});

export default ExpandedContent;
