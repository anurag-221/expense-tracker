import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import BottomTabs from "./BottomTabs";
import * as SecureStore from "expo-secure-store";

export default function AppNavigator() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await SecureStore.getItemAsync("user");
      if (data) setUser(JSON.parse(data));
    })();
  }, []);

  return (
    <NavigationContainer>
      {user ? <BottomTabs user={user} /> : <AuthNavigator setUser={setUser} />}
    </NavigationContainer>
  );
}
