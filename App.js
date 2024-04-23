import MapScreen from "./src/screens/MapScreen/MapScreen";
import HistoryScreen from "./src/screens/HistoryScreen/HistoryScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Istoric" component={HistoryScreen} />
        <Tab.Screen name="Harta" component={MapScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
console.log("nice");
