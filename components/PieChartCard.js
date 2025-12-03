import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import colors from "../theme/colors";

export default function PieChartCard({ data, title }) {
  const chartData = data.map(item => ({
    name: item.label,
    amount: item.value,
    color: item.color,
    legendFontColor: "#444",
    legendFontSize: 14,
  }));

  return (
    <View className="p-4 mt-3 rounded-2xl shadow-md bg-white">
      <Text className="text-lg font-semibold mb-2">{title}</Text>

      <PieChart
        data={chartData}
        width={Dimensions.get("window").width - 40}
        height={190}
        accessor="amount"
        chartConfig={{
          color: () => "#7B61FF",
        }}
        backgroundColor="transparent"
      />
    </View>
  );
}
