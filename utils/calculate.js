export function getTotals(transactions) {
  const credit = transactions
    .filter(t => t.type === "Credit")
    .reduce((a, b) => a + Number(b.amount), 0);

  const debit = transactions
    .filter(t => t.type === "Debit" && t.tag !== "Saving")
    .reduce((a, b) => a + Number(b.amount), 0);

  const saving = transactions
    .filter(t => t.tag === "Saving")
    .reduce((a, b) => a + Number(b.amount), 0);

  return {
    credit,
    debit,
    saving,
    balance: credit - debit
  };
}

export function sipProjection(monthly, rate = 12, years = 5) {
  const r = rate / 100 / 12;
  const n = years * 12;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}
