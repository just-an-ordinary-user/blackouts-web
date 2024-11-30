import { NoData } from "../components/NoData";
import { IconChartDonutFilled, IconChevronRight } from "@tabler/icons-react";
import {
  Box,
  Button,
  Flex,
  NavLink,
  SegmentedControl,
  Title,
} from "@mantine/core";
import { useFavorites } from "../hooks/useFavorites";
import { useScheduleFormModalStore } from "../stores/ScheduleFormModalStore";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useUserStore } from "../stores/UserStore";
import type { TStorageTab } from "../types/Storage";
import { useCloudFavorites } from "../hooks/useCloudFavorites";

export const Home = () => {
  const location = useLocation();
  const { user, setUser } = useUserStore();
  const { t } = useTranslation();
  const { open } = useScheduleFormModalStore();
  const { getStorage } = useFavorites();
  const [activeTab, setActiveTab] = useState("cloud");
  const [accountData, setAccountData] = useState<string[]>([]);

  const { getAllCloudFavorites } = useCloudFavorites();

  const data = useMemo(() => {
    if (activeTab === "cloud" && user) {
      return accountData || [];
    }
    return getStorage().addresses || [];
  }, [activeTab, user, accountData, getStorage]);

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

  const [tabs, setTabs] = useState<TStorageTab[]>([
    {
      value: "device",
      label: t("device_label"),
    },
    {
      value: "cloud",
      label: t("cloud_label"),
    },
  ]);

  useEffect(() => {
    setTabs([
      { ...tabs[0], label: t("device_label") },
      { ...tabs[1], label: t("cloud_label") },
    ]);
  }, [t]);

  useEffect(() => {
    onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser || null);
      setTabs([tabs[0], { ...tabs[1], disabled: !authUser }]);
      setActiveTab(authUser ? "cloud" : "device");
    });
  }, []);

  useEffect(() => {
    if (location.pathname === "/" && user) {
      getAllCloudFavorites().then((addresses) => {
        addresses?.length && setAccountData(addresses);
      });
    }
  }, [location, user]);

  return (
    <Flex direction="column">
      <Title order={3} mb={8} mx={12}>
        {t("addresses_title")}
      </Title>
      <SegmentedControl
        data={tabs}
        value={activeTab}
        onChange={setActiveTab}
        style={{ width: 300, margin: "auto" }}
      />
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
