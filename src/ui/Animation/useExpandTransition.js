import { useCallback, useEffect, useRef } from "react";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const OPEN_SPRING = {
  damping: 20,
  stiffness: 180,
  mass: 0.9,
};

const CLOSE_TIMING = {
  duration: 220,
  easing: Easing.out(Easing.cubic),
};

export const useExpandTransition = ({ onCloseComplete = () => {} } = {}) => {
  const progress = useSharedValue(0);
  const isClosingRef = useRef(false);
  const pendingActionRef = useRef(null);

  useEffect(() => {
    progress.value = withSpring(1, OPEN_SPRING);
  }, [progress]);

  const finishClose = useCallback(() => {
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    isClosingRef.current = false;
    onCloseComplete(action);
  }, [onCloseComplete]);

  const close = useCallback(
    (action = null) => {
      if (isClosingRef.current) {
        return;
      }

      isClosingRef.current = true;
      pendingActionRef.current = action;
      progress.value = withTiming(0, CLOSE_TIMING, (finished) => {
        if (finished) {
          runOnJS(finishClose)();
        }
      });
    },
    [finishClose, progress],
  );

  const cardStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    borderRadius: interpolate(progress.value, [0, 1], [18, 0]),
    shadowOpacity: interpolate(progress.value, [0, 1], [0.18, 0.04]),
    shadowRadius: interpolate(progress.value, [0, 1], [18, 4]),
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [18, 0]),
      },
      {
        scale: interpolate(progress.value, [0, 1], [0.96, 1]),
      },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.35, 1], [0, 0.5, 1]),
  }));

  const detailsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.55, 1], [0, 0, 1]),
  }));

  const backButtonStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.7, 1], [0, 0, 1]),
  }));

  return {
    close,
    isClosingRef,
    cardStyle,
    contentStyle,
    detailsStyle,
    backButtonStyle,
  };
};

export default useExpandTransition;
