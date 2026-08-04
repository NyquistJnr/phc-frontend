function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function getPeriodLabel(start?: string, end?: string) {
  if (!start || !end) return "All available data";
  const sd = new Date(`${start}T00:00:00`);
  const ed = new Date(`${end}T00:00:00`);
  const startDay = getOrdinal(sd.getDate());
  const endDay = getOrdinal(ed.getDate());
  const month = sd.toLocaleString("default", { month: "short" });
  const year = sd.getFullYear();
  const endMonth = ed.toLocaleString("default", { month: "short" });
  const endYear = ed.getFullYear();

  if (month === endMonth && year === endYear) {
    return `${startDay} - ${endDay} ${month} ${year}`;
  } else if (year === endYear) {
    return `${startDay} ${month} - ${endDay} ${endMonth} ${year}`;
  }
  return `${startDay} ${month} ${year} - ${endDay} ${endMonth} ${endYear}`;
}
