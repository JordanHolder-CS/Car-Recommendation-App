import Screen from "../ui/Layout/screen.js";
import Q1 from "../Data (Temp)/Questions.js";
import QuestionList from "../Lists/QuestionListing.js";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { View } from "react-native";

export const QuestionScreen = ({}) => {
  return (
    <Screen>
      <View style={[styles.SafeArea, styles.Gap]}>
        <Text style={styles.Title}>How will you mostly drive?</Text>
        <Text style={styles.Desc}>
          This helps to understand the fuel effiency that will be required
        </Text>
        <QuestionList Questions={Q1} />
        {/* <QButton></QButton> */}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  Title: { fontWeight: "700" },
  Desc: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 11,
  },
  SafeArea: { marginHorizontal: 20 },
  Gap: { rowGap: 12 },
});
export default QuestionScreen;
