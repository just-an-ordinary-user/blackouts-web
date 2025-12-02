import { Tabs } from "@mantine/core";
import { IconChartPie, IconList, IconTable } from "@tabler/icons-react";
import type { FC } from "react";
import classes from "./ModeSelector.module.css";

export type TModeValue = "table" | "pie" | "list";

type TModeSelectorProps = {
  value: TModeValue;
  setValue(value: TModeValue): void;
};

export const ModeSelector: FC<TModeSelectorProps> = ({ value, setValue }) => {
  return (
    <Tabs
      variant="unstyled"
      value={value}
      onChange={setValue as (value: string | null) => void}
      classNames={classes}
    >
      <Tabs.List grow>
        <Tabs.Tab value="table">
          <IconTable width={18} height={18} />
        </Tabs.Tab>
        <Tabs.Tab value="pie">
          <IconChartPie width={18} height={18} />
        </Tabs.Tab>
        <Tabs.Tab value="list">
          <IconList width={18} height={18} />
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};

// TODO: May be make component more common but it may affect layout on small screens. To consider.
