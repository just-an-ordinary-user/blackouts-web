import type { FC } from "react";
import { Flex, Text } from "@mantine/core";

type TNoData = {
  text?: string;
};

export const NoData: FC<TNoData> = ({ text = "No data" }) => {
  return (
    <Flex direction="column" gap={16} align="center" mt={96}>
      <img src="/logo.png" alt="no-data" width={256} />
      <Text size="xl">{text}</Text>
    </Flex>
  );
};
