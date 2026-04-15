import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const PREVIEW_RADIUS = 12;
const EXPANDED_RADIUS = 0;
const ANIMATION_DURATION = 280;
const CLOSE_DURATION = 220;

export const useMapScreenTransition = ({
  originRect = null,
  onCloseComplete = () => {},
} = {}) => {
  const transition = useRef(new Animated.Value(0)).current;
  const closeProgress = useRef(new Animated.Value(0)).current;
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    Animated.timing(transition, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [transition]);

  const closeMap = () => {
    if (isClosing) {
      return;
    }

    setIsClosing(true);

    Animated.timing(closeProgress, {
      toValue: 1,
      duration: CLOSE_DURATION,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onCloseComplete();
      }
    });
  };

  const startX = originRect?.x ?? 16;
  const startY = originRect?.y ?? 180;
  const startWidth = originRect?.width ?? SCREEN_WIDTH - 32;
  const startHeight = originRect?.height ?? 140;

  const animatedMapStyle = {
    left: transition.interpolate({
      inputRange: [0, 1],
      outputRange: [startX, 0],
    }),
    top: transition.interpolate({
      inputRange: [0, 1],
      outputRange: [startY, 0],
    }),
    width: transition.interpolate({
      inputRange: [0, 1],
      outputRange: [startWidth, SCREEN_WIDTH],
    }),
    height: transition.interpolate({
      inputRange: [0, 1],
      outputRange: [startHeight, SCREEN_HEIGHT],
    }),
    borderRadius: transition.interpolate({
      inputRange: [0, 1],
      outputRange: [PREVIEW_RADIUS, EXPANDED_RADIUS],
    }),
    opacity: closeProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: [
      {
        scale: closeProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.985],
        }),
      },
    ],
  };

  const animatedBackdropStyle = {
    opacity: isClosing
      ? 1
      : transition.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
  };

  const animatedCardStyle = {
    opacity: Animated.multiply(
      transition.interpolate({
        inputRange: [0, 0.7, 1],
        outputRange: [0, 0, 1],
      }),
      closeProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    ),
    transform: [
      {
        translateY: Animated.add(
          transition.interpolate({
            inputRange: [0, 1],
            outputRange: [24, 0],
          }),
          closeProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 16],
          }),
        ),
      },
    ],
  };

  return {
    animatedMapStyle,
    animatedBackdropStyle,
    animatedCardStyle,
    closeMap,
  };
};

export default useMapScreenTransition;
