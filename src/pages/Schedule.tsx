import { useEffect, useMemo, useState } from "react";
import { useScheduleByAddress } from "../api-hooks/useScheduleByAddress";
import { squeezeScheduleData } from "../helpers/squeezeScheduleData";
import { normalizeScheduleData } from "../helpers/normalizeScheduleData";
import { ScheduleGraph } from "../components/Schedule/ScheduleGraph";
import {
  ActionIcon,
  Center,
  Flex,
  LoadingOverlay,
  useComputedColorScheme,
  Text,
} from "@mantine/core";
import { IconChevronLeft, IconStar, IconStarFilled } from "@tabler/icons-react";
import {
  ModeSelector,
  type TModeValue,
} from "../components/ModeSelector/ModeSelector";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NoData } from "../components/NoData";
import { useFavorites } from "../hooks/useFavorites";

export const Schedule = () => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TModeValue>("full-graph");

  const colorScheme = useComputedColorScheme();

  const {
    fetchSchedulesByAddress,
    schedulesByAddressData,
    isSchedulesByAddressLoading,
  } = useScheduleByAddress();

  const { toggleFavorite, checkIsFavorite } = useFavorites();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function toggleFavorites() {
    toggleFavorite({ address });
    setIsFavorite(!!checkIsFavorite({ address }));
  }

  const goBack = () => navigate("/");

  const isDataSqueezed = useMemo(
    () => activeTab === "short-graph",
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

  const scheduleToday = useMemo(
    () =>
      schedulesByAddressData?.graphs?.today?.hoursList
        ? isDataSqueezed
          ? squeezeScheduleData(
              schedulesByAddressData.graphs.today.hoursList,
            ).map((entry) => ({
              ...entry,
              value: entry.to - entry.from,
            }))
          : normalizeScheduleData(
              schedulesByAddressData.graphs.today.hoursList,
            ).map((entry) => ({ ...entry, value: 1 }))
        : [],
    [schedulesByAddressData, isDataSqueezed],
  );

  const scheduleTomorrow = useMemo(
    () =>
      schedulesByAddressData?.graphs?.tomorrow?.hoursList
        ? isDataSqueezed
          ? squeezeScheduleData(
              schedulesByAddressData.graphs.tomorrow.hoursList,
            )
          : normalizeScheduleData(
              schedulesByAddressData.graphs.tomorrow.hoursList,
            )
        : [],
    [schedulesByAddressData, isDataSqueezed],
  );

  const isNoData = useMemo(
    () =>
      !schedulesByAddressData?.graphs?.today?.hoursList.length &&
      !schedulesByAddressData?.graphs?.tomorrow?.hoursList.length,
    [schedulesByAddressData],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies(checkIsFavorite): causes effect recalling infinitely
  useEffect(() => {
    const address = searchParams.get("address");
    if (address) {
      setAddress(address);
      setIsFavorite(!!checkIsFavorite({ address }));
      fetchSchedulesByAddress({ address });
    }
  }, [fetchSchedulesByAddress, searchParams]);

  return (
    <div>
      <LoadingOverlay
        visible={isSchedulesByAddressLoading}
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

      <Center mt={8}>
        <Text size="xl">{address}</Text>
      </Center>

      <Flex direction="column" align="center">
        {schedulesByAddressData?.graphs?.today?.hoursList && (
          <ScheduleGraph
            data={scheduleToday}
            markActive
            showDurations={isDataSqueezed}
            queue={queue}
            colorScheme={colorScheme}
          />
        )}

        {schedulesByAddressData?.graphs?.tomorrow?.hoursList && (
          <ScheduleGraph
            data={scheduleTomorrow}
            queue={queue}
            showDurations={isDataSqueezed}
            colorScheme={colorScheme}
          />
        )}

        {isNoData && <NoData text="No data found for specified address" />}
      </Flex>
    </div>
  );
};

// TODO: handle error, maybe with toast
// TODO: add support of fetching schedules by queue
// TODO: consider to optimize data handling
