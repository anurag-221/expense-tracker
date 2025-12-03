import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch } from "react-native";
import { Calendar } from "react-native-calendars";
import { MotiView } from "moti";
import colors from "../theme/colors";
import darkColors from "../theme/darkColors";

import {
  scheduleDailyNotification,
  scheduleCustomReminder,
} from "../services/notifications";

export default function NotificationsScreen() {
  const [dark] = useState(false);
  const theme = dark ? darkColors : colors;

  const [sipReminder, setSipReminder] = useState(false);
  const [rentReminder, setRentReminder] = useState(false);

  const [customTitle, setCustomTitle] = useState("");
  const [customDay, setCustomDay] = useState("");
  const [markedDates, setMarkedDates] = useState({});

  function toggleSIP(val) {
    setSipReminder(val);
    if (val) scheduleCustomReminder("SIP Reminder", "Your SIP is due today.", 5);
  }

  function toggleRent(val) {
    setRentReminder(val);
    if (val) scheduleCustomReminder("Rent Reminder", "Rent due today!", 1);
  }

  function addCustomReminder() {
    if (!customTitle || !customDay) return;

    scheduleCustomReminder(customTitle, "Reminder Alert", Number(customDay));

    setMarkedDates({
      ...markedDates,
      [`2025-01-${String(customDay).padStart(2, "0")}`]: { marked: true },
    });

    setCustomTitle("");
    setCustomDay("");
    alert("Custom Reminder Added!");
  }

  return (
    <ScrollView
      className="flex-1 px-4"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      {/* Header */}
      <Text className="text-3xl font-bold mt-6" style={{ color: theme.text }}>
        Reminders
      </Text>
      <Text className="text-gray-500">Manage all notification reminders</Text>

      {/* Calendar */}
      <View className="mt-5 p-3 rounded-3xl shadow" style={{ backgroundColor: theme.surface }}>
        <Calendar
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: theme.primary,
            todayTextColor: theme.accent,
            arrowColor: theme.primary,
            dotColor: theme.primary,
          }}
        />
      </View>

      {/* SYSTEM REMINDERS */}
      <Text className="text-xl font-semibold mt-6 mb-3" style={{ color: theme.text }}>
        Auto Reminders
      </Text>

      {/* SIP Reminder */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="rounded-2xl p-4 shadow mb-4"
        style={{ backgroundColor: theme.surface }}
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-medium" style={{ color: theme.text }}>SIP Reminder</Text>
          <Switch
            value={sipReminder}
            onValueChange={toggleSIP}
            thumbColor={theme.primary}
          />
        </View>
        <Text className="text-gray-500 mt-1">
          Notifies you every month on SIP date.
        </Text>
      </MotiView>

      {/* Rent Reminder */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 100 }}
        className="rounded-2xl p-4 shadow mb-4"
        style={{ backgroundColor: theme.surface }}
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-medium" style={{ color: theme.text }}>Rent Reminder</Text>
          <Switch
            value={rentReminder}
            onValueChange={toggleRent}
            thumbColor={theme.primary}
          />
        </View>
        <Text className="text-gray-500 mt-1">
          Rent reminder on the 1st of every month.
        </Text>
      </MotiView>

      {/* CUSTOM REMINDERS */}
      <Text className="text-xl font-semibold mt-6 mb-3" style={{ color: theme.text }}>
        Custom Reminders
      </Text>

      <View className="p-4 rounded-3xl shadow" style={{ backgroundColor: theme.surface }}>
        {/* Title */}
        <Text className="mb-1 font-medium" style={{ color: theme.text }}>
          Reminder Title
        </Text>
        <TextInput
          placeholder="Ex: Pay credit card bill"
          placeholderTextColor="#aaa"
          value={customTitle}
          onChangeText={setCustomTitle}
          className="p-4 mb-3 rounded-2xl bg-secondary"
        />

        {/* Day */}
        <Text className="mb-1 font-medium" style={{ color: theme.text }}>
          Day of Month (1–31)
        </Text>
        <TextInput
          placeholder="1"
          keyboardType="numeric"
          value={customDay}
          onChangeText={setCustomDay}
          placeholderTextColor="#aaa"
          className="p-4 mb-3 rounded-2xl bg-secondary"
        />

        {/* Add Button */}
        <TouchableOpacity
          onPress={addCustomReminder}
          className="bg-primary py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-semibold text-lg">Add Reminder</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
