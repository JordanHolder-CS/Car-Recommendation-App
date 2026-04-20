import { StyleSheet, View, ImageBackground, Text } from "react-native";
import Animated from "react-native-reanimated";
import Icons from "../Icons/Icons";

export const RecommendationContent = ({
  name,
  brand,
  image,
  price,
  horsepower,
  mpg,
  engine,
  drivetrain,
  transmission,
  seats,
  zeroToSixty,
  topSpeed,
  torque,
  bodyStyle,
  isEV,
  evRange,
  score,
  matchScore,
  useCase,
  intent,
  profileLabel,
  primaryDriverType,
  topReasons = [],
  children,
  onViewDetails = () => {},
  actionLabel = "View Details",
  fullScreen = false,
  detailsAnimatedStyle,
  variant = "default",
  styleOverrides = {},
}) => {
  const isExpandedResultVariant = variant === "expandedResult";

  const formatPrice = (value) =>
    value
      ? `\u00A3${Number(value).toLocaleString("en-GB")}`
      : "Price unavailable";

  const matchPercent =
    typeof matchScore === "number"
      ? `${Math.round(matchScore * 100)}% match`
      : typeof score === "number"
        ? `${Math.round(score * 100)}% match`
        : null;

  const vehicleBrand = brand || "";
  const vehicleName = name || "Vehicle unavailable";
  const statChipStyle = [
    styles.CoolStatsChip,
    isExpandedResultVariant && styles.ExpandedResultCoolStatsChip,
    styleOverrides.coolStatsText,
  ];
  const flattenedStatChipStyle = StyleSheet.flatten(statChipStyle) || {};
  const statTextColor = flattenedStatChipStyle.color || styles.CoolStatsValue.color;
  const statItems = [
    horsepower
      ? { key: "horsepower", icon: "speed", label: `${horsepower} hp` }
      : null,
    isEV && evRange
      ? { key: "range", icon: "battery-charging-full", label: `${evRange} mi` }
      : mpg
        ? { key: "mpg", icon: "local-gas-station", label: `${mpg} MPG` }
        : null,
    transmission
      ? { key: "transmission", icon: "tune", label: transmission }
      : null,
    seats
      ? { key: "seats", icon: "airline-seat-recline-extra", label: `${seats} seats` }
      : null,
    zeroToSixty
      ? { key: "zeroToSixty", icon: "timer", label: `0-60 ${zeroToSixty}s` }
      : null,
    topSpeed
      ? { key: "topSpeed", icon: "rocket-launch", label: `${topSpeed} mph` }
      : null,
    torque ? { key: "torque", icon: "build", label: `${torque} Nm` } : null,
  ].filter(Boolean);

  return (
    <View
      style={[
        styles.Container,
        fullScreen && styles.FullScreenContainer,
        isExpandedResultVariant && styles.ExpandedResultContainer,
        styleOverrides.container,
      ]}
    >
      <View style={[styles.HeroWrap, styleOverrides.heroWrap]}>
        <ImageBackground
          style={[
            styles.HeroCard,
            fullScreen && styles.FullScreenHeroCard,
            isExpandedResultVariant && styles.ExpandedResultHeroCard,
            styleOverrides.heroCard,
          ]}
          imageStyle={[
            styles.HeroImage,
            fullScreen && styles.FullScreenHeroImage,
            isExpandedResultVariant && styles.ExpandedResultHeroImage,
            styleOverrides.heroImage,
          ]}
          source={{
            uri:
              image ||
              "https://hips.hearstapps.com/hmg-prod/images/2024-mercedes-amg-gt63-643-66b52543c907c.jpg?crop=0.683xw:0.511xh;0.0976xw,0.409xh&resize=1200:*",
          }}
        >
          <View style={[styles.HeroOverlay, styleOverrides.heroOverlay]}>
            <View style={styles.HeroBottom}>
              {vehicleBrand ? (
                <Text
                  style={[styles.HeroBrandText, styleOverrides.heroBrandText]}
                >
                  {vehicleBrand}
                </Text>
              ) : null}
              <View style={styles.HeroTitleRow}>
                <Text
                  style={[styles.HeroNameText, styleOverrides.heroNameText]}
                >
                  {vehicleName}
                </Text>
                {matchPercent ? (
                  <Text
                    style={[
                      styles.HeroMatchText,
                      isExpandedResultVariant &&
                        styles.ExpandedResultHeroMatchText,
                      styleOverrides.heroMatchText,
                    ]}
                  >
                    {matchPercent}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
      <Animated.View
        style={[
          styles.TextWrapper,
          fullScreen && styles.FullScreenTextWrapper,
          isExpandedResultVariant && styles.ExpandedResultTextWrapper,
          styleOverrides.textWrapper,
          detailsAnimatedStyle,
        ]}
      >
        <Text
          style={[
            styles.PriceText,
            isExpandedResultVariant && styles.ExpandedResultPriceText,
            styleOverrides.priceText,
          ]}
        >
          {formatPrice(price)}
        </Text>

        <View
          style={[styles.CoolStatsContainer, styleOverrides.coolStatsContainer]}
        >
          {statItems.map((item) => (
            <View key={item.key} style={statChipStyle}>
              <Icons icon={item.icon} size="12" />
              <Text style={[styles.CoolStatsValue, { color: statTextColor }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={[styles.Section, styleOverrides.section]}>
          <Text style={[styles.ProTitle, styleOverrides.proTitle]}>
            <Icons icon="thumb-up" size="10" style="Pro" /> Why it matches
          </Text>
          {topReasons.length ? (
            topReasons.map((reason) => (
              <View
                style={[styles.Item, styleOverrides.item]}
                key={`${name}-${reason}`}
              >
                <Text style={[styles.Bullet, styleOverrides.bullet]}>-</Text>
                <Text style={[styles.ItemText, styleOverrides.itemText]}>
                  {reason}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.MetaText, styleOverrides.metaText]}>
              Balanced fit across your selected priorities.
            </Text>
          )}
        </View>

        <View style={[styles.Section, styleOverrides.section]}>
          <Text style={[styles.SectionTitle, styleOverrides.sectionTitle]}>
            Key details
          </Text>
          <Text style={[styles.MetaText, styleOverrides.metaText]}>
            Engine: {engine || "N/A"}
            {"\n"}
            Drivetrain: {drivetrain || "N/A"}
            {"\n"}
            Body style: {bodyStyle || "N/A"}
            {"\n"}
            Top speed: {topSpeed || "N/A"}
            {"\n"}
            Torque: {torque || "N/A"}
          </Text>
        </View>

        {children}

        {/* <ButtonTray
          trayStyle={[styles.BottomTray, fullScreen && styles.FullScreenBottomTray]}
        >
          <Button label={actionLabel} onPress={onViewDetails} />
        </ButtonTray> */}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  TextWrapper: {
    padding: 9,
  },
  HeroWrap: {
    alignItems: "center",
    overflow: "hidden",
  },
  HeroCard: {
    minHeight: 180,
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#1f2937",
  },
  HeroImage: {
    borderRadius: 18,
  },
  HeroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 14,
    backgroundColor: "rgba(10, 14, 20, 0.42)",
  },
  HeroBottom: {
    alignItems: "flex-start",
    width: "100%",
  },
  HeroTitleRow: {
    marginTop: 2,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  HeroBrandText: {
    maxWidth: "88%",
    fontSize: 16,
    lineHeight: 19,
    color: "rgba(255, 255, 255, 0.82)",
    fontWeight: "300",
  },
  HeroNameText: {
    flex: 1,
    fontSize: 27,
    lineHeight: 31,
    color: "#ffffff",
    fontWeight: "300",
  },
  HeroMatchText: {
    marginTop: 7,
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 22,
    color: "#2dda6c",
    textAlign: "right",
    flexShrink: 0,
  },
  PriceText: {
    fontWeight: "500",
    fontSize: 20,
    color: "#111827",
  },
  SectionTitle: {
    fontWeight: "600",
    color: "#111827",
    fontSize: 17,
  },
  ProTitle: {
    fontWeight: "600",
    color: "#111827",
    fontSize: 17,
  },
  Bullet: {
    color: "#16A34A",
    fontSize: 20,
    lineHeight: 20,
    marginRight: 6,
  },
  Item: {
    flexDirection: "row",
    paddingLeft: 2,
    marginTop: 7,
    alignItems: "flex-start",
  },
  ItemText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  MetaText: {
    marginTop: 6,
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
  },
  Container: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 16,
    backgroundColor: "#F4F4F4",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    padding: 5,
    marginVertical: 7,
    flexDirection: "column",
    gap: 7,
  },
  FullScreenContainer: {
    flex: 1,
    marginVertical: 0,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: "transparent",
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
    padding: 0,
  },
  ExpandedResultContainer: {
    backgroundColor: "#F4F4F4",
  },
  CoolStatsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 10,
    marginBottom: 4,
  },
  CoolStatsChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  CoolStatsValue: {
    color: "#777777",
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 4,
    includeFontPadding: false,
  },
  Section: {
    paddingBottom: 8,
  },
  FullScreenHeroCard: {
    minHeight: 210,
    borderRadius: 0,
  },
  FullScreenHeroImage: {
    borderRadius: 0,
  },
  ExpandedResultHeroCard: {
    minHeight: 236,
  },
  ExpandedResultHeroImage: {
    opacity: 0.96,
  },
  FullScreenTextWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  ExpandedResultTextWrapper: {
    paddingTop: 18,
    paddingBottom: 20,
  },
  ExpandedResultHeroMatchText: {
    fontSize: 20,
    lineHeight: 22,
    color: "#16A34A",
  },
  ExpandedResultPriceText: {
    paddingTop: 6,
    fontSize: 22,
    color: "#111827",
  },
  ExpandedResultCoolStatsChip: {
    backgroundColor: "#E8EEF6",
    color: "#334155",
    borderRadius: 999,
  },
  BottomTray: {
    marginTop: 8,
  },
  FullScreenBottomTray: {
    marginTop: "auto",
    paddingTop: 12,
  },
});

export default RecommendationContent;
