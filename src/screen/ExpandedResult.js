import { useCallback, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import ExpandedContent from "../ui/RecommendationCard/expandedContent";
import BackButton from "../ui/Navigation/BackButton";
import useExpandTransition from "../ui/Animation/useExpandTransition";

const ExpandedResult = ({ navigation, route }) => {
  const selectedCar = route?.params?.selectedCar || null;

  const handleCloseComplete = useCallback(
    (action) => {
      navigation.dispatch(action ?? CommonActions.goBack());
    },
    [navigation],
  );

  const {
    close,
    isClosingRef,
    cardStyle,
    contentStyle,
    detailsStyle,
    backButtonStyle,
  } = useExpandTransition({ onCloseComplete: handleCloseComplete });

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (event) => {
      if (isClosingRef.current) {
        return;
      }

      event.preventDefault();
      close(event.data.action);
    });

    return unsubscribe;
  }, [close, isClosingRef, navigation]);

  if (!selectedCar) {
    return <View style={styles.Screen} />;
  }

  return (
    <View style={styles.Screen}>
      <Animated.View style={[styles.ExpandedCard, cardStyle]}>
        <Animated.View style={[styles.ExpandedContent, contentStyle]}>
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <ExpandedContent
              selectedCar={selectedCar}
              detailsAnimatedStyle={detailsStyle}
            />
          </ScrollView>
        </Animated.View>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.BackButtonWrap, backButtonStyle]}
        >
          <SafeAreaView edges={["top"]} style={styles.BackButtonSafeArea}>
            <View style={styles.BackButtonChip}>
              <BackButton onBack={() => close()} />
            </View>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: "transparent",
  },
  ExpandedCard: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  ExpandedContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  BackButtonWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  BackButtonSafeArea: {
    alignItems: "flex-start",
    paddingHorizontal: 8,
  },
  BackButtonChip: {
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});

export default ExpandedResult;
