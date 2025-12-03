import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as LocalAuthentication from "expo-local-authentication";
import { StatusBar } from "expo-status-bar";

const Tab = createBottomTabNavigator();

/* ----------------------------- BIOMETRIC SCREEN ---------------------------- */

function LockScreen({ onUnlock }) {
  async function unlock() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (hasHardware && supportedTypes.length > 0) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock Sapphire Ledger"
      });

      if (result.success) {
        onUnlock();
      }
    }
  }

  useEffect(() => {
    unlock();
  }, []);

  return (
    <View className="flex-1 bg-[#1A1132] items-center justify-center">
      <Text className="text-white text-2xl mb-4">Sapphire Ledger</Text>
      <TouchableOpacity
        onPress={unlock}
        className="bg-white/20 px-6 py-3 rounded-xl"
      >
        <Text className="text-white text-lg">Tap to Unlock</Text>
      </TouchableOpacity>
    </View>
  );
}

/* -------------------------------- HOME SCREEN ------------------------------ */

function HomeScreen() {
  const [expenses, setExpenses] = useState([
    { id: "1", title: "Food", amount: 200 },
    { id: "2", title: "Transport", amount: 120 },
    { id: "3", title: "Shopping", amount: 450 }
  ]);

  const date = new Date();
  const greeting =
    date.getHours() < 12
      ? "Good Morning"
      : date.getHours() < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-semibold">{greeting}, Guest 👋</Text>

      <Text className="text-lg mt-4 font-semibold">Your Expenses</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-3 mt-2 bg-gray-100 rounded-xl">
            <Text className="text-lg">{item.title}</Text>
            <Text className="text-gray-600">₹{item.amount}</Text>
          </View>
        )}
      />
    </View>
  );
}

/* ----------------------------- CALENDAR SCREEN ----------------------------- */

function CalendarScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg">Calendar Feature Coming Soon…</Text>
    </View>
  );
}

/* ------------------------------ SETTINGS SCREEN ---------------------------- */

function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg">Settings</Text>
    </View>
  );
}

/* ------------------------------- MAIN APP --------------------------------- */

export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />

      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#1A1132",
            borderTopWidth: 0
          },
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: "#B8AFFF"
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
