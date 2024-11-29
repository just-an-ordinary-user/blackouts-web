import { useEffect, useMemo, useState } from "react";
import { useScheduleByAddress } from "../api-hooks/useScheduleByAddress";
import {
  ActionIcon,
  Flex,
  LoadingOverlay,
  Menu,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconStar,
  IconStarFilled,
  IconCloudStar,
  IconDevicesStar,
} from "@tabler/icons-react";
import {
  ModeSelector,
  type TModeValue,
} from "../components/ModeSelector/ModeSelector";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SelectQueueModal } from "../components/SelectQueueModal";
import { ScheduleView } from "../components/ScheduleView";
import { useScheduleByQueue } from "../api-hooks/useScheduleByQueue";
import { useFavorites } from "../hooks/useFavorites";
import { useUserStore } from "../stores/UserStore";
import { useCloudFavorites } from "../hooks/useCloudFavorites";
import { useTranslation } from "react-i18next";

export const Schedule = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isCloudFavorite, setIsCloudFavorite] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TModeValue>("full-graph");
  const [queues, setQueues] = useState<string[]>([]);
  const [opened, { open, close }] = useDisclosure();

  const colorScheme = useComputedColorScheme();

  const {
    fetchSchedulesByAddress,
    schedulesByAddressData,
    isSchedulesByAddressLoading,
  } = useScheduleByAddress();
  const {
    fetchSchedulesByQueue,
    schedulesByQueueData,
    isSchedulesByQueueLoading,
  } = useScheduleByQueue();

  const { toggleFavorite, checkIsFavorite } = useFavorites();
  const { getCloudFavorite, toggleCloudFavorite } = useCloudFavorites();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function toggleLocalFavorites() {
    toggleFavorite({ address });
    setIsFavorite(!!checkIsFavorite({ address }));
  }

  async function toggleCloudFavorites() {
    await toggleCloudFavorite(address);
    setIsCloudFavorite(!!(await getCloudFavorite(address)));
  }

  const goBack = () => navigate("/");

  const isDataSqueezed = useMemo(
    () => activeTab === "short-graph" || activeTab === "short-list",
    [activeTab],
  );

  const queue = useMemo(() => {
    const queue =
      schedulesByQueueData?.current.queue ||
      schedulesByAddressData?.current.queue ||
      0;
    const subqueue =
      schedulesByQueueData?.current.subqueue ||
      schedulesByAddressData?.current.subqueue ||
      0;

    if (queue >= 0 && subqueue >= 0) {
      return queue + subqueue * 0.1;
    }
    return -1;
  }, [schedulesByAddressData, schedulesByQueueData]);

  const todayScheduleData = useMemo(() => {
    return (
      schedulesByAddressData?.graphs?.today?.hoursList ||
      schedulesByQueueData?.graphs?.today?.hoursList
    );
  }, [schedulesByAddressData, schedulesByQueueData]);

  const tomorrowScheduleData = useMemo(() => {
    return (
      schedulesByAddressData?.graphs?.tomorrow?.hoursList ||
      schedulesByQueueData?.graphs?.tomorrow?.hoursList
    );
  }, [schedulesByAddressData, schedulesByQueueData]);

  useEffect(() => {
    if (
      schedulesByAddressData?.current?.hasQueue === "many" &&
      schedulesByAddressData?.current?.possibleQueues?.length
    ) {
      setQueues(schedulesByAddressData.current.possibleQueues);
      open();
    }
  }, [schedulesByAddressData, open]);

  useEffect(() => {
    const address = searchParams.get("address");
    const queue = searchParams.get("queue");
    if (queue) {
      fetchSchedulesByQueue({ queue });
      address && setAddress(address);
    } else if (address) {
      setAddress(address);
      setIsFavorite(!!checkIsFavorite({ address }));
      fetchSchedulesByAddress({ address });
    }
  }, [fetchSchedulesByAddress, fetchSchedulesByQueue, searchParams]);

  useEffect(() => {
    const address = searchParams.get("address");
    const queue = searchParams.get("queue");
    if (queue) {
      fetchSchedulesByQueue({ queue });
      address && setAddress(address);
    } else if (address) {
      setAddress(address);
      getCloudFavorite(address).then((addr) => {
        setIsCloudFavorite(!!addr);
      });
      fetchSchedulesByAddress({ address });
    }
  }, [user, searchParams, fetchSchedulesByAddress, fetchSchedulesByQueue]);

  return (
    <div>
      <LoadingOverlay
        visible={isSchedulesByAddressLoading || isSchedulesByQueueLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Flex justify="space-between" align="center">
        <ActionIcon
          variant="default"
          size="xl"
          aria-label="Back to home"
          onClick={goBack}
        >
          <IconChevronLeft />
        </ActionIcon>
        <ModeSelector value={activeTab} setValue={setActiveTab} />

        <Menu shadow="md" width={220}>
          <Menu.Target>
            <ActionIcon
              variant="default"
              size="xl"
              aria-label="Add to favorites"
            >
              {isFavorite || isCloudFavorite ? (
                <IconStarFilled />
              ) : (
                <IconStar />
              )}
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{t("save_address_label")}</Menu.Label>
            <Menu.Item
              leftSection={
                <IconCloudStar style={{ width: rem(14), height: rem(14) }} />
              }
              disabled={!user}
              onClick={toggleCloudFavorites}
            >
              {isCloudFavorite
                ? t("remove_from_cloud_item")
                : t("save_to_cloud_item")}
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconDevicesStar style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={toggleLocalFavorites}
            >
              {isFavorite
                ? t("remove_from_device_item")
                : t("save_to_device_item")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>

      <ScheduleView
        activeView={activeTab}
        colorScheme={colorScheme}
        isDataSqueezed={isDataSqueezed}
        queue={queue}
        address={address}
        todayScheduleData={todayScheduleData}
        tomorrowScheduleData={tomorrowScheduleData}
        isDataPresent={
          !!schedulesByAddressData?.graphs || !!schedulesByQueueData?.graphs
        }
        todayPublishedAt={
          schedulesByAddressData?.graphs?.today?.scheduleApprovedSince ||
          schedulesByQueueData?.graphs?.today?.scheduleApprovedSince
        }
        tomorrowPublishedAt={
          schedulesByAddressData?.graphs?.tomorrow?.scheduleApprovedSince ||
          schedulesByQueueData?.graphs?.tomorrow?.scheduleApprovedSince
        }
      />

      <SelectQueueModal
        opened={opened}
        open={open}
        close={close}
        address={address}
        queues={queues}
      />
    </div>
  );
};

// TODO: handle error, maybe with toast
// TODO: consider to optimize and refactor data handling
// TODO: ScheduleView accepts to much props. Needs to be reduced with passing all data together as it is or use zustand
