import type { TScheduleItem, TScheduleNormalizedItem } from "../types/Response";

export function normalizeScheduleData(
  data: TScheduleItem[],
): TScheduleNormalizedItem[] {
  return data.map((entry) => ({
    ...entry,
    hour: entry.hour,
    hours: entry.hour,
    from: +entry.hour.split("-")[0],
    to: +entry.hour.split("-")[1],
  }));
}
