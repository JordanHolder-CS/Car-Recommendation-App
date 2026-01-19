import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
const Selector = ({ children, onPress, style, pressedStyle }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };
  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [style, pressed && pressedStyle]}
    >
      {children}
    </Pressable>
  );
};

export default Selector;
