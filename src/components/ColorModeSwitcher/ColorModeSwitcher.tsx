import type { FC } from "react";
import cx from "clsx";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun, IconSunMoon } from "@tabler/icons-react";
import classes from "./ColorModeSwitcher.module.css";

export const ColorModeSwitcher: FC = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(
          colorScheme === "dark"
            ? "light"
            : colorScheme === "light"
              ? "auto"
              : "dark",
        )
      }
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
    >
      <IconSun
        className={cx({
          [classes.icon]: true,
          [classes.display]: colorScheme === "dark",
        })}
        stroke={1.5}
      />
      <IconMoon
        className={cx({
          [classes.icon]: true,
          [classes.display]: colorScheme === "light",
        })}
        stroke={1.5}
      />
      <IconSunMoon
        className={cx({
          [classes.icon]: true,
          [classes.display]: colorScheme === "auto",
        })}
        stroke={1.5}
      />
    </ActionIcon>
  );
};
