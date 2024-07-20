import { useMemo, type FC } from "react";
import type { TScheduleNormalizedItem } from "../../types/Response";
import { Flex, Text } from "@mantine/core";

type TScheduleList = {
  data: TScheduleNormalizedItem[];
  queue: number;
};

const COLORS = ["#00C49F", "#ff5542", "#FFBB28"];

export const ScheduleList: FC<TScheduleList> = ({ data }) => {
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
      <Flex gap={8}>
        <Text size="lg">Electricity available at:</Text>{" "}
        <Text size="lg" style={{ color: COLORS[0], fontWeight: "bold" }}>
          {availableData}
        </Text>
      </Flex>
      <Flex gap={8}>
        <Text size="lg">Electricity unavailable at:</Text>{" "}
        <Text size="lg" style={{ color: COLORS[1], fontWeight: "bold" }}>
          {unavailableData}
        </Text>
      </Flex>
      {undefinedData.length > 0 && (
        <Flex gap={8}>
          <Text size="lg">Electricity undefined at:</Text>{" "}
          <Text size="lg" style={{ color: COLORS[2], fontWeight: "bold" }}>
            {undefinedData}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};
