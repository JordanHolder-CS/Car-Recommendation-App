import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

export const Screen = ({ children }) => {
  return (
    <View style={[styles.screen]}>
      <StatusBar hidden></StatusBar>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
});

export default Screen;
