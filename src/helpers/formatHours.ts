export function formatHours(start_hour: number, end_hour: number): string {
  return `${(start_hour - 1).toString().padStart(2, "0")}-${end_hour.toString().padStart(2, "0")}`;
}
