import { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";
import RecommendationContent from "./collapsedContent";

const MAX_BREAKDOWN_ITEMS = 6;

const buildRecommendationBreakdown = (selectedCar) =>
  Array.isArray(selectedCar?.recommendationBreakdown)
    ? selectedCar.recommendationBreakdown
        .slice(0, MAX_BREAKDOWN_ITEMS)
        .map((metric) => ({
          label: metric.label,
          score: `${Math.max(0, Math.min(100, Math.round(metric.fitScore || 0)))}/100`,
          note: metric.note,
        }))
    : [];

const ExpandedContent = ({
  selectedCar,
  detailsAnimatedStyle,
  recommendationStyleOverrides = {},
  breakdownStyleOverrides = {},
}) => {
  if (!selectedCar) {
    return null;
  }

  const recommendationBreakdown = buildRecommendationBreakdown(selectedCar);
  const defaultRecommendationStyleOverrides = {
    container: styles.RecommendationContainer,
    heroWrap: styles.RecommendationHeroWrap,
    heroCard: styles.RecommendationHeroCard,
    heroImage: styles.RecommendationHeroImage,
    heroOverlay: styles.RecommendationHeroOverlay,
    heroMatchText: styles.RecommendationHeroMatchText,
    textWrapper: styles.RecommendationTextWrapper,
    matchText: styles.RecommendationMatchText,
    profileText: styles.RecommendationProfileText,
    typeText: styles.RecommendationTypeText,
    priceText: styles.RecommendationPriceText,
    coolStatsContainer: styles.RecommendationStatsWrap,
    coolStatsText: styles.RecommendationStatChip,
  };
  const mergedRecommendationStyleOverrides = {
    ...defaultRecommendationStyleOverrides,
    ...recommendationStyleOverrides,
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
        score={selectedCar.score}
        matchScore={selectedCar.matchScore}
        useCase={selectedCar.useCase}
        intent={selectedCar.intent}
        profileLabel={selectedCar.profileLabel}
        primaryDriverType={selectedCar.primaryDriverType}
        topReasons={selectedCar.topReasons}
        fullScreen
        variant="expandedResult"
        styleOverrides={mergedRecommendationStyleOverrides}
        detailsAnimatedStyle={detailsAnimatedStyle}
      >
        {recommendationBreakdown.length ? (
          <View style={[styles.Section, breakdownStyleOverrides.section]}>
            <Text
              style={[
                styles.SectionTitle,
                breakdownStyleOverrides.sectionTitle,
              ]}
            >
              Recommendation breakdown
            </Text>
            {recommendationBreakdown.map((metric, index) => {
              const isLast = index === recommendationBreakdown.length - 1;

              return (
                <Fragment key={`${selectedCar.car_id}-${metric.label}`}>
                  <View
                    style={[
                      styles.MetricRow,
                      breakdownStyleOverrides.metricRow,
                    ]}
                  >
                    <View
                      style={[
                        styles.MetricTextWrap,
                        breakdownStyleOverrides.metricTextWrap,
                      ]}
                    >
                      <Text
                        style={[
                          styles.MetricLabel,
                          breakdownStyleOverrides.metricLabel,
                        ]}
                      >
                        {metric.label}
                      </Text>
                      {metric.note ? (
                        <Text
                          style={[
                            styles.MetricNote,
                            breakdownStyleOverrides.metricNote,
                          ]}
                        >
                          {metric.note}
                        </Text>
                      ) : null}
                    </View>
                    <Text
                      style={[
                        styles.MetricScore,
                        breakdownStyleOverrides.metricScore,
                      ]}
                    >
                      {metric.score}
                    </Text>
                  </View>
                  {!isLast ? <View style={styles.MetricDivider} /> : null}
                </Fragment>
              );
            })}
          </View>
        ) : null}
      </RecommendationContent>
    </View>
  );
};

const styles = StyleSheet.create({
  ExpandedContent: {
    padding: 0,
  },
  RecommendationContainer: {
    borderRadius: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  RecommendationHeroWrap: {},
  RecommendationHeroCard: {
    minHeight: 236,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  RecommendationHeroImage: {
    opacity: 0.96,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  RecommendationTextWrapper: {
    paddingTop: 18,
    paddingBottom: 20,
  },
  RecommendationHeroMatchText: {
    fontSize: 20,
    lineHeight: 22,
    color: "#FFFFFF",
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
    fontSize: 17,
  },
  MetricRow: {
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 4,
    paddingVertical: 14,
  },
  MetricDivider: {
    height: 1,
    marginLeft: 4,
    marginRight: 10,
    backgroundColor: "#E5E7EB",
    opacity: 0.9,
  },
  MetricTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  MetricLabel: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  MetricNote: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: "#6B7280",
  },
  MetricScore: {
    fontSize: 13,
    color: "#0F766E",
    fontWeight: "700",
    paddingTop: 1,
    paddingLeft: 12,
  },
});

export default ExpandedContent;
