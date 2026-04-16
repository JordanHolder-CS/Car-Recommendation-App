import { useCallback, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { CommonActions, StackActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated from "react-native-reanimated";
import ExpandedContent from "../ui/RecommendationCard/expandedContent";
import BackButton from "../ui/Navigation/BackButton";
import Button from "../ui/Navigation/ContinueButton";
import { ButtonTray } from "../ui/Navigation/ContinueButton";
import useExpandTransition from "../ui/Animation/useExpandTransition";

const ExpandedResult = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const selectedCar = route?.params?.selectedCar || null;
  const recommendedCars = Array.isArray(route?.params?.recommendedCars)
    ? route.params.recommendedCars
    : [];

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

  const onFindDealers = () => {
    close(
      StackActions.replace("DealerScreen", {
        selectedCar,
        recommendedCars,
      }),
    );
  };

  const onCompare = () => {
    close(
      StackActions.replace("CompareScreen", {
        selectedCar,
        recommendedCars,
      }),
    );
  };

  return (
    <View style={styles.Screen}>
      <Animated.View style={[styles.ExpandedCard, cardStyle, styles.ExpandedCardFlat]}>
        <Animated.View style={[styles.ExpandedContent, contentStyle]}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={[
              styles.ScrollContent,
              { paddingBottom: insets.bottom + 112 },
            ]}
          >
            <ExpandedContent
              selectedCar={selectedCar}
              detailsAnimatedStyle={detailsStyle}
            />
          </ScrollView>
        </Animated.View>
        <View
          style={[
            styles.BottomBar,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <ButtonTray trayStyle={styles.ActionTray}>
            <Button label="Compare" onPress={onCompare} />
            <Button label="Find dealers" onPress={onFindDealers} />
          </ButtonTray>
        </View>
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.BackButtonWrap,
            {
              top: insets.top + 8,
              left: 12,
            },
            backButtonStyle,
          ]}
        >
          <View style={styles.BackButtonChip}>
            <BackButton onBack={() => close()} />
          </View>
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
  ExpandedCardFlat: {
    borderRadius: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  ExpandedContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  ScrollContent: {
    paddingBottom: 0,
  },
  BackButtonWrap: {
    position: "absolute",
    zIndex: 3,
  },
  BackButtonChip: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.42)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  BottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "rgba(255, 255, 255, 0.82)",
    borderTopWidth: 1,
    borderTopColor: "rgba(229, 231, 235, 0.8)",
  },
  ActionTray: {
    gap: 12,
  },
});

export default ExpandedResult;
