import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GoogleLoginScreen from "../screens/GoogleLoginScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator({ setUser }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GoogleLogin">
        {() => <GoogleLoginScreen setUser={setUser} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
