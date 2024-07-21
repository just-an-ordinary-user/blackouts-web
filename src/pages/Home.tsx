import { NoData } from "../components/NoData";
import { IconChartDonutFilled, IconChevronRight } from "@tabler/icons-react";
import { Box, Button, Flex, NavLink, Title } from "@mantine/core";
import { useFavorites } from "../hooks/useFavorites";
import { useScheduleFormModalStore } from "../stores/ScheduleFormModalStore";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Home = () => {
  const { t } = useTranslation();
  const { open } = useScheduleFormModalStore();
  const { getStorage } = useFavorites();

  const data = getStorage().addresses || [];

  const items = data.map((item) => (
    <NavLink
      component={Link}
      to={`/schedule?address=${item}`}
      key={item}
      label={item.split(",", 1)[0]}
      description={item.split(",").slice(1).join(", ")}
      rightSection={<IconChevronRight />}
    />
  ));

  return (
    <Flex direction="column">
      <Title order={3}>{t("addresses_title")}</Title>
      {data.length > 0 && <Box>{items}</Box>}
      {data.length === 0 && (
        <NoData>
          <Button
            variant="default"
            size="md"
            aria-label="Get graphs"
            leftSection={<IconChartDonutFilled stroke={1.5} />}
            onClick={open}
          >
            {t("get_graphs_button")}
          </Button>
        </NoData>
      )}
    </Flex>
  );
};

// TODO: implement icon or color selection and customizing address item for a more convenient search particular item
