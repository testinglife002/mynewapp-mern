export const getNext7Days = () => {
  const today = new Date();
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const formatted = date.toISOString().split("T")[0];
    days.push({
      label: date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
      date: formatted,
    });
  }
  return days;
};
