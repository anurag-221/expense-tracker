export function formatMonth(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("default", { month: "long", year: "numeric" });
}

export function formatDay(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

export function getYear(dateStr) {
  return new Date(dateStr).getFullYear();
}

export function getMonthNumber(dateStr) {
  return new Date(dateStr).getMonth() + 1;
}
