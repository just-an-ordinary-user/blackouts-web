import { Center, Flex, Text } from "@mantine/core";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { TSchedule } from "../types/Response";
// import { normalizeScheduleData } from "../helpers/normalizeScheduleData";
// import { squeezeScheduleData } from "../helpers/squeezeScheduleData";
// import { getToday, getTomorrow } from "../helpers/time";
// import type { TQueueInSchedule, TSchedule } from "../types/Response";
import type { TModeValue } from "./ModeSelector/ModeSelector";
import { NoData } from "./NoData";
import { ScheduleGraph } from "./Schedule/ScheduleGraph";
import { ScheduleList } from "./Schedule/ScheduleList";

type TScheduleViewProps = {
  address?: string;
  queue: number;
  activeView: TModeValue;
  data?: TSchedule[];
  colorScheme: "dark" | "light";
};

export const ScheduleView: FC<TScheduleViewProps> = ({
  address,
  queue,
  activeView,
  data,
  colorScheme,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {address && (
        <Center mt={8}>
          <Text size="xl">{address}</Text>
        </Center>
      )}

      {data?.length && (
        <Flex direction="column" align="center">
          {activeView === "pie" && (
            <>
              <Center mt={8}>
                <Text size="xl">
                  {t("today_label")}: {data[0].eventDate}
                </Text>
              </Center>
              <ScheduleGraph
                data={data[0].queues?.[queue]}
                markActive
                showDurations={true}
                queue={queue}
                colorScheme={colorScheme}
              />
              <Center mt={8}>
                <Text size="sm">
                  {t("published_label")}: {data[0].scheduleApprovedSince}
                </Text>
              </Center>
            </>
          )}

          {activeView === "pie" && data.length > 1 && (
            <>
              <Center mt={32}>
                <Text size="xl">
                  {t("tomorrow_label")}: {data[1].eventDate}
                </Text>
              </Center>
              <ScheduleGraph
                data={data[1].queues?.[queue]}
                queue={queue}
                showDurations={true}
                colorScheme={colorScheme}
              />
              <Center mt={8}>
                <Text size="sm">
                  {t("published_label")}: {data[1].scheduleApprovedSince}
                </Text>
              </Center>{" "}
            </>
          )}

          {activeView === "list" && (
            <>
              <Center mt={8}>
                <Text size="xl">
                  {t("today_label")}: {data[0].eventDate}
                </Text>
              </Center>
              <ScheduleList data={data[0].queues?.[queue]} queue={queue} />
              <Center mt={8}>
                <Text size="sm">
                  {t("published_label")}: {data[0].scheduleApprovedSince}
                </Text>
              </Center>
            </>
          )}

          {activeView === "list" && data.length > 1 && (
            <>
              <Center mt={32}>
                <Text size="xl">
                  {t("tomorrow_label")}: {data[1].eventDate}
                </Text>
              </Center>
              <ScheduleList data={data[1].queues?.[queue]} queue={queue} />
              <Center mt={8}>
                <Text size="sm">
                  {t("published_label")}: {data[1].scheduleApprovedSince}
                </Text>
              </Center>
            </>
          )}
        </Flex>
      )}
      {!data?.length && <NoData text={t("no_data_for_address_label")} />}
    </>
  );
};
