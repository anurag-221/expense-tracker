import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView } from "react-native";
import CalendarPicker from "../components/CalendarPicker";
import { loadTransactions, saveTransactions } from "../services/localStorage";
import colors from "../theme/colors";
import darkColors from "../theme/darkColors";
import { MotiView } from "moti";

export default function AddEntryScreen({ navigation }) {
  const [date, setDate] = useState("");
  const [type, setType] = useState("Credit");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [tag, setTag] = useState("General");
  const [recurring, setRecurring] = useState(false);

  const dark = false; // integrate from Settings later
  const theme = dark ? darkColors : colors;

  async function save() {
    if (!date || !amount || !description) return;

    const existing = await loadTransactions();

    const newEntry = {
      id: Date.now(),
      date,
      type,
      description,
      amount: Number(amount),
      tag,
      recurring,
      lastApplied: recurring ? new Date().toISOString() : null,
      month: date.slice(0, 7)
    };

    await saveTransactions([...existing, newEntry]);

    navigation.goBack();
  }

  return (
    <ScrollView
      className="flex-1 px-4"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text className="text-2xl font-bold mt-6 mb-3" style={{ color: theme.text }}>
        Add New Entry
      </Text>

      {/* Date Picker */}
      <Text className="font-medium mb-2" style={{ color: theme.text }}>
        Select Date
      </Text>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 500 }}
      >
        <CalendarPicker onSelect={setDate} />
      </MotiView>

      {/* Type Selector */}
      <Text className="mt-6 mb-2 font-medium" style={{ color: theme.text }}>
        Type
      </Text>

      <View className="flex-row bg-secondary/60 p-2 rounded-2xl">
        {["Credit", "Debit"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setType(item)}
            className={`flex-1 py-3 rounded-2xl items-center ${
              type === item ? "bg-primary" : ""
            }`}
          >
            <Text className={`font-semibold ${type === item ? "text-white" : "text-gray-600"}`}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Material 3 Filled Inputs */}
      <View className="mt-6">
        {/* Description */}
        <Text className="mb-1 font-medium" style={{ color: theme.text }}>
          Description
        </Text>
        <TextInput
          placeholder="Enter description"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          className="p-4 rounded-2xl bg-secondary text-base"
        />

        {/* Amount */}
        <Text className="mt-4 mb-1 font-medium" style={{ color: theme.text }}>
          Amount (₹)
        </Text>
        <TextInput
          placeholder="Enter amount"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          className="p-4 rounded-2xl bg-secondary text-base"
        />

        {/* Tag */}
        <Text className="mt-4 mb-1 font-medium" style={{ color: theme.text }}>
          Tag
        </Text>
        <TextInput
          placeholder="Ex: Saving, SIP, Food, Travel"
          placeholderTextColor="#999"
          value={tag}
          onChangeText={setTag}
          className="p-4 rounded-2xl bg-secondary text-base"
        />

        {/* Recurring Toggle */}
        <View className="flex-row justify-between items-center mt-6">
          <Text className="text-lg font-medium" style={{ color: theme.text }}>
            Repeat Every Month
          </Text>
          <Switch value={recurring} onValueChange={setRecurring} thumbColor={theme.primary} />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={save}
        className="mt-8 p-4 rounded-2xl bg-primary items-center shadow-lg"
      >
        <Text className="text-white font-semibold text-lg">Save Entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
