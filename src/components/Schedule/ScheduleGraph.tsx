import { type FC, useMemo } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";
import {
  complement_ranges,
  to_minutes,
  to_range_minutes,
} from "../../helpers/complementTimeRanges";
import { getNow } from "../../helpers/time";
import type { TQueueInSchedule } from "../../types/Response";

const INNER_RADIUS = 60;
const OUTER_RADIUS = 150;

type TScheduleGraphProps = {
  data: TQueueInSchedule[];
  queue: number;
  colorScheme?: "dark" | "light";
  markActive?: boolean;
  showDurations?: boolean;
};

export const ScheduleGraph: FC<TScheduleGraphProps> = ({
  data,
  queue,
  markActive,
}) => {
  const COLORS = ["#00C49F", "#ff5542"];

  const originalRanges = data;
  const invertedRanges = complement_ranges(data);

  const combined = [];
  const maxLen = Math.max(originalRanges.length, invertedRanges.length);
  for (let i = 0; i < maxLen; i++) {
    if (originalRanges[i]) combined.push({ ...originalRanges[i], type: 1 });
    if (invertedRanges[i]) combined.push({ ...invertedRanges[i], type: 0 });
  }

  const chartData = combined.map((r) => ({
    name: `${r.from} - ${r.to}`,
    value: to_range_minutes(r.from, r.to),
    from: to_minutes(r.from),
    to: to_minutes(r.to),
    color: COLORS[r.type],
  }));

  const activeIndex = useMemo(() => {
    if (!markActive || !chartData?.length) {
      return -1;
    }

    const now = getNow();

    return chartData.findIndex(
      (item) =>
        item.from <= now && now < (item.to < item.from ? 1440 : item.to),
    );
  }, [chartData, markActive]);

  return (
    <div className="p-4 w-full flex justify-center relative">
      <PieChart width={380} height={380}>
        <Pie
          isAnimationActive={false}
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={OUTER_RADIUS}
          innerRadius={INNER_RADIUS}
          startAngle={90}
          endAngle={-270}
          activeIndex={activeIndex}
          label={({ name, midAngle, cx, cy, percent, index }) => {
            const RAD = Math.PI / 180;
            if (percent < 0.1) {
              const labelRadius = OUTER_RADIUS + 20;
              const x = cx + labelRadius * Math.cos(-midAngle * RAD);
              const y = cy + labelRadius * Math.sin(-midAngle * RAD);
              return (
                <text
                  x={x}
                  y={y}
                  fill={chartData[index].color}
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight="bold"
                  style={{
                    textDecoration:
                      activeIndex === index ? "underline" : "none",
                  }}
                >
                  {name}
                </text>
              );
            }
            // inside segment for larger slices
            const r = INNER_RADIUS + (OUTER_RADIUS - INNER_RADIUS) / 2;
            const x = cx + r * Math.cos(-midAngle * RAD);
            const y = cy + r * Math.sin(-midAngle * RAD);
            return (
              <text
                x={x}
                y={y}
                fill="#fff"
                textAnchor="middle"
                dominantBaseline="central"
                fontWeight="bold"
                fontSize={12}
                style={{
                  textDecoration: activeIndex === index ? "underline" : "none",
                }}
              >
                {name}
              </text>
            );
          }}
          labelLine={false}
          stroke="#242424"
          strokeWidth={3}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
          <Label
            value={queue}
            position="center"
            fontSize={32}
            fontWeight="bold"
          />
        </Pie>
      </PieChart>
    </div>
  );
};
