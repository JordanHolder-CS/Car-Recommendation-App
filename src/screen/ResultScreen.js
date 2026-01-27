import Screen from "../ui/Layout/screen.js";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import Button from "../ui/Navigation/ContinueButton.js";
import BackButton from "../ui/Navigation/BackButton.js";
import { ButtonTray } from "../ui/Navigation/ContinueButton.js";
import { SafeAreaView } from "react-native-safe-area-context";
import RecommendationContent from "../ui/RecommendationCard/Content.js";

export const ResultScreen = ({ navigation }) => {
  const onBack = () => {
    navigation.goBack();
  };
  return (
    <Screen>
      <SafeAreaView style={styles.Header} edges={["top"]}>
        <BackButton onBack={onBack} />
        <Text style={styles.HeaderTitle}>Top 3 Matches</Text>
        <View style={{ width: 44 }} />
      </SafeAreaView>
      <RecommendationContent />
    </Screen>
  );
};

const styles = StyleSheet.create({
  SafeArea: { marginHorizontal: 20, flex: 1 },
  Content: { rowGap: 12, paddingBottom: 12, flex: 1 },
  BottomTray: {
    paddingBottom: 30,
    backgroundColor: "white",
  },
  Header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  HeaderTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
});

export default ResultScreen;
