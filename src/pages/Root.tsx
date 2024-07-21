import { Outlet, Link } from "react-router-dom";
import { ActionIcon, AppShell, Flex } from "@mantine/core";
import { IconChartDonutFilled } from "@tabler/icons-react";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher/ColorModeSwitcher";
import { ScheduleFormModal } from "../components/ScheduleFormModal";
import { useScheduleFormModalStore } from "../stores/ScheduleFormModalStore.ts";
import iconImg from "/icon.png";
import { LanguageSelector } from "../components/LanguageSelector.tsx";

export const Root = () => {
  const { opened, open, close } = useScheduleFormModalStore();

  return (
    <AppShell padding="md" header={{ height: 60 }}>
      <AppShell.Header>
        <Flex justify="space-between" p={8}>
          <Link to="/">
            <img src={iconImg} alt="logo" width={42} />
          </Link>

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
            <LanguageSelector />
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
