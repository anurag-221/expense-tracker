export function getGreeting(name = "Guest") {
  const hour = new Date().getHours();

  if (hour < 12) return `Good Morning, ${name} ☀️`;
  if (hour < 18) return `Good Afternoon, ${name} 🌤️`;
  return `Good Evening, ${name} 🌙`;
}
