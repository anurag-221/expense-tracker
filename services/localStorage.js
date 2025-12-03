import * as FileSystem from "expo-file-system";

const FILE_PATH = FileSystem.documentDirectory + "transactions.json";

export async function loadTransactions() {
  try {
    const file = await FileSystem.getInfoAsync(FILE_PATH);

    if (!file.exists) return [];

    const content = await FileSystem.readAsStringAsync(FILE_PATH);
    return JSON.parse(content);
  } catch (e) {
    console.log("Load error:", e);
    return [];
  }
}

export async function saveTransactions(data) {
  try {
    await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(data));
  } catch (e) {
    console.log("Save error:", e);
  }
}
