import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { loadTransactions } from "../services/localStorage";

import colors from "../theme/colors";
import darkColors from "../theme/darkColors";

import BarChartCard from "../components/BarChartCard";
import PieChartCard from "../components/PieChartCard";
import EntryCard from "../components/EntryCard";

import { formatMonth } from "../utils/time";

export default function MonthlyScreen() {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [dark] = useState(false);

  const theme = dark ? darkColors : colors;

  useEffect(() => {
    async function load() {
      const data = await loadTransactions();
      setTransactions(data);

      // auto set to current month
      const current = new Date().toISOString().slice(0, 7);
      setSelectedMonth(current);
    }
    load();
  }, []);

  // unique months from data
  const months = [...new Set(transactions.map((t) => t.month))].sort();

  // filter data by selected month
  const monthData = transactions.filter((t) => t.month === selectedMonth);

  const credit = monthData
    .filter((t) => t.type === "Credit")
    .reduce((a, b) => a + Number(b.amount), 0);

  const debit = monthData
    .filter((t) => t.type === "Debit" && t.tag !== "Saving")
    .reduce((a, b) => a + Number(b.amount), 0);

  const saving = monthData
    .filter((t) => t.tag === "Saving")
    .reduce((a, b) => a + Number(b.amount), 0);

  // category breakdown
  const categories = {};
  monthData.forEach((t) => {
    if (t.type === "Debit" && t.tag !== "Saving") {
      categories[t.tag] = (categories[t.tag] || 0) + Number(t.amount);
    }
  });

  const pastelColors = [
    "#B39DDB",
    "#CE93D8",
    "#9575CD",
    "#7E57C2",
    "#D1C4E9",
    "#B388FF",
  ];

  const categoryArray = Object.keys(categories).map((key, index) => ({
    label: key,
    value: categories[key],
    color: pastelColors[index % pastelColors.length],
  }));

  const monthTitle = selectedMonth ? formatMonth(selectedMonth + "-01") : "";

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>

      {/* HEADER */}
      <Text className="text-3xl font-bold px-4 mt-6" style={{ color: theme.text }}>
        Monthly Analysis
      </Text>

      {/* Horizontal Month Slider */}
      <FlatList
        data={months}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4 px-4"
        renderItem={({ item }) => {
          const isActive = item === selectedMonth;

          return (
            <TouchableOpacity
              onPress={() => setSelectedMonth(item)}
              className={`px-4 py-2 rounded-full mr-3 ${
                isActive ? "bg-primary" : "bg-secondary"
              }`}
            >
              <Text
                className={`font-medium ${
                  isActive ? "text-white" : "text-gray-700"
                }`}
              >
                {formatMonth(item + "-01").slice(0, 8)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <ScrollView className="flex-1 mt-4" contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Month Title */}
        <Text className="text-xl font-semibold px-4 mt-2" style={{ color: theme.text }}>
          {monthTitle}
        </Text>

        {/* Stats Card */}
        <View
          className="mx-4 mt-4 p-5 rounded-3xl shadow-lg"
          style={{ backgroundColor: theme.surface }}
        >
          <View className="flex-row justify-between">
            <View>
              <Text className="text-gray-500">Credit</Text>
              <Text className="text-xl font-bold" style={{ color: theme.success }}>
                ₹ {credit}
              </Text>
            </View>

            <View>
              <Text className="text-gray-500">Debit</Text>
              <Text className="text-xl font-bold" style={{ color: theme.danger }}>
                ₹ {debit}
              </Text>
            </View>

            <View>
              <Text className="text-gray-500">Saving</Text>
              <Text className="text-xl font-bold" style={{ color: theme.accent }}>
                ₹ {saving}
              </Text>
            </View>
          </View>
        </View>

        {/* Category Chart */}
        <PieChartCard title="Category Breakdown" data={categoryArray} />

        {/* Weekly Spending Estimate Chart */}
        <BarChartCard
          title="Weekly Spending"
          labels={["W1", "W2", "W3", "W4"]}
          values={[
            debit * 0.25,
            debit * 0.3,
            debit * 0.2,
            debit * 0.25,
          ]}
        />

        {/* Transactions List */}
        <View className="mx-4 mt-6">
          <Text className="text-xl font-semibold mb-3" style={{ color: theme.text }}>
            Transactions
          </Text>

          {monthData.length === 0 ? (
            <Text className="text-gray-500">No entries this month</Text>
          ) : (
            monthData.map((item, index) => (
              <EntryCard key={item.id} item={item} index={index} dark={dark} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
