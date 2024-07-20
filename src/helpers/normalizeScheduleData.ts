import type { TScheduleItem, TScheduleNormalizedItem } from "../types/Response";

export function normalizeScheduleData(
  data: TScheduleItem[],
): TScheduleNormalizedItem[] {
  return data.map((entry) => ({
    ...entry,
    hour: +entry.hour,
    hours: `${+entry.hour - 1}-${entry.hour}`,
    from: +entry.hour - 1,
    to: +entry.hour,
  }));
}
