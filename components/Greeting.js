import React from "react";
import { View, Text, Image } from "react-native";
import { getGreeting } from "../utils/greeting";
import colors from "../theme/colors";
import darkColors from "../theme/darkColors";

export default function Greeting({ user, dark }) {
  const name = user?.name || "Guest";
  const pic = user?.picture;

  const theme = dark ? darkColors : colors;

  return (
    <View className="flex-row items-center mt-6 px-4 py-3 rounded-2xl"
      style={{ backgroundColor: theme.surface }}>
      
      <Image
        source={{
          uri: pic || "https://ui-avatars.com/api/?name=" + name
        }}
        className="w-12 h-12 rounded-full mr-3"
      />

      <View>
        <Text className="text-lg font-semibold" style={{ color: theme.text }}>
          {getGreeting(name)}
        </Text>
        <Text className="text-sm opacity-70" style={{ color: theme.textSecondary }}>
          Track your money smartly
        </Text>
      </View>
    </View>
  );
}
