import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export async function registerForNotifications() {
  if (!Device.isDevice) return;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return;

  return Notifications.getExpoPushTokenAsync();
}

export function scheduleDailyNotification(hour = 9, minute = 0) {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "Daily Finance Check",
      body: "Track your expenses and stay in control!",
    },
    trigger: { hour, minute, repeats: true },
  });
}

export function scheduleCustomReminder(title, body, dayOfMonth = 1) {
  Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      day: dayOfMonth,
      hour: 9,
      minute: 0,
      repeats: true
    }
  });
}
