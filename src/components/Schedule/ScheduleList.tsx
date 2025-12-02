import { Flex, Text } from "@mantine/core";
import { type FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { complement_ranges } from "../../helpers/complementTimeRanges";
import type { TQueueInSchedule } from "../../types/Response";
import { NoData } from "../NoData";

type TScheduleList = {
  data: TQueueInSchedule[];
  queue: number;
};

const COLORS = ["#00C49F", "#ff5542", "#FFBB28"];

export const ScheduleList: FC<TScheduleList> = ({ data, queue }) => {
  const { t } = useTranslation();
  const availableData = useMemo(
    () =>
      data &&
      complement_ranges(data)
        .map(({ from, to }) => `${from} - ${to}`)
        .join(", "),
    [data],
  );
  const unavailableData = useMemo(
    () => data.map(({ from, to }) => `${from} - ${to}`).join(", "),
    [data],
  );

  return (
    <Flex direction="column">
      {data?.length > 0 && (
        <>
          <Flex gap={8} justify="center">
            <Text size="md">
              {t("queue_label")}: {queue}
            </Text>
          </Flex>
          <Flex gap={8} justify="center">
            <Text size="lg" style={{ color: COLORS[0], fontWeight: "bold" }}>
              {availableData}
            </Text>
          </Flex>
          <Flex gap={8} justify="center">
            <Text size="lg" style={{ color: COLORS[1], fontWeight: "bold" }}>
              {unavailableData}
            </Text>
          </Flex>
        </>
      )}
      {data?.length === 0 && <NoData text={t("no_data_for_period_label")} />}
    </Flex>
  );
};
