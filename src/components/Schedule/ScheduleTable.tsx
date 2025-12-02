import { Flex, Table, Text } from "@mantine/core";
import { type FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { complement_ranges } from "../../helpers/complementTimeRanges";
import { diffTime } from "../../helpers/time";
import type { TQueueInSchedule } from "../../types/Response";
import { NoData } from "../NoData";

type TScheduleTable = {
  data: TQueueInSchedule[];
  queue: number;
};

const COLORS = ["#00C49F", "#ff5542", "#FFBB28"];

export const ScheduleTable: FC<TScheduleTable> = ({ data, queue }) => {
  const { t } = useTranslation();
  const availableData = useMemo(
    () =>
      data
        ? complement_ranges(data).map(({ from, to }) => `${from} - ${to}`)
        : [],
    [data],
  );
  const unavailableData = useMemo(
    () => (data ? data.map(({ from, to }) => `${from} - ${to}`) : []),
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

          <Table withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t("available_label")}</Table.Th>
                <Table.Th>{t("duration_label")}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {availableData.map((it) => (
                <Table.Tr key={it}>
                  <Table.Td>
                    <Text
                      size="lg"
                      style={{ color: COLORS[0], fontWeight: "bold" }}
                    >
                      {it}
                    </Text>
                  </Table.Td>
                  <Table.Td w={160}>{diffTime(it)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Table withTableBorder mt={16}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t("unavailable_label")}</Table.Th>
                <Table.Th align="right">{t("duration_label")}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {unavailableData.map((it) => (
                <Table.Tr key={it}>
                  <Table.Td>
                    <Text
                      size="lg"
                      style={{ color: COLORS[1], fontWeight: "bold" }}
                    >
                      {it}
                    </Text>
                  </Table.Td>
                  <Table.Td w={160}>{diffTime(it)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </>
      )}
      {data?.length === 0 && <NoData text={t("no_data_for_period_label")} />}
    </Flex>
  );
};
