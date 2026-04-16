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
          {horsepower ? (
            <Text
              style={[
                styles.CoolStatsText,
                isExpandedResultVariant && styles.ExpandedResultCoolStatsText,
                styleOverrides.coolStatsText,
              ]}
            >
              <Icons icon="speed" size="12" /> {horsepower} hp
            </Text>
          ) : null}
          {isEV && evRange ? (
            <Text
              style={[
                styles.CoolStatsText,
                isExpandedResultVariant && styles.ExpandedResultCoolStatsText,
                styleOverrides.coolStatsText,
              ]}
            >
              <Icons icon="battery-charging-full" size="12" /> {evRange} mi
            </Text>
          ) : mpg ? (
            <Text
              style={[
                styles.CoolStatsText,
                isExpandedResultVariant && styles.ExpandedResultCoolStatsText,
                styleOverrides.coolStatsText,
              ]}
            >
              <Icons icon="local-gas-station" size="12" /> {mpg} MPG
            </Text>
          ) : null}
          {transmission ? (
            <Text
              style={[
                styles.CoolStatsText,
                isExpandedResultVariant && styles.ExpandedResultCoolStatsText,
                styleOverrides.coolStatsText,
              ]}
            >
              <Icons icon="tune" size="12" /> {transmission}
            </Text>
          ) : null}
          {seats ? (
            <Text
              style={[
                styles.CoolStatsText,
                isExpandedResultVariant && styles.ExpandedResultCoolStatsText,
                styleOverrides.coolStatsText,
              ]}
            >
              <Icons icon="airline-seat-recline-extra" size="12" /> {seats}{" "}
              seats
            </Text>
          ) : null}
          {zeroToSixty ? (
            <Text
              style={[
                styles.CoolStatsText,
                isExpandedResultVariant && styles.ExpandedResultCoolStatsText,
                styleOverrides.coolStatsText,
              ]}
            >
              <Icons icon="timer" size="12" /> 0-60 {zeroToSixty}s
            </Text>
          ) : null}
          {topSpeed ? (
            <Text
              style={[
                styles.CoolStatsText,
                isExpandedResultVariant && styles.ExpandedResultCoolStatsText,
                styleOverrides.coolStatsText,
              ]}
            >
              <Icons icon="rocket-launch" size="12" /> {topSpeed} mph
            </Text>
          ) : null}
          {torque ? (
            <Text
              style={[
                styles.CoolStatsText,
                isExpandedResultVariant && styles.ExpandedResultCoolStatsText,
                styleOverrides.coolStatsText,
              ]}
            >
              <Icons icon="build" size="12" /> {torque} Nm
            </Text>
          ) : null}
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
    color: "#FFFFFF",
    textAlign: "right",
    flexShrink: 0,
  },
  PriceText: {
    paddingTop: 4,
    fontWeight: "500",
    fontSize: 18,
    color: "#007BFF",
  },
  SectionTitle: {
    fontWeight: "600",
    color: "#111827",
    fontSize: 17,
  },
  ProTitle: {
    fontWeight: "600",
    color: "#25CB00",
    fontSize: 17,
  },
  Bullet: {
    color: "#25CB00",
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
  },
  CoolStatsText: {
    color: "#777777",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 6,
    textAlign: "center",
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
  },
  ExpandedResultPriceText: {
    paddingTop: 6,
    fontSize: 20,
    color: "#0057D9",
  },
  ExpandedResultCoolStatsText: {
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
