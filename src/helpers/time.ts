import dayjs from "dayjs";

export function getToday() {
  return dayjs().format("DD-MM-YYYY");
}

export function getNow() {
  const h = new Date().getHours();
  const m = new Date().getMinutes();
  const now = h * 60 + m;
  return now;
}

export function getTomorrow() {
  return dayjs()
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .add(1, "day")
    .format("DD-MM-YYYY");
}

export function diffTime(range: string) {
  const [start, end] = range.split(" - ");

  const [h1, m1] = start.split(":").map(Number);
  const [h2, m2] = end.split(":").map(Number);

  // Convert to minutes
  const startMin = h1 * 60 + m1;
  const endMin = h2 * 60 + m2;

  let diff = endMin - startMin;

  // If negative difference (crossing midnight), add 24h
  if (diff < 0) diff += 24 * 60;

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
