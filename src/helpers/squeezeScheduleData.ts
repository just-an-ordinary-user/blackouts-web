import type { TScheduleItem, TScheduleNormalizedItem } from "../types/Response";
import { formatHours } from "./formatHours";

export function squeezeScheduleData(
  data: TScheduleItem[],
): TScheduleNormalizedItem[] {
  if (!data) {
    return [];
  }

  const squeezed_data: TScheduleNormalizedItem[] = [];
  let current_electricity = data[0].electricity;
  let start_hour = +data[0].hour.split("-")[1];
  let end_hour = start_hour;

  for (const entry of data.slice(1)) {
    if (entry.electricity === current_electricity) {
      end_hour = +entry.hour.split("-")[1];
    } else {
      squeezed_data.push({
        electricity: current_electricity,
        hours: formatHours(start_hour, end_hour),
        hour: entry.hour,
        from: +start_hour - 1,
        to: +end_hour,
      });
      current_electricity = entry.electricity;
      start_hour = +entry.hour.split("-")[1];
      end_hour = start_hour;
    }
  }

  squeezed_data.push({
    electricity: current_electricity,
    hours: formatHours(start_hour, end_hour),
    from: +start_hour - 1,
    to: +end_hour,
    hour: data[0].hour,
  });

  return squeezed_data;
}
