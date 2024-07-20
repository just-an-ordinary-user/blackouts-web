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
  let start_hour = +data[0].hour;
  let end_hour = start_hour;

  for (const entry of data.slice(1)) {
    if (entry.electricity === current_electricity) {
      end_hour = +entry.hour;
    } else {
      squeezed_data.push({
        electricity: current_electricity,
        hours: formatHours(start_hour, end_hour),
        hour: start_hour,
        from: +start_hour - 1,
        to: +end_hour,
      });
      current_electricity = entry.electricity;
      start_hour = +entry.hour;
      end_hour = start_hour;
    }
  }

  squeezed_data.push({
    electricity: current_electricity,
    hours: formatHours(start_hour, end_hour),
    from: +start_hour - 1,
    to: +end_hour,
    hour: +start_hour,
  });

  return squeezed_data;
}
