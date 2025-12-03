export function checkMonthlyLimit(transactions, limit) {
  const month = new Date().toISOString().slice(0, 7);

  const spent = transactions
    .filter(t => t.month === month && t.type === "Debit" && t.tag !== "Saving")
    .reduce((a, b) => a + Number(b.amount), 0);

  if (spent >= limit) return "Exceeded";
  if (spent >= limit * 0.8) return "Warning";
  return "OK";
}

export function categoryOverspend(transactions, tag, catLimit) {
  const month = new Date().toISOString().slice(0, 7);

  const spent = transactions
    .filter(t => t.month === month && t.tag === tag)
    .reduce((a, b) => a + Number(b.amount), 0);

  if (spent >= catLimit) return "Exceeded";
  if (spent >= catLimit * 0.8) return "Warning";
  return "OK";
}
