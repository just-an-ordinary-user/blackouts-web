import { NoData } from "../components/NoData";
import { IconChartDonutFilled, IconChevronRight } from "@tabler/icons-react";
import { Box, Button, Flex, NavLink, Title } from "@mantine/core";
import { useFavorites } from "../hooks/useFavorites";
import { useScheduleFormModalStore } from "../stores/ScheduleFormModalStore";
import { Link } from "react-router-dom";

export const Home = () => {
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
      <Title order={3}>Addresses</Title>
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
            Get graphs
          </Button>
        </NoData>
      )}
    </Flex>
  );
};

// TODO: implement icon or color selection and customizing address item for a more convenient search particular item
