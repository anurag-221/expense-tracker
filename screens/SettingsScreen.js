import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, Image } from "react-native";
import colors from "../theme/colors";
import darkColors from "../theme/darkColors";
import * as SecureStore from "expo-secure-store";
import { uploadToDrive, downloadFromDrive } from "../services/googleDrive";
import { loadTransactions, saveTransactions } from "../services/localStorage";
import * as FileSystem from "expo-file-system";

export default function SettingsScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [pattern, setPattern] = useState(false);
  const [spendLimit, setSpendLimit] = useState(30000);

  const theme = dark ? darkColors : colors;

  useEffect(() => {
    async function loadUser() {
      const data = await SecureStore.getItemAsync("user");
      if (data) setUser(JSON.parse(data));
    }
    loadUser();
  }, []);

  async function backupData() {
    const token = user?.token;
    const data = await loadTransactions();
    await uploadToDrive(token, data);
    alert("Backup uploaded to Google Drive!");
  }

  async function restoreData() {
    const token = user?.token;
    const data = await downloadFromDrive(token);
    if (data) {
      await saveTransactions(data);
      alert("Data restored successfully!");
    } else {
      alert("No backup file found!");
    }
  }

  async function exportExcel() {
    const data = await loadTransactions();
    const fileUri = FileSystem.documentDirectory + "export.json";
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data));
    alert("Excel Export (JSON for now) created at: " + fileUri);
  }

  return (
    <ScrollView
      className="flex-1 px-4"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      {/* Profile */}
      {user && (
        <View className="flex-row items-center mt-6 mb-5">
          <Image
            source={{ uri: user.picture }}
            className="w-14 h-14 rounded-full"
          />
          <View className="ml-3">
            <Text className="text-xl font-bold" style={{ color: theme.text }}>
              {user.name}
            </Text>
            <Text className="text-gray-500">{user.email}</Text>
          </View>
        </View>
      )}

      {/* Appearance */}
      <Text className="text-lg font-semibold mb-3 mt-4" style={{ color: theme.text }}>
        Appearance
      </Text>

      <View
        className="rounded-2xl mb-4"
        style={{ backgroundColor: theme.surface }}
      >
        <View className="flex-row justify-between p-4 border-b border-gray-200/40">
          <Text className="text-base" style={{ color: theme.text }}>
            Dark Mode
          </Text>
          <Switch value={dark} onValueChange={setDark} thumbColor={theme.primary} />
        </View>
      </View>

      {/* Security */}
      <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>
        Security
      </Text>

      <View className="rounded-2xl mb-4" style={{ backgroundColor: theme.surface }}>
        {/* Biometric Toggle */}
        <View className="flex-row justify-between p-4 border-b border-gray-200/40">
          <Text className="text-base" style={{ color: theme.text }}>
            Biometric Lock
          </Text>
          <Switch value={biometric} onValueChange={setBiometric} thumbColor={theme.primary} />
        </View>

        {/* Pattern Lock */}
        <TouchableOpacity
          onPress={() => navigation.navigate("PatternLock")}
          className="flex-row justify-between p-4 border-b border-gray-200/40"
        >
          <Text className="text-base" style={{ color: theme.text }}>
            Pattern Lock
          </Text>
          <Text className="text-blue-600 font-medium">Set</Text>
        </TouchableOpacity>
      </View>

      {/* Spend Limit */}
      <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>
        Spend Limit
      </Text>

      <View className="rounded-2xl mb-4 p-4" style={{ backgroundColor: theme.surface }}>
        <Text className="text-base opacity-70" style={{ color: theme.textSecondary }}>
          Monthly Spend Limit
        </Text>
        <Text className="text-3xl font-bold mt-1" style={{ color: theme.primary }}>
          ₹ {spendLimit}
        </Text>
      </View>

      {/* Cloud Storage */}
      <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>
        Cloud Backup
      </Text>

      <View className="rounded-2xl mb-4" style={{ backgroundColor: theme.surface }}>
        <TouchableOpacity onPress={backupData} className="p-4 border-b border-gray-200/40">
          <Text className="text-base" style={{ color: theme.text }}>
            Backup to Google Drive
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={restoreData} className="p-4 border-b border-gray-200/40">
          <Text className="text-base" style={{ color: theme.text }}>
            Restore from Google Drive
          </Text>
        </TouchableOpacity>
      </View>

      {/* Export */}
      <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>
        Export
      </Text>

      <View className="rounded-2xl mb-4" style={{ backgroundColor: theme.surface }}>
        <TouchableOpacity onPress={exportExcel} className="p-4 border-b border-gray-200/40">
          <Text className="text-base" style={{ color: theme.text }}>
            Export to Excel
          </Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <Text className="text-lg font-semibold mb-3" style={{ color: theme.text }}>
        App Info
      </Text>

      <View className="rounded-2xl mb-10" style={{ backgroundColor: theme.surface }}>
        <View className="p-4 border-b border-gray-200/40">
          <Text className="text-base" style={{ color: theme.text }}>
            App Name: Sapphire Ledger
          </Text>
        </View>

        <View className="p-4">
          <Text className="text-base" style={{ color: theme.text }}>
            Version: 1.0.0
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
