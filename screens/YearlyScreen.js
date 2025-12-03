import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { loadTransactions } from "../services/localStorage";
import colors from "../theme/colors";
import darkColors from "../theme/darkColors";

import BarChartCard from "../components/BarChartCard";
import PieChartCard from "../components/PieChartCard";
import LineChartCard from "../components/LineChartCard";
import EntryCard from "../components/EntryCard";

import { formatMonth, getYear } from "../utils/time";
import { getTotals } from "../utils/calculate";

export default function YearlyScreen() {
  const [transactions, setTransactions] = useState([]);
  const [year, setYear] = useState("");
  const [dark] = useState(false);

  const theme = dark ? darkColors : colors;

  useEffect(() => {
    async function load() {
      const data = await loadTransactions();
      setTransactions(data);

      const currentYear = new Date().getFullYear().toString();
      setYear(currentYear);
    }
    load();
  }, []);

  // collect all unique years
  const years = [...new Set(transactions.map((t) => String(getYear(t.date))))].sort();

  const yearData = transactions.filter((t) => String(getYear(t.date)) === year);

  // yearly totals
  const credit = yearData
    .filter((t) => t.type === "Credit")
    .reduce((a, b) => a + Number(b.amount), 0);

  const debit = yearData
    .filter((t) => t.type === "Debit" && t.tag !== "Saving")
    .reduce((a, b) => a + Number(b.amount), 0);

  const saving = yearData
    .filter((t) => t.tag === "Saving")
    .reduce((a, b) => a + Number(b.amount), 0);

  // Category breakdown
  const categories = {};
  yearData.forEach((t) => {
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

  // Spending by month
  const monthly = {};
  yearData.forEach((t) => {
    if (t.type === "Debit" && t.tag !== "Saving") {
      const month = t.month;
      monthly[month] = (monthly[month] || 0) + Number(t.amount);
    }
  });

  const barLabels = Object.keys(monthly).map((m) =>
    formatMonth(m + "-01").slice(0, 3)
  );
  const barValues = Object.values(monthly);

  // Savings line chart
  const savingMonthly = {};
  yearData.forEach((t) => {
    if (t.tag === "Saving") {
      const month = t.month;
      savingMonthly[month] = (savingMonthly[month] || 0) + Number(t.amount);
    }
  });

  const lineLabels = Object.keys(savingMonthly).map((m) =>
    formatMonth(m + "-01").slice(0, 3)
  );
  const lineValues = Object.values(savingMonthly);

  // Insights
  const highestMonth = Object.keys(monthly).sort(
    (a, b) => monthly[b] - monthly[a]
  )[0];

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      {/* HEADER */}
      <Text className="text-3xl font-bold px-4 mt-6" style={{ color: theme.text }}>
        Yearly Analysis
      </Text>

      {/* Year Slider */}
      <FlatList
        data={years}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4 px-4"
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const isActive = year === item;
          return (
            <TouchableOpacity
              onPress={() => setYear(item)}
              className={`px-6 py-2 rounded-full mr-3 ${
                isActive ? "bg-primary" : "bg-secondary"
              }`}
            >
              <Text className={`${isActive ? "text-white" : "text-gray-700"} font-medium`}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140 }}>
        
        {/* Totals */}
        <View className="mx-4 mt-4 p-5 rounded-3xl shadow-lg"
          style={{ backgroundColor: theme.surface }}>
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

        {/* Insights */}
        <View className="mx-4 mt-4 p-4 rounded-2xl shadow"
          style={{ backgroundColor: theme.surface }}>
          <Text className="text-lg font-semibold" style={{ color: theme.text }}>
            Insights
          </Text>

          <Text className="mt-2" style={{ color: theme.textSecondary }}>
            📅 Highest spending month:{" "}
            <Text className="font-bold">
              {formatMonth(highestMonth + "-01")}
            </Text>
          </Text>

          <Text className="mt-1" style={{ color: theme.textSecondary }}>
            🔍 Top category:{" "}
            <Text className="font-bold">
              {categoryArray.sort((a, b) => b.value - a.value)[0]?.label || "None"}
            </Text>
          </Text>
        </View>

        {/* Charts */}
        <BarChartCard title="Yearly Spending" labels={barLabels} values={barValues} />

        <PieChartCard title="Category Breakdown" data={categoryArray} />

        <LineChartCard title="Savings Trend" labels={lineLabels} values={lineValues} />

      </ScrollView>
    </View>
  );
}
