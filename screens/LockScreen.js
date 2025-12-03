import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";
import colors from "../theme/colors";
import darkColors from "../theme/darkColors";

export default function LockScreen({ navigation }) {
  const [checking, setChecking] = useState(true);
  const [authFailed, setAuthFailed] = useState(false);
  const dark = false; // integrate later
  const theme = dark ? darkColors : colors;

  useEffect(() => {
    authenticate();
  }, []);

  async function authenticate() {
    setChecking(true);

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !enrolled) {
      alert("Biometric authentication not available on this device.");
      navigation.replace("Home");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock Sapphire Ledger",
      fallbackLabel: "Use PIN",
      disableDeviceFallback: false,
    });

    if (result.success) {
      navigation.replace("Home");
    } else {
      setAuthFailed(true);
    }

    setChecking(false);
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Blurred Background */}
      <Image
        source={require("../assets/lock_bg.jpg")}
        style={{ position: "absolute", width: "100%", height: "100%" }}
        blurRadius={12}
      />

      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

      {/* Content */}
      <View className="flex-1 justify-center items-center px-10">

        {/* Fingerprint Animation */}
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 600 }}
          className="items-center"
        >
          <Image
            source={require("../assets/fingerprint.png")}
            style={{ width: 90, height: 90, tintColor: "#fff" }}
          />

          <Text className="mt-6 text-center text-white text-2xl font-semibold">
            Unlock Sapphire Ledger
          </Text>

          <Text className="mt-2 text-center text-white/70">
            Use your fingerprint or face to continue
          </Text>
        </MotiView>

        {/* Auth Status */}
        {checking && (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 30 }} />
        )}

        {authFailed && (
          <Text className="mt-4 text-red-400 font-medium text-center">
            Authentication failed. Try again.
          </Text>
        )}

        {/* Try Again Button */}
        <TouchableOpacity
          onPress={authenticate}
          className="mt-8 bg-white/20 px-8 py-3 rounded-full"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>

        {/* Pattern Lock Fallback */}
        <TouchableOpacity
          onPress={() => navigation.navigate("PatternLock")}
          className="mt-4"
        >
          <Text className="text-white/80 underline">Use Pattern Lock Instead</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
