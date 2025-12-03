import React from "react";
import { View, Text } from "react-native";
import { MotiView } from "moti";
import colors from "../theme/colors";
import darkColors from "../theme/darkColors";

export default function EntryCard({ item, index, dark }) {
  const theme = dark ? darkColors : colors;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 80 }}
      className="p-4 my-2 rounded-2xl shadow-md"
      style={{ backgroundColor: theme.surface }}
    >
      <Text className="text-base font-semibold" style={{ color: theme.text }}>
        {item.description}
      </Text>

      <Text className="text-sm opacity-70" style={{ color: theme.textSecondary }}>
        {item.date}
      </Text>

      <Text
        className="text-lg font-bold mt-1"
        style={{
          color:
            item.type === "Credit"
              ? theme.success
              : item.tag === "Saving"
              ? theme.accent
              : theme.danger
        }}
      >
        ₹ {item.amount}
      </Text>
    </MotiView>
  );
}
