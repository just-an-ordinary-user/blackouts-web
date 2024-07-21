import { useEffect, useMemo, useState } from "react";
import { useScheduleByAddress } from "../api-hooks/useScheduleByAddress";
import {
  ActionIcon,
  Flex,
  LoadingOverlay,
  useComputedColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronLeft, IconStar, IconStarFilled } from "@tabler/icons-react";
import {
  ModeSelector,
  type TModeValue,
} from "../components/ModeSelector/ModeSelector";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SelectQueueModal } from "../components/SelectQueueModal";
import { ScheduleView } from "../components/ScheduleView";
import { useScheduleByQueue } from "../api-hooks/useScheduleByQueue";
import { useFavorites } from "../hooks/useFavorites";

export const Schedule = () => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
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

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function toggleFavorites() {
    toggleFavorite({ address });
    setIsFavorite(!!checkIsFavorite({ address }));
  }

  const goBack = () => navigate("/");

  const isDataSqueezed = useMemo(
    () => activeTab === "short-graph" || activeTab === "short-list",
    [activeTab],
  );

  const queue = useMemo(
    () =>
      schedulesByAddressData?.current.queue &&
      schedulesByAddressData?.current.subqueue
        ? schedulesByAddressData?.current.queue +
          schedulesByAddressData?.current.subqueue * 0.1
        : -1,
    [schedulesByAddressData],
  );

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

  // biome-ignore lint/correctness/useExhaustiveDependencies(checkIsFavorite): causes effect recalling infinitely
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
        <ActionIcon
          variant="default"
          size="xl"
          aria-label="Add to favorites"
          onClick={toggleFavorites}
        >
          {isFavorite ? <IconStarFilled /> : <IconStar />}
        </ActionIcon>
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
