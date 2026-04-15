import { useRef, useState } from "react";
import { Animated, Dimensions, Easing } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAP_PREVIEW_RADIUS = 12;
const MAP_FULLSCREEN_RADIUS = 0;
const MAP_ANIMATION_DURATION = 480;
const MAP_CARD_FADE_DURATION = 110;
const MAP_OPEN_CARD_DELAY = 170;
const MAP_CLOSE_EASING = Easing.bezier(0.22, 1, 0.36, 1);

export const useMapOverlayTransition = () => {
  const [mapOriginRect, setMapOriginRect] = useState(null);
  const [isMapOverlayVisible, setIsMapOverlayVisible] = useState(false);
  const [isMapClosing, setIsMapClosing] = useState(false);
  const mapTransition = useRef(new Animated.Value(0)).current;
  const cardTransition = useRef(new Animated.Value(0)).current;

  const openMapOverlay = (originRect) => {
    if (isMapOverlayVisible || !originRect) {
      return;
    }

    setMapOriginRect(originRect);
    setIsMapOverlayVisible(true);
    setIsMapClosing(false);
    mapTransition.setValue(0);
    cardTransition.setValue(0);

    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(mapTransition, {
          toValue: 1,
          duration: MAP_ANIMATION_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.delay(MAP_OPEN_CARD_DELAY),
          Animated.timing(cardTransition, {
            toValue: 1,
            duration: MAP_CARD_FADE_DURATION,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  };

  const closeMapOverlay = () => {
    if (isMapClosing) {
      return;
    }

    setIsMapClosing(true);

    Animated.sequence([
      Animated.timing(cardTransition, {
        toValue: 0,
        duration: MAP_CARD_FADE_DURATION,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(mapTransition, {
        toValue: 0,
        duration: MAP_ANIMATION_DURATION,
        easing: MAP_CLOSE_EASING,
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      if (!finished) {
        return;
      }

      setIsMapOverlayVisible(false);
      setMapOriginRect(null);
      setIsMapClosing(false);
    });
  };

  const startX = mapOriginRect?.x ?? 16;
  const startY = mapOriginRect?.y ?? 180;
  const startWidth = mapOriginRect?.width ?? SCREEN_WIDTH - 32;
  const startHeight = mapOriginRect?.height ?? 140;

  const animatedBackdropStyle = {
    opacity: mapTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  const animatedMapStyle = {
    left: mapTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [startX, 0],
    }),
    top: mapTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [startY, 0],
    }),
    width: mapTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [startWidth, SCREEN_WIDTH],
    }),
    height: mapTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [startHeight, SCREEN_HEIGHT],
    }),
    borderRadius: mapTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [MAP_PREVIEW_RADIUS, MAP_FULLSCREEN_RADIUS],
    }),
    opacity: isMapClosing
      ? mapTransition.interpolate({
          inputRange: [0, 0.16, 0.26, 1],
          outputRange: [0, 0, 1, 1],
        })
      : 1,
  };

  const animatedCardStyle = {
    opacity: cardTransition,
    transform: [
      {
        translateY: cardTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  };

  return {
    mapOriginRect,
    isMapOverlayVisible,
    animatedBackdropStyle,
    animatedMapStyle,
    animatedCardStyle,
    openMapOverlay,
    closeMapOverlay,
  };
};

export default useMapOverlayTransition;
