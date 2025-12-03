import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import { loadTransactions } from "../services/localStorage";
import colors from "../theme/colors";
import darkColors from "../theme/darkColors";

import BarChartCard from "../components/BarChartCard";
import PieChartCard from "../components/PieChartCard";
import LineChartCard from "../components/LineChartCard";
import EntryCard from "../components/EntryCard";

import { getTotals } from "../utils/calculate";
import { formatMonth } from "../utils/time";

export default function SummaryScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const dark = false; // add toggle later
  const theme = dark ? darkColors : colors;

  useEffect(() => {
    async function loadData() {
      const data = await loadTransactions();
      setTransactions(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-gray-500 mt-3">Loading summary...</Text>
      </View>
    );
  }

  const { credit, debit, saving, balance } = getTotals(transactions);

  // --- Category Spending ---
  const categories = {};
  transactions.forEach((t) => {
    if (t.type === "Debit" && t.tag !== "Saving") {
      categories[t.tag] = (categories[t.tag] || 0) + Number(t.amount);
    }
  });

  const categoryArray = Object.keys(categories).map((key, index) => ({
    label: key,
    value: categories[key],
    color: pastelColors[index % pastelColors.length],
  }));

  const pastelColors = [
    "#B39DDB",
    "#CE93D8",
    "#9575CD",
    "#7E57C2",
    "#D1C4E9",
    "#B388FF",
  ];

  // --- Monthly Chart Data ---
  const monthlyTotals = {};
  transactions.forEach((t) => {
    const month = t.month;
    if (!monthlyTotals[month]) monthlyTotals[month] = 0;
    if (t.type === "Debit" && t.tag !== "Saving") {
      monthlyTotals[month] += Number(t.amount);
    }
  });

  const barLabels = Object.keys(monthlyTotals)
    .slice(-6)
    .map((m) => formatMonth(m + "-01").slice(0, 3));
  const barValues = Object.values(monthlyTotals).slice(-6);

  // --- Savings Growth Line Chart ---
  const savingMonths = {};
  transactions.forEach((t) => {
    if (t.tag === "Saving") {
      const month = t.month;
      savingMonths[month] = (savingMonths[month] || 0) + Number(t.amount);
    }
  });

  const lineLabels = Object.keys(savingMonths).map((m) =>
    formatMonth(m + "-01").slice(0, 3)
  );
  const lineValues = Object.values(savingMonths);

  // --- Sort top transactions ---
  const top10 = transactions
    .filter((t) => t.type === "Debit" && t.tag !== "Saving")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  // --- Insights ---
  const highestCategory = categoryArray.sort((a, b) => b.value - a.value)[0]?.label || "None";
  const highestMonth = Object.keys(monthlyTotals).sort(
    (a, b) => monthlyTotals[b] - monthlyTotals[a]
  )[0];

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      <Text className="text-3xl font-bold mt-6 px-4" style={{ color: theme.text }}>
        Summary
      </Text>

      {/* Totals Card */}
      <View className="mx-4 mt-5 p-5 rounded-3xl shadow-lg"
        style={{ backgroundColor: theme.surface }}>
        <Text className="text-base" style={{ color: theme.textSecondary }}>
          Total Balance
        </Text>
        <Text className="text-4xl font-bold mt-1" style={{ color: theme.primary }}>
          ₹ {balance}
        </Text>

        <View className="flex-row justify-between mt-4">
          <View className="flex-1">
            <Text className="text-gray-500">Credit</Text>
            <Text className="text-xl font-bold mt-1" style={{ color: theme.success }}>
              ₹ {credit}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-gray-500">Debit</Text>
            <Text className="text-xl font-bold mt-1" style={{ color: theme.danger }}>
              ₹ {debit}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-gray-500">Saving</Text>
            <Text className="text-xl font-bold mt-1" style={{ color: theme.accent }}>
              ₹ {saving}
            </Text>
          </View>
        </View>
      </View>

      {/* Insights */}
      <View className="mx-4 mt-4 p-4 rounded-2xl shadow" style={{ backgroundColor: theme.surface }}>
        <Text className="text-lg font-semibold" style={{ color: theme.text }}>
          Insights
        </Text>
        <Text className="mt-2" style={{ color: theme.textSecondary }}>
          🔍 Highest spending category: <Text className="font-bold">{highestCategory}</Text>
        </Text>
        <Text className="mt-1" style={{ color: theme.textSecondary }}>
          📅 Highest spending month:{" "}
          <Text className="font-bold">
            {formatMonth(highestMonth + "-01")}
          </Text>
        </Text>
      </View>

      {/* Charts */}
      <BarChartCard title="Monthly Spending" labels={barLabels} values={barValues} />

      <PieChartCard title="Category Breakdown" data={categoryArray} />

      <LineChartCard
        title="Savings Trend"
        labels={lineLabels}
        values={lineValues}
      />

      {/* Top 10 Transactions */}
      <View className="mx-4 mt-6">
        <Text className="text-xl font-semibold mb-3" style={{ color: theme.text }}>
          Top 10 Transactions
        </Text>

        {top10.map((item, index) => (
          <EntryCard key={item.id} item={item} index={index} dark={dark} />
        ))}
      </View>
    </ScrollView>
  );
}
