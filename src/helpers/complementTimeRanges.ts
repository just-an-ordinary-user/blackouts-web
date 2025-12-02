export function to_minutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function to_time(minutes: number) {
  const mins = minutes % DAY;
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
}

export function to_range_minutes(from: string, to: string) {
  const start = to_minutes(from);
  let end = to_minutes(to);
  if (end < start) end += 1440;
  return end - start;
}

export function complement_range_strings(
  ranges: string[],
  with_spaces = false,
) {
  const sep = with_spaces ? " - " : "-";

  // Convert minutes back to "HH:MM"
  const to_time = (m: number) =>
    `${String(Math.floor((m % (24 * 60)) / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

  // Convert input ranges into [start, end] minutes
  const parsed = ranges.map((r) => {
    const [s, e] = r.split("-");
    return [to_minutes(s.trim()), to_minutes(e.trim())];
  });

  // Sort just in case
  parsed.sort((a, b) => a[0] - b[0]);

  const result = [];
  let lastEnd = 0;

  for (const [s, e] of parsed) {
    if (s > lastEnd) {
      result.push(`${to_time(lastEnd)}${sep}${to_time(s)}`);
    }
    lastEnd = e;
  }

  // Wrap to next day
  if (lastEnd < 24 * 60) {
    result.push(`${to_time(lastEnd)}${sep}${to_time(0)}`);
  }

  return result;
}

const DAY = 24 * 60;

export function complement_ranges(ranges: { from: string; to: string }[]) {
  // Convert to minute-based ranges + sort
  const parsed = ranges
    .map((r) => ({ from: to_minutes(r.from), to: to_minutes(r.to) }))
    .sort((a, b) => a.from - b.from);

  const result = [];
  let lastEnd = 0;

  for (const r of parsed) {
    if (r.from > lastEnd) {
      result.push({
        from: to_time(lastEnd),
        to: to_time(r.from),
      });
    }
    lastEnd = r.to;
  }

  console.log(lastEnd, DAY);

  // Final gap to midnight
  if (lastEnd > 0 && lastEnd < DAY) {
    result.push({
      from: to_time(lastEnd),
      to: to_time(0),
    });
  }

  return result;
}
