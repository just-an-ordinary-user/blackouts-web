import type { FC } from "react";
import { Tabs } from "@mantine/core";
import { IconChartPie, IconChartDonut } from "@tabler/icons-react";
import classes from "./ModeSelector.module.css";

export type TModeValue = "full-graph" | "short-graph";

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
        <Tabs.Tab value="full-graph">
          <IconChartDonut width={18} height={18} />
        </Tabs.Tab>
        <Tabs.Tab value="short-graph">
          <IconChartPie width={18} height={18} />
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};

// TODO: May be make component more common but it may affect layout on small screens. To consider.
