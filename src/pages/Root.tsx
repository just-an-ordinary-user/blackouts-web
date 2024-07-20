import { ActionIcon, AppShell, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChartDonutFilled } from "@tabler/icons-react";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher/ColorModeSwitcher";
import { ScheduleFormModal } from "../components/ScheduleFormModal";
import { Outlet } from "react-router-dom";
import iconImg from "/icon.png";

export const Root = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header>
        <Flex justify="space-between" p={8}>
          <img src={iconImg} alt="logo" width={42} />

          <div>
            <ActionIcon
              variant="default"
              size="xl"
              aria-label="Toggle color scheme"
              mr={8}
              onClick={open}
            >
              <IconChartDonutFilled stroke={1.5} />
            </ActionIcon>
            <ColorModeSwitcher />
          </div>
        </Flex>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      <ScheduleFormModal opened={opened} open={open} close={close} />
    </AppShell>
  );
};
