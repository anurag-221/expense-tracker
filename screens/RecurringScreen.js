import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch } from "react-native";
import { MotiView } from "moti";
import colors from "../theme/colors";
import darkColors from "../theme/darkColors";
import { loadTransactions, saveTransactions } from "../services/localStorage";

export default function RecurringScreen() {
  const [recurringList, setRecurringList] = useState([]);
  const [dark] = useState(false);
  const theme = dark ? darkColors : colors;

  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDay, setNewDay] = useState("1");
  const [newTag, setNewTag] = useState("General");

  useEffect(() => {
    async function load() {
      const data = await loadTransactions();
      const onlyRecurring = data.filter((x) => x.recurring === true);
      setRecurringList(onlyRecurring);
    }
    load();
  }, []);

  async function addRecurring() {
    if (!newDesc || !newAmount) return;

    const all = await loadTransactions();

    const newItem = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      type: "Debit",
      description: newDesc,
      amount: Number(newAmount),
      tag: newTag,
      recurring: true,
      recurringDay: newDay,
      lastApplied: null,
      month: new Date().toISOString().slice(0, 7)
    };

    await saveTransactions([...all, newItem]);

    setRecurringList([...recurringList, newItem]);

    setNewDesc("");
    setNewAmount("");
    setNewTag("General");
  }

  async function toggleRecurring(item) {
    const all = await loadTransactions();

    const updated = all.map((t) =>
      t.id === item.id ? { ...t, recurring: !t.recurring } : t
    );

    await saveTransactions(updated);

    setRecurringList(updated.filter((x) => x.recurring === true));
  }

  async function deleteRecurring(item) {
    const all = await loadTransactions();
    const updated = all.filter((t) => t.id !== item.id);
    await saveTransactions(updated);

    setRecurringList(updated.filter((x) => x.recurring === true));
  }

  return (
    <ScrollView
      className="flex-1 px-4"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      {/* Header */}
      <Text className="text-3xl font-bold mt-6" style={{ color: theme.text }}>
        Recurring Bills
      </Text>

      <Text className="mt-1 text-gray-500">
        Auto deduct Rent, SIP, EMIs and more
      </Text>

      {/* Add New Recurring Card */}
      <View
        className="mt-5 p-5 rounded-3xl shadow-lg"
        style={{ backgroundColor: theme.surface }}
      >
        <Text className="text-xl font-semibold mb-3" style={{ color: theme.text }}>
          Add Recurring Entry
        </Text>

        {/* Description */}
        <Text className="mb-1 mt-2 font-medium" style={{ color: theme.text }}>
          Description
        </Text>
        <TextInput
          placeholder="Rent, SIP, EMI…"
          value={newDesc}
          onChangeText={setNewDesc}
          placeholderTextColor="#aaa"
          className="p-4 rounded-2xl bg-secondary mb-3"
        />

        {/* Amount */}
        <Text className="mb-1 font-medium" style={{ color: theme.text }}>
          Amount (₹)
        </Text>
        <TextInput
          placeholder="Enter amount"
          value={newAmount}
          onChangeText={setNewAmount}
          keyboardType="numeric"
          placeholderTextColor="#aaa"
          className="p-4 rounded-2xl bg-secondary mb-3"
        />

        {/* Tag */}
        <Text className="mb-1 font-medium" style={{ color: theme.text }}>
          Tag
        </Text>
        <TextInput
          placeholder="SIP, EMI, Rent…"
          value={newTag}
          onChangeText={setNewTag}
          placeholderTextColor="#aaa"
          className="p-4 rounded-2xl bg-secondary mb-3"
        />

        {/* Day of Month */}
        <Text className="mb-1 font-medium" style={{ color: theme.text }}>
          Deduct On Day (1–31)
        </Text>
        <TextInput
          placeholder="1"
          value={newDay}
          onChangeText={setNewDay}
          keyboardType="numeric"
          placeholderTextColor="#aaa"
          className="p-4 rounded-2xl bg-secondary mb-3"
        />

        {/* Save Button */}
        <TouchableOpacity
          onPress={addRecurring}
          className="bg-primary py-4 rounded-2xl mt-2 items-center"
        >
          <Text className="text-white font-semibold text-lg">
            Add Recurring
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recurring List */}
      <Text className="text-xl font-semibold mt-8 mb-3" style={{ color: theme.text }}>
        Active Recurring Entries
      </Text>

      {recurringList.length === 0 && (
        <Text className="text-gray-500">No recurring entries added yet</Text>
      )}

      {recurringList.map((item, index) => (
        <MotiView
          key={item.id}
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: index * 80 }}
          className="rounded-3xl p-5 mb-4 shadow"
          style={{ backgroundColor: theme.surface }}
        >
          <Text className="text-lg font-semibold" style={{ color: theme.text }}>
            {item.description}
          </Text>
          <Text className="text-gray-500 mt-1">₹ {item.amount}</Text>
          <Text className="text-gray-400">Tag: {item.tag}</Text>
          <Text className="text-gray-400">Day: {item.recurringDay}</Text>

          {/* Toggle ON/OFF */}
          <View className="flex-row justify-between items-center mt-4">
            <Text className="font-medium" style={{ color: theme.textSecondary }}>
              Active
            </Text>
            <Switch
              value={item.recurring}
              onValueChange={() => toggleRecurring(item)}
              thumbColor={theme.primary}
            />
          </View>

          {/* Delete button */}
          <TouchableOpacity
            onPress={() => deleteRecurring(item)}
            className="mt-4 py-3 rounded-2xl bg-red-500 items-center"
          >
            <Text className="text-white font-semibold">Delete</Text>
          </TouchableOpacity>
        </MotiView>
      ))}
    </ScrollView>
  );
}
