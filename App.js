import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ResultScreen from "./src/screen/ResultScreen";
import QuestionScreen from "./src/screen/questionnaire";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import BackButton from "./src/ui/Navigation/BackButton";

const Stack = createNativeStackNavigator();

export const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ResultScreen"
        // screenOptions={{
        //   headerStyle: { backgroundColor: "black" },
        //   headerTintColor: "white",
        // }}
      >
        <Stack.Screen
          name="ResultScreen"
          component={ResultScreen}
          options={{ title: "Result", headerShown: false }}
        />
        <Stack.Screen
          name="Questionnaire"
          component={QuestionScreen}
          options={{
            title: "Questionnaire",
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
