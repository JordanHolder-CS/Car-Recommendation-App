import { StyleSheet, View, Image, ScrollView, Text } from "react-native";
import Icons from "../Icons/Icons";
import Button, { ButtonTray } from "../Navigation/ContinueButton";

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
}) => {
  const formatPrice = (price) => {
    return price ? `£${Number(price).toLocaleString("en-GB")}` : "";
  };
  return (
    <View style={styles.Container}>
      <View style={styles.HeaderWrapper}>
        <Image
          style={styles.ImageHeader}
          source={{
            uri:
              image ||
              "https://hips.hearstapps.com/hmg-prod/images/2024-mercedes-amg-gt63-643-66b52543c907c.jpg?crop=0.683xw:0.511xh;0.0976xw,0.409xh&resize=1200:*",
          }}
        />
      </View>
      <View style={styles.TextWrapper}>
        <Text style={styles.NameText}>
          {brand} {name}
        </Text>
        <Text style={styles.PriceText}>{formatPrice(price)}</Text>
        <View style={styles.CoolStatsContainer}>
          {horsepower && (
            <Text style={styles.CoolStatsText}>
              <Icons icon="speed" size="12" /> {horsepower}
            </Text>
          )}
          {isEV && evRange ? (
            <Text style={styles.CoolStatsText}>
              <Icons icon="battery-charging-full" size="12" /> {evRange} mi
              range
            </Text>
          ) : mpg ? (
            <Text style={styles.CoolStatsText}>
              <Icons icon="local-gas-station" size="12" /> {mpg} MPG
            </Text>
          ) : null}
          {engine && (
            <Text style={styles.CoolStatsText}>
              <Icons icon="settings" size="12" /> {engine}
            </Text>
          )}
          {drivetrain && (
            <Text style={styles.CoolStatsText}>
              <Icons icon="directions-car" size="12" /> {drivetrain}
            </Text>
          )}
          {transmission && (
            <Text style={styles.CoolStatsText}>
              <Icons icon="tune" size="12" /> {transmission}
            </Text>
          )}
          {seats && (
            <Text style={styles.CoolStatsText}>
              <Icons icon="airline-seat-recline-extra" size="12" /> {seats}{" "}
              Seats
            </Text>
          )}
          {zeroToSixty && (
            <Text style={styles.CoolStatsText}>
              <Icons icon="timer" size="12" /> 0-60: {zeroToSixty}s
            </Text>
          )}
        </View>
        <View style={{ paddingBottom: 8 }}>
          <Text style={styles.Pro}>
            <Icons icon="thumb-up" size="10" style="Pro" /> Pros
          </Text>
          <View style={styles.Item}>
            <Text style={styles.ProBullet}>•</Text>
            <Text style={styles.ItemText}>
              Legendary inline-6 engine with smooth power delivery
            </Text>
          </View>
          <View style={styles.Item}>
            <Text style={styles.ProBullet}>•</Text>
            <Text style={styles.ItemText}>
              Sharp handling and excellent chassis balance
            </Text>
          </View>
          <View style={styles.Item}>
            <Text style={styles.ProBullet}>•</Text>
            <Text style={styles.ItemText}>
              Premium interior with modern tech features
            </Text>
          </View>
        </View>
        <View style={{ paddingBottom: 8 }}>
          <Text style={styles.Con}>
            <Icons icon="thumb-down" size="10" style="Con" /> Cons
          </Text>
          <View style={styles.Item}>
            <Text style={styles.ConBullet}>•</Text>
            <Text style={styles.ItemText}>
              Limited rear seat space and practicality
            </Text>
          </View>
          <View style={styles.Item}>
            <Text style={styles.ConBullet}>•</Text>
            <Text style={styles.ItemText}>
              Firm ride quality may be uncomfortable on rough roads
            </Text>
          </View>
          <View style={styles.Item}>
            <Text style={styles.ConBullet}>•</Text>
            <Text style={styles.ItemText}>
              Higher maintenance costs compared to mainstream cars
            </Text>
          </View>
        </View>
        <ButtonTray trayStyle={styles.BottomTray}>
          <Button label="View Details" />
        </ButtonTray>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Icon: { paddingRight: 53 },
  TextWrapper: {
    padding: 9,
  },
  HeaderWrapper: {
    // flexDirection: "column",
    alignItems: "center",
  },
  ImageHeader: {
    height: 120,
    width: "100%",
    borderRadius: 12,
  },
  NameText: { fontWeight: "700", fontSize: 20 },
  PriceText: {
    paddinTop: 4,
    fontWeight: "500",
    fontSize: 18,
    color: "#007BFF",
  },
  Pro: { fontWeight: "500", color: "#25cb00", fontSize: 14 },
  ProBullet: { color: "#25cb00", fontSize: 22, lineHeight: 22, marginRight: 5 },
  Item: {
    flexDirection: "row",
    paddingLeft: 2,
    marginTop: 7,
    alignItems: "flex-start",
  },
  ItemText: { fontSize: 14, lineHeight: 22, flex: 1 },
  ConBullet: { color: "#d50000", fontSize: 22, lineHeight: 22, marginRight: 5 },
  Con: { fontWeight: "500", color: "#d50000", fontSize: 14 },
  Container: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    padding: 5,
    marginVertical: 7,
    flexDirection: "column",
    gap: 7,
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
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    textAlign: "center",
  },
});

export default RecommendationContent;
