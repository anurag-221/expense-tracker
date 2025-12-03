import { loadTransactions, saveTransactions } from "./localStorage";

export async function applyRecurring() {
  const data = await loadTransactions();
  const today = new Date();
  const thisMonth = today.getMonth() + 1;
  const thisYear = today.getFullYear();

  const recurring = data.filter(item => item.recurring === true);

  let changed = false;

  for (let item of recurring) {
    const last = new Date(item.lastApplied || 0);

    if (last.getMonth() + 1 !== thisMonth || last.getFullYear() !== thisYear) {
      const newEntry = {
        ...item,
        date: today.toISOString().split("T")[0],
        lastApplied: today.toISOString(),
        month: `${thisYear}-${String(thisMonth).padStart(2, "0")}`
      };

      data.push(newEntry);
      item.lastApplied = today.toISOString();
      changed = true;
    }
  }

  if (changed) await saveTransactions(data);

  return changed;
}
