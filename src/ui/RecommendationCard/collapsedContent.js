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
  reliability,
  serviceCost,
  insuranceEstimate,
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
}) => {
  const formatPrice = (value) =>
    value
      ? `\u00A3${Number(value).toLocaleString("en-GB")}`
      : "Price unavailable";

  const formatCost = (value) =>
    value ? `\u00A3${Number(value).toLocaleString("en-GB")}` : "N/A";

  const matchPercent =
    typeof matchScore === "number"
      ? `${Math.round(matchScore * 100)}% match`
      : typeof score === "number"
        ? `${Math.round(score * 100)}% match`
        : null;

  const profileMeta =
    useCase || intent
      ? [
          useCase ? `Use case: ${useCase.replace(/_/g, " ")}` : null,
          intent ? `Intent: ${intent.replace(/_/g, " ")}` : null,
        ]
          .filter(Boolean)
          .join(" | ")
      : primaryDriverType
        ? primaryDriverType.replace(/_/g, " ")
        : null;

  const vehicleBrand = brand || "";
  const vehicleName = name || "Vehicle unavailable";

  return (
    <View style={[styles.Container, fullScreen && styles.FullScreenContainer]}>
      <View style={styles.HeroWrap}>
        <ImageBackground
          style={[styles.HeroCard, fullScreen && styles.FullScreenHeroCard]}
          imageStyle={[styles.HeroImage, fullScreen && styles.FullScreenHeroImage]}
          source={{
            uri:
              image ||
              "https://hips.hearstapps.com/hmg-prod/images/2024-mercedes-amg-gt63-643-66b52543c907c.jpg?crop=0.683xw:0.511xh;0.0976xw,0.409xh&resize=1200:*",
          }}
        >
          <View style={styles.HeroOverlay}>
            <View style={styles.HeroBottom}>
              {vehicleBrand ? (
                <Text style={styles.HeroBrandText}>{vehicleBrand}</Text>
              ) : null}
              <Text style={styles.HeroNameText}>{vehicleName}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
      <Animated.View
        style={[
          styles.TextWrapper,
          fullScreen && styles.FullScreenTextWrapper,
          detailsAnimatedStyle,
        ]}
      >
        {matchPercent ? (
          <Text style={styles.MatchText}>{matchPercent}</Text>
        ) : null}
        {profileLabel ? (
          <Text style={styles.ProfileText}>{profileLabel}</Text>
        ) : null}
        {profileMeta ? (
          <Text style={styles.TypeText}>{profileMeta}</Text>
        ) : null}
        <Text style={styles.PriceText}>{formatPrice(price)}</Text>

        <View style={styles.CoolStatsContainer}>
          {horsepower ? (
            <Text style={styles.CoolStatsText}>
              <Icons icon="speed" size="12" /> {horsepower} hp
            </Text>
          ) : null}
          {isEV && evRange ? (
            <Text style={styles.CoolStatsText}>
              <Icons icon="battery-charging-full" size="12" /> {evRange} mi
            </Text>
          ) : mpg ? (
            <Text style={styles.CoolStatsText}>
              <Icons icon="local-gas-station" size="12" /> {mpg} MPG
            </Text>
          ) : null}
          {transmission ? (
            <Text style={styles.CoolStatsText}>
              <Icons icon="tune" size="12" /> {transmission}
            </Text>
          ) : null}
          {seats ? (
            <Text style={styles.CoolStatsText}>
              <Icons icon="airline-seat-recline-extra" size="12" /> {seats}{" "}
              seats
            </Text>
          ) : null}
          {zeroToSixty ? (
            <Text style={styles.CoolStatsText}>
              <Icons icon="timer" size="12" /> 0-60 {zeroToSixty}s
            </Text>
          ) : null}
          {topSpeed ? (
            <Text style={styles.CoolStatsText}>
              <Icons icon="rocket-launch" size="12" /> {topSpeed} mph
            </Text>
          ) : null}
          {torque ? (
            <Text style={styles.CoolStatsText}>
              <Icons icon="build" size="12" /> {torque} Nm
            </Text>
          ) : null}
        </View>

        <View style={styles.Section}>
          <Text style={styles.ProTitle}>
            <Icons icon="thumb-up" size="10" style="Pro" /> Why it matches
          </Text>
          {topReasons.length ? (
            topReasons.map((reason) => (
              <View style={styles.Item} key={`${name}-${reason}`}>
                <Text style={styles.Bullet}>-</Text>
                <Text style={styles.ItemText}>{reason}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.MetaText}>
              Balanced fit across your selected priorities.
            </Text>
          )}
        </View>

        <View style={styles.Section}>
          <Text style={styles.SectionTitle}>Key details</Text>
          <Text style={styles.MetaText}>
            Engine: {engine || "N/A"}
            {"\n"}
            Drivetrain: {drivetrain || "N/A"}
            {"\n"}
            Body style: {bodyStyle || "N/A"}
            {"\n"}
            Top speed: {topSpeed || "N/A"}
            {"\n"}
            Torque: {torque || "N/A"}
            {"\n"}
            Reliability: {reliability || "N/A"}
          </Text>
        </View>

        {children}

        <View style={styles.Section}>
          <Text style={styles.SectionTitle}>Running costs</Text>
          <Text style={styles.MetaText}>
            Service: {formatCost(serviceCost)}
            {"\n"}
            Insurance: {formatCost(insuranceEstimate)}
          </Text>
        </View>

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
  },
  HeroBrandText: {
    maxWidth: "88%",
    fontSize: 16,
    lineHeight: 19,
    color: "rgba(255, 255, 255, 0.82)",
    fontWeight: "300",
  },
  HeroNameText: {
    marginTop: 2,
    maxWidth: "88%",
    fontSize: 23,
    lineHeight: 27,
    color: "#ffffff",
    fontWeight: "300",
  },
  MatchText: {
    marginTop: 2,
    fontWeight: "700",
    fontSize: 13,
    color: "#0F766E",
  },
  ProfileText: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  TypeText: {
    marginTop: 2,
    fontSize: 11,
    color: "#6B7280",
    textTransform: "capitalize",
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
    fontSize: 14,
  },
  ProTitle: {
    fontWeight: "600",
    color: "#25CB00",
    fontSize: 14,
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
    backgroundColor: "#FFFFFF",
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
    padding: 0,
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
  FullScreenTextWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
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
