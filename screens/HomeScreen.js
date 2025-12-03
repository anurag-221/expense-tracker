import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import Greeting from "../components/Greeting";
import colors from "../theme/colors";
import darkColors from "../theme/darkColors";
import { loadTransactions } from "../services/localStorage";
import { getTotals } from "../utils/calculate";
import BarChartCard from "../components/BarChartCard";
import PieChartCard from "../components/PieChartCard";
import LineChartCard from "../components/LineChartCard";
import { checkMonthlyLimit } from "../utils/spendAlerts";
import { formatMonth } from "../utils/time";

export default function HomeScreen({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [dark] = useState(false); // (Implement toggle in Settings)
  const [loading, setLoading] = useState(true);

  const theme = dark ? darkColors : colors;

  useEffect(() => {
    async function load() {
      const data = await loadTransactions();
      setTransactions(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-3 text-gray-500">Loading your finances...</Text>
      </View>
    );
  }

  const { credit, debit, saving, balance } = getTotals(transactions);

  // Monthly alert
  const limitAlert = checkMonthlyLimit(transactions, 30000); // example limit

  // Chart sample data
  const monthName = formatMonth(new Date().toISOString());
  const barLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const barValues = [4000, 6000, 3000, 5000]; // Replace later with actual logic

  const pieData = [
    { label: "Food", value: 4200, color: "#B39DDB" },
    { label: "Travel", value: 2700, color: "#CE93D8" },
    { label: "Shopping", value: 3100, color: "#9575CD" },
    { label: "Bills", value: 2200, color: "#7E57C2" },
  ];

  const sipValues = [1000, 2000, 3000, 4000, 5000];
  const sipMonths = ["Jan", "Feb", "Mar", "Apr", "May"];

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Greeting */}
      <Greeting user={user} dark={dark} />

      {/* Balance Card */}
      <View
        className="mx-4 mt-4 p-5 rounded-3xl shadow-lg"
        style={{ backgroundColor: theme.surface }}
      >
        <Text className="text-lg font-medium" style={{ color: theme.text }}>
          Total Balance
        </Text>
        <Text
          className="text-4xl font-bold mt-2"
          style={{ color: theme.primary }}
        >
          ₹ {balance}
        </Text>
      </View>

      {/* Stats Row */}
      <View className="flex-row justify-between mx-4 mt-4">
        {/* Credit */}
        <View
          className="flex-1 mr-2 p-4 rounded-2xl shadow"
          style={{ backgroundColor: theme.surface }}
        >
          <Text className="text-gray-500 text-sm">Credit</Text>
          <Text className="text-xl font-bold" style={{ color: theme.success }}>
            ₹ {credit}
          </Text>
        </View>

        {/* Debit */}
        <View
          className="flex-1 mx-2 p-4 rounded-2xl shadow"
          style={{ backgroundColor: theme.surface }}
        >
          <Text className="text-gray-500 text-sm">Debit</Text>
          <Text className="text-xl font-bold" style={{ color: theme.danger }}>
            ₹ {debit}
          </Text>
        </View>

        {/* Saving */}
        <View
          className="flex-1 ml-2 p-4 rounded-2xl shadow"
          style={{ backgroundColor: theme.surface }}
        >
          <Text className="text-gray-500 text-sm">Saving</Text>
          <Text className="text-xl font-bold" style={{ color: theme.accent }}>
            ₹ {saving}
          </Text>
        </View>
      </View>

      {/* Monthly Alert Banner */}
      {limitAlert === "Warning" && (
        <View className="mx-4 mt-4 p-4 rounded-2xl bg-yellow-100 border-l-4 border-yellow-500">
          <Text className="text-yellow-800 font-medium">
            ⚠️ You’ve used over 80% of your monthly budget!
          </Text>
        </View>
      )}

      {limitAlert === "Exceeded" && (
        <View className="mx-4 mt-4 p-4 rounded-2xl bg-red-100 border-l-4 border-red-500">
          <Text className="text-red-800 font-medium">
            ❌ You exceeded your monthly budget!
          </Text>
        </View>
      )}

      {/* Charts */}
      <BarChartCard
        title={`Monthly Spending – ${monthName}`}
        labels={barLabels}
        values={barValues}
      />

      <PieChartCard title="Category Breakdown" data={pieData} />

      <LineChartCard
        title="SIP Growth (Projected)"
        labels={sipMonths}
        values={sipValues}
      />
    </ScrollView>
  );
}
