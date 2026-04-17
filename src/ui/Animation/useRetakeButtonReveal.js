import { useState } from "react";
import { FadeInDown } from "react-native-reanimated";

const RETAKE_BUTTON_SCROLL_OFFSET = 260;
const RETAKE_BUTTON_ENTERING = FadeInDown.duration(220);

export const useRetakeButtonReveal = () => {
  const [showRetakeButton, setShowRetakeButton] = useState(false);

  const resetRetakeButton = () => {
    setShowRetakeButton(false);
  };

  const handleResultsScroll = (event) => {
    const scrollOffsetY = event?.nativeEvent?.contentOffset?.y ?? 0;

    setShowRetakeButton(
      (currentValue) =>
        currentValue || scrollOffsetY > RETAKE_BUTTON_SCROLL_OFFSET,
    );
  };

  return {
    showRetakeButton,
    resetRetakeButton,
    handleResultsScroll,
    retakeButtonEntering: RETAKE_BUTTON_ENTERING,
  };
};

export default useRetakeButtonReveal;
