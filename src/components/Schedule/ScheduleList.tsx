import { useMemo, type FC } from "react";
import type { TScheduleNormalizedItem } from "../../types/Response";
import { Flex, Text } from "@mantine/core";
import { NoData } from "../NoData";
import { useTranslation } from "react-i18next";

type TScheduleList = {
  data: TScheduleNormalizedItem[];
  queue: number;
};

const COLORS = ["#00C49F", "#ff5542", "#FFBB28"];

export const ScheduleList: FC<TScheduleList> = ({ data }) => {
  const { t } = useTranslation();
  const availableData = useMemo(
    () =>
      data
        .filter(({ electricity }) => electricity === 0)
        .map(({ hours }) => hours)
        .join(", "),
    [data],
  );
  const unavailableData = useMemo(
    () =>
      data
        .filter(({ electricity }) => electricity === 1)
        .map(({ hours }) => hours)
        .join(", "),
    [data],
  );
  const undefinedData = useMemo(
    () =>
      data
        .filter(({ electricity }) => electricity === 2)
        .map(({ hours }) => hours)
        .join(", "),
    [data],
  );

  return (
    <Flex direction="column">
      {data?.length > 0 && (
        <>
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
          {undefinedData.length > 0 && (
            <Flex gap={8} justify="center">
              <Text size="lg" style={{ color: COLORS[2], fontWeight: "bold" }}>
                {undefinedData}
              </Text>
            </Flex>
          )}
        </>
      )}
      {data?.length === 0 && <NoData text={t("no_data_for_period_label")} />}
    </Flex>
  );
};
