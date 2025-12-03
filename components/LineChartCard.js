import React from "react";
import { View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function LineChartCard({ labels, values, title }) {
  return (
    <View className="p-4 mt-3 rounded-2xl shadow-md bg-white">
      <Text className="text-lg font-semibold mb-2">{title}</Text>

      <LineChart
        data={{
          labels,
          datasets: [{ data: values }],
        }}
        width={Dimensions.get("window").width - 40}
        height={220}
        yAxisLabel="₹"
        chartConfig={{
          backgroundGradientFrom: "#EFE9FF",
          backgroundGradientTo: "#D2C4FF",
          decimalPlaces: 0,
          color: () => "#7B61FF",
        }}
        bezier
        style={{ borderRadius: 16 }}
      />
    </View>
  );
}
