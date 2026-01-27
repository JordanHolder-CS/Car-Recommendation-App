import { StyleSheet, View, Image, ScrollView, Text } from "react-native";
import Icons from "../Icons/Icons";

export const RecommendationContent = ({}) => {
  return (
    <View style={styles.Container}>
      <View style={styles.HeaderWrapper}>
        <Image
          style={styles.ImageHeader}
          source={{
            uri: "https://toyotagazooracing.com/pages/contents/jp/gr/assets/img/supra/gt4/pic_hdg_pc.jpg",
          }}
        />
      </View>
      <View style={styles.TextWrapper}>
        <Text style={styles.NameText}>Toyota Supra</Text>
        <Text style={styles.PriceText}>£20,000</Text>
        <View style={styles.CoolStatsContainer}>
          <Text style={styles.CoolStatsText}>
            <Icons icon="speed" /> 382 HP
          </Text>
          <Text style={styles.CoolStatsText}>
            <Icons icon="local-gas-station" /> 25 MPG
          </Text>
          <Text style={styles.CoolStatsText}>
            <Icons icon="settings" /> 3.0L I6 Turbo
          </Text>
          <Text style={styles.CoolStatsText}>
            <Icons icon="directions-car" /> RWD
          </Text>
          <Text style={styles.CoolStatsText}>
            <Icons icon="tune" /> 8-Speed Auto
          </Text>
          <Text style={styles.CoolStatsText}>
            <Icons icon="airline-seat-recline-extra" /> 2+2 Seats
          </Text>
        </View>
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
    width: 390,
    borderRadius: 12,
  },
  NameText: { fontWeight: "700", fontSize: 20 },
  PriceText: {
    paddingTop: 4,
    fontWeight: "500",
    fontSize: 18,
    color: "#007BFF",
  },
  Container: {
    height: 500,
    borderWidth: 1,
    borderColor: "#2452ae",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 5,
    marginVertical: 7,
    flexDirection: "column",
    //alignItems: "center",
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
    paddingRight: 7,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
});

export default RecommendationContent;
