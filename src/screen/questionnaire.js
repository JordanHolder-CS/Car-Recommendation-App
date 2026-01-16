import Screen from "../UI/Layout/screen.js";
import QButton from "../UI/QuestionCard/QButton.js";
import Q1 from "../Data (Temp)/Questions.js";
import QuestionList from "../Lists/QuestionListing.js";
import { useState } from "react";
import { Text } from "react-native";
import { StyleSheet, View } from "react-native";

export const QuestionScreen = ({}) => {
  return (
    <Screen>
      <QuestionList Questions={Q1} />
      {/* <QButton></QButton> */}
    </Screen>
  );
};

export default QuestionScreen;
