import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { Ionicons } from "@expo/vector-icons";
import { googleLogin } from "../services/auth";

export default function GoogleLoginScreen({ setUser }) {
  async function handleLogin() {
    const user = await googleLogin();
    if (user) setUser(user);
  }

  return (
    <LinearGradient colors={["#7B61FF", "#5A3FFF"]} className="flex-1 justify-center items-center px-8">

      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 700 }}
        className="items-center"
      >
        <Image
          source={require("../assets/logo.png")}
          className="w-28 h-28 mb-6"
        />

        <Text className="text-white text-3xl font-bold mb-2">
          Sapphire Ledger
        </Text>

        <Text className="text-white/80 text-base text-center mb-8">
          Your personal finance companion
        </Text>

        <TouchableOpacity
          onPress={handleLogin}
          className="w-full bg-white py-3 rounded-full flex-row items-center justify-center shadow-lg"
        >
          <Ionicons name="logo-google" size={22} color="#000" />
          <Text className="ml-3 text-black font-semibold text-lg">
            Continue with Google
          </Text>
        </TouchableOpacity>
      </MotiView>

    </LinearGradient>
  );
}
