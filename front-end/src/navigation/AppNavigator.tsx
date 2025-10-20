import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import Login from "../screens/Login";
import Home from "../screens/Home";
import ScannerScreen from "../screens/Scanner";
import Perfil from "../screens/Perfil";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="Profile" component={Perfil} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
