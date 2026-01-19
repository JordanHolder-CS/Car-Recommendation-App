import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screen/Home";
import QuestionScreen from "./src/screen/Questionnaire";

const Stack = createNativeStackNavigator();

export const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Questionnaire"
        // screenOptions={{
        //   headerStyle: { backgroundColor: "black" },
        //   headerTintColor: "white",
        // }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="Questionnaire"
          component={QuestionScreen}
          options={{ title: "Questionnaire" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
