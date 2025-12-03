import React from "react";
import { Calendar } from "react-native-calendars";
import colors from "../theme/colors";

export default function CalendarPicker({ onSelect }) {
  return (
    <Calendar
      onDayPress={(day) => onSelect(day.dateString)}
      theme={{
        selectedDayBackgroundColor: colors.primary,
        todayTextColor: colors.accent,
        arrowColor: colors.primary,
        textSectionTitleColor: "#777",
      }}
    />
  );
}
