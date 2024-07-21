import { useMemo, type FC } from "react";
import type { TScheduleItem } from "../types/Response";
import { Center, Flex, Text } from "@mantine/core";
import { ScheduleGraph } from "./Schedule/ScheduleGraph";
import { ScheduleList } from "./Schedule/ScheduleList";
import { NoData } from "./NoData";
import { getToday, getTomorrow } from "../helpers/time";
import { squeezeScheduleData } from "../helpers/squeezeScheduleData";
import { normalizeScheduleData } from "../helpers/normalizeScheduleData";

type TScheduleViewProps = {
  address?: string;
  queue: number;
  activeView: "full-graph" | "short-graph" | "short-list";
  isDataSqueezed: boolean;
  todayScheduleData?: TScheduleItem[];
  tomorrowScheduleData?: TScheduleItem[];
  colorScheme: "dark" | "light";
  isDataPresent: boolean;
};

export const ScheduleView: FC<TScheduleViewProps> = ({
  address,
  queue,
  activeView,
  isDataSqueezed,
  todayScheduleData,
  tomorrowScheduleData,
  colorScheme,
  isDataPresent,
}) => {
  const todayDate = getToday();
  const tomorrowDate = getTomorrow();

  const scheduleToday = useMemo(
    () =>
      todayScheduleData
        ? isDataSqueezed
          ? squeezeScheduleData(todayScheduleData).map((entry) => ({
              ...entry,
              value: entry.to - entry.from,
            }))
          : normalizeScheduleData(todayScheduleData).map((entry) => ({
              ...entry,
              value: 1,
            }))
        : [],
    [todayScheduleData, isDataSqueezed],
  );

  const scheduleTomorrow = useMemo(
    () =>
      tomorrowScheduleData
        ? isDataSqueezed
          ? squeezeScheduleData(tomorrowScheduleData).map((entry) => ({
              ...entry,
              value: entry.to - entry.from,
            }))
          : normalizeScheduleData(tomorrowScheduleData).map((entry) => ({
              ...entry,
              value: 1,
            }))
        : [],
    [tomorrowScheduleData, isDataSqueezed],
  );

  return (
    <>
      {address && (
        <Center mt={8}>
          <Text size="xl">{address}</Text>
        </Center>
      )}

      {isDataPresent && (
        <Flex direction="column" align="center">
          {activeView !== "short-list" && (
            <>
              <Center mt={8}>
                <Text size="xl">Today: {todayDate}</Text>
              </Center>
              <ScheduleGraph
                data={scheduleToday}
                markActive
                showDurations={isDataSqueezed}
                queue={queue}
                colorScheme={colorScheme}
              />
            </>
          )}

          {activeView !== "short-list" && (
            <>
              <Center mt={8}>
                <Text size="xl">Tomorrow: {tomorrowDate}</Text>
              </Center>
              <ScheduleGraph
                data={scheduleTomorrow}
                queue={queue}
                showDurations={isDataSqueezed}
                colorScheme={colorScheme}
              />
            </>
          )}

          {activeView === "short-list" && (
            <>
              <Center mt={8}>
                <Text size="xl">Today: {todayDate}</Text>
              </Center>
              <ScheduleList data={scheduleToday} queue={queue} />
            </>
          )}

          {activeView === "short-list" && (
            <>
              <Center mt={8}>
                <Text size="xl">Tomorrow: {tomorrowDate}</Text>
              </Center>
              <ScheduleList data={scheduleTomorrow} queue={queue} />
            </>
          )}
        </Flex>
      )}
      {!isDataPresent && <NoData text="No data found for specified address" />}
    </>
  );
};
