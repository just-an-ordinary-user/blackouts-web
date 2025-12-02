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
