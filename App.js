import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ResultScreen from "./src/screen/ResultScreen";
import ExpandedResult from "./src/screen/ExpandedResult";
import CompareScreen from "./src/screen/CompareScreen";
import QuestionScreen from "./src/screen/questionnaire";
import BookingScreen from "./src/screen/BookingScreen.js";
import DealerScreen from "./src/screen/DealerScreen.js";
import { MapScreen } from "./src/screen/MapScreen.js";
import ExpandedDealerScreen from "./src/screen/ExpandedDealer.js";
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
          name="ResultScreen"
          component={ResultScreen}
          options={{ title: "Result", headerShown: false }}
        />
        <Stack.Screen
          name="ExpandedResult"
          component={ExpandedResult}
          options={{
            title: "Expanded Result",
            headerShown: false,
            animation: "none",
            presentation: "transparentModal",
            contentStyle: { backgroundColor: "transparent" },
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Questionnaire"
          component={QuestionScreen}
          options={{
            title: "Questionnaire",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CompareScreen"
          component={CompareScreen}
          options={{
            title: "Compare cars",
            headerShown: false,
            presentation: "card",
            contentStyle: { backgroundColor: "#ffffff" },
          }}
        />
        <Stack.Screen
          name="DealerScreen"
          component={DealerScreen}
          options={{
            title: "Dealership",
            headerShown: false,
            presentation: "card",
            contentStyle: { backgroundColor: "#ffffff" },
          }}
        />
        <Stack.Screen
          name="ExpandedDealer"
          component={ExpandedDealerScreen}
          options={{
            title: "Dealer",
            headerShown: false,
            presentation: "card",
            contentStyle: { backgroundColor: "#ffffff" },
          }}
        />
        <Stack.Screen
          name="BookingScreen"
          component={BookingScreen}
          options={{
            title: "Book a test drive",
            headerShown: false,
            presentation: "card",
            contentStyle: { backgroundColor: "#ffffff" },
          }}
        />
        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{
            title: "Map",
            headerShown: false,
            presentation: "card",
            contentStyle: { backgroundColor: "#ffffff" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
