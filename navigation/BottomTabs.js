import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, TouchableOpacity } from "react-native";
import { MotiView } from "moti";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import AddEntryScreen from "../screens/AddEntryScreen";
import SummaryScreen from "../screens/SummaryScreen";
import MonthlyScreen from "../screens/MonthlyScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs({ user }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 90, backgroundColor: "transparent", position: "absolute" }
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home">{() => <HomeScreen user={user} />}</Tab.Screen>

      <Tab.Screen name="Summary" component={SummaryScreen} />
      
      <Tab.Screen name="AddEntry" component={AddEntryScreen} />

      <Tab.Screen name="Monthly" component={MonthlyScreen} />

      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View className="absolute bottom-4 mx-4 left-0 right-0">
      <BlurView intensity={60} tint="light" className="rounded-full p-3 shadow-xl">

        <View className="flex-row justify-between px-4">
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;

            const ICONS = {
              Home: "home-outline",
              Summary: "pie-chart-outline",
              AddEntry: "add-circle-outline",
              Monthly: "calendar-outline",
              Settings: "settings-outline"
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                className="flex-1 items-center"
              >
                <MotiView
                  animate={{
                    scale: isFocused ? 1.2 : 1,
                    opacity: isFocused ? 1 : 0.6,
                  }}
                >
                  <Ionicons
                    name={ICONS[route.name]}
                    size={isFocused ? 28 : 24}
                    color={isFocused ? "#7B61FF" : "#555"}
                  />
                </MotiView>
              </TouchableOpacity>
            );
          })}
        </View>
        
      </BlurView>
    </View>
  );
}
