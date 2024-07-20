import dayjs from "dayjs";

export function getToday() {
  return dayjs().format("YYYY-MM-DD");
}

export function getTomorrow() {
  return dayjs()
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .add(1, "day")
    .format("YYYY-MM-DD");
}
