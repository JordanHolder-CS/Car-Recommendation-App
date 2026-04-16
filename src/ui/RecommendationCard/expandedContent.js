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
  const recommendationStyleOverrides = {
    container: styles.RecommendationContainer,
    heroWrap: styles.RecommendationHeroWrap,
    heroCard: styles.RecommendationHeroCard,
    heroImage: styles.RecommendationHeroImage,
    heroOverlay: styles.RecommendationHeroOverlay,
    textWrapper: styles.RecommendationTextWrapper,
    matchText: styles.RecommendationMatchText,
    profileText: styles.RecommendationProfileText,
    typeText: styles.RecommendationTypeText,
    priceText: styles.RecommendationPriceText,
    coolStatsContainer: styles.RecommendationStatsWrap,
    coolStatsText: styles.RecommendationStatChip,
  };

  return (
    <View style={[styles.ExpandedContent]}>
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
        variant="expandedResult"
        styleOverrides={recommendationStyleOverrides}
        detailsAnimatedStyle={detailsAnimatedStyle}
      >
        {recommendationBreakdown.length ? (
          <View style={styles.Section}>
            <Text style={styles.SectionTitle}>Recommendation breakdown</Text>
            {recommendationBreakdown.map((metric) => (
              <View
                style={styles.MetricRow}
                key={`${selectedCar.car_id}-${metric.label}`}
              >
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
    </View>
  );
};

const styles = StyleSheet.create({
  ExpandedContent: {
    padding: 12,
  },
  RecommendationContainer: {
    borderRadius: 20,
  },
  RecommendationHeroWrap: {},
  RecommendationHeroCard: {
    minHeight: 236,
    borderRadius: 16,
  },
  RecommendationHeroImage: {
    opacity: 0.96,
    borderRadius: 16,
  },
  RecommendationTextWrapper: {
    paddingTop: 18,
    paddingBottom: 20,
  },
  RecommendationMatchText: {
    color: "#0F766E",
    fontSize: 14,
  },
  RecommendationProfileText: {
    fontSize: 14,
  },
  RecommendationTypeText: {
    fontSize: 12,
    lineHeight: 18,
  },
  RecommendationPriceText: {
    paddingTop: 6,
    fontSize: 20,
    color: "#0057D9",
  },
  RecommendationStatsWrap: {
    paddingTop: 12,
  },
  RecommendationStatChip: {
    backgroundColor: "#E8EEF6",
    color: "#334155",
    borderRadius: 999,
  },
  Section: {
    paddingBottom: 16,
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
