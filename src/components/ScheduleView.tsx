import { useMemo, type FC } from "react";
import type { TScheduleItem } from "../types/Response";
import { Center, Flex, Text } from "@mantine/core";
import { ScheduleGraph } from "./Schedule/ScheduleGraph";
import { ScheduleList } from "./Schedule/ScheduleList";
import { NoData } from "./NoData";
import { getToday, getTomorrow } from "../helpers/time";
import { squeezeScheduleData } from "../helpers/squeezeScheduleData";
import { normalizeScheduleData } from "../helpers/normalizeScheduleData";
import { useTranslation } from "react-i18next";

type TScheduleViewProps = {
  address?: string;
  queue: number;
  activeView: "full-graph" | "short-graph" | "short-list";
  isDataSqueezed: boolean;
  todayScheduleData?: TScheduleItem[];
  tomorrowScheduleData?: TScheduleItem[];
  colorScheme: "dark" | "light";
  isDataPresent: boolean;
  todayPublishedAt?: string;
  tomorrowPublishedAt?: string;
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
  todayPublishedAt,
  tomorrowPublishedAt,
}) => {
  const { t } = useTranslation();
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
                <Text size="xl">
                  {t("today_label")}: {todayDate}
                </Text>
              </Center>
              <ScheduleGraph
                data={scheduleToday}
                markActive
                showDurations={isDataSqueezed}
                queue={queue}
                colorScheme={colorScheme}
              />
              {todayPublishedAt && (
                <Center mt={8}>
                  <Text size="sm">
                    {t("published_label")}: {todayPublishedAt}
                  </Text>
                </Center>
              )}
            </>
          )}

          {activeView !== "short-list" && (
            <>
              <Center mt={32}>
                <Text size="xl">
                  {t("tomorrow_label")}: {tomorrowDate}
                </Text>
              </Center>
              <ScheduleGraph
                data={scheduleTomorrow}
                queue={queue}
                showDurations={isDataSqueezed}
                colorScheme={colorScheme}
              />
              {tomorrowPublishedAt && (
                <Center mt={8}>
                  <Text size="sm">
                    {t("published_label")}: {tomorrowPublishedAt}
                  </Text>
                </Center>
              )}
            </>
          )}

          {activeView === "short-list" && (
            <>
              <Center mt={8}>
                <Text size="xl">
                  {t("today_label")}: {todayDate}
                </Text>
              </Center>
              <ScheduleList data={scheduleToday} queue={queue} />
              {todayPublishedAt && (
                <Center mt={8}>
                  <Text size="sm">
                    {t("published_label")}: {todayPublishedAt}
                  </Text>
                </Center>
              )}
            </>
          )}

          {activeView === "short-list" && (
            <>
              <Center mt={32}>
                <Text size="xl">
                  {t("tomorrow_label")}: {tomorrowDate}
                </Text>
              </Center>
              <ScheduleList data={scheduleTomorrow} queue={queue} />
              {tomorrowPublishedAt && (
                <Center mt={8}>
                  <Text size="sm">
                    {t("published_label")}: {tomorrowPublishedAt}
                  </Text>
                </Center>
              )}
            </>
          )}
        </Flex>
      )}
      {!isDataPresent && <NoData text={t("no_data_for_address_label")} />}
    </>
  );
};
