import type { TScheduleNormalizedItem } from "../../types/Response";
import type { ActiveShape } from "recharts/types/util/types";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import { useMemo, type FC } from "react";
import { Cell, Label, Pie, PieChart, Sector } from "recharts";
import { NoData } from "../NoData";
import { useTranslation } from "react-i18next";

type TScheduleItemAdditionalFields = {
  value: number;
  isActive: boolean;
  colorScheme: "dark" | "light";
  showDurations: boolean;
};

const COLORS = ["#00C49F", "#ff5542", "#FFBB28"];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  name,
  value,
  isActive,
  showDurations,
  colorScheme,
}: PieSectorDataItem &
  TScheduleNormalizedItem &
  TScheduleItemAdditionalFields) => {
  const radius1 =
    innerRadius + (outerRadius - innerRadius) * (isActive ? 1 : 0.7);
  const x1 = cx + radius1 * Math.cos(-midAngle * RADIAN);
  const y1 = cy + radius1 * Math.sin(-midAngle * RADIAN);

  const radius2 =
    innerRadius + (outerRadius - innerRadius) * (isActive ? 0.5 : 0.25);
  const x2 = cx + radius2 * Math.cos(-midAngle * RADIAN);
  const y2 = cy + radius2 * Math.sin(-midAngle * RADIAN);

  return (
    <>
      <text
        x={x1}
        y={y1}
        style={{ pointerEvents: "none" }}
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
        fontSize={12}
        fill={colorScheme === "dark" ? "white" : "black"}
      >
        {`${name}`}
      </text>
      {showDurations && (
        <text
          x={x2}
          y={y2}
          style={{ pointerEvents: "none" }}
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight="bold"
          fontSize={12}
          fill={colorScheme === "dark" ? "white" : "black"}
        >
          {`${value}`}
        </text>
      )}
    </>
  );
};

type TScheduleProps = {
  data: TScheduleNormalizedItem[];
  queue: number;
  colorScheme?: "dark" | "light";
  markActive?: boolean;
  showDurations?: boolean;
};

const renderActiveShape: ActiveShape<
  PieSectorDataItem & TScheduleNormalizedItem
> = ({
  cx = 0,
  cy = 0,
  innerRadius = 0,
  outerRadius = 0,
  midAngle = 0,
  startAngle,
  endAngle,
  electricity,
}: PieSectorDataItem & TScheduleNormalizedItem) => {
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius - 150) * cos;
  const sy = cy + (outerRadius - 150) * sin;
  return (
    <Sector
      cx={sx}
      cy={sy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={COLORS[electricity]}
    />
  );
};

export const ScheduleGraph: FC<TScheduleProps> = ({
  data,
  queue,
  colorScheme = "dark",
  markActive = false,
  showDurations = false,
}) => {
  const { t } = useTranslation();
  const activeIndex = useMemo(() => {
    if (!markActive) {
      return -1;
    }
    const now = new Date().getHours();
    return data.findIndex((item) => item.from <= now && now < item.to);
  }, [data, markActive]);

  //  TODO: come up with something better than just mess up with data
  const schedule = useMemo(
    () =>
      data.map((entry, idx) => ({
        ...entry,
        isActive: idx === activeIndex,
        showDurations,
        colorScheme,
      })),
    [data, activeIndex, showDurations, colorScheme],
  );

  return (
    <div>
      {schedule?.length > 0 && (
        <PieChart width={380} height={380} style={{ outline: "none" }}>
          <Pie
            data={schedule}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={170}
            labelLine={false}
            stroke=""
            dataKey="value"
            nameKey="hours"
            startAngle={90}
            endAngle={-360}
            paddingAngle={2}
            label={renderCustomizedLabel}
            activeIndex={activeIndex}
            activeShape={renderActiveShape as ActiveShape<PieSectorDataItem>}
            isAnimationActive={!!colorScheme}
          >
            {data.map((entry) => (
              <Cell
                key={`cell-${entry.hour}`}
                fill={COLORS[entry.electricity]}
              />
            ))}
            <Label
              value={queue}
              position="center"
              fontSize={32}
              fontWeight="bold"
            />
          </Pie>
        </PieChart>
      )}
      {schedule?.length === 0 && (
        <NoData text={t("no_data_for_period_label")} />
      )}
    </div>
  );
};
