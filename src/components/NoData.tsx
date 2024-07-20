import type { FC, ReactNode } from "react";
import { Flex, Text } from "@mantine/core";
import logoImg from "/logo.png";

type TNoData = {
  text?: string;
  children?: ReactNode;
};

export const NoData: FC<TNoData> = ({ text = "No data", children }) => {
  return (
    <Flex direction="column" gap={16} align="center" mt={96}>
      <img src={logoImg} alt="no-data" width={256} />
      <Text size="xl">{text}</Text>
      <div>{children}</div>
    </Flex>
  );
};
