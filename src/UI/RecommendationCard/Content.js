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
            <Icons icon="speed" size="12" /> 382 HP
          </Text>
          <Text style={styles.CoolStatsText}>
            <Icons icon="local-gas-station" size="12" /> 25 MPG
          </Text>
          <Text style={styles.CoolStatsText}>
            <Icons icon="settings" size="12" /> 3.0L I6 Turbo
          </Text>
          <Text style={styles.CoolStatsText}>
            <Icons icon="directions-car" size="12" /> RWD
          </Text>
          <Text style={styles.CoolStatsText}>
            <Icons icon="tune" size="12" /> 8-Speed Auto
          </Text>
          <Text style={styles.CoolStatsText}>
            <Icons icon="airline-seat-recline-extra" size="12" /> 2+2 Seats
          </Text>
        </View>
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
  Pro: { fontWeight: "500", color: "#25cb00", fontSize: 14 },
  ProBullet: { color: "#25cb00", fontSize: 22, lineHeight: 22, marginRight: 5 },
  Item: {
    flexDirection: "row",
    paddingLeft: 2,
    marginTop: 2,
    alignItems: "flex-start",
  },
  ItemText: { fontSize: 14, lineHeight: 22, flex: 1 },
  ConBullet: { color: "#d50000", fontSize: 22, lineHeight: 22, marginRight: 5 },
  Con: { fontWeight: "500", color: "#d50000", fontSize: 14 },
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
