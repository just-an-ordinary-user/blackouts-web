import { useMutation } from "react-query";
import type { TRequestScheduleByQueueBody } from "../types/Request";
import type { TSchedule } from "../types/Response";

export function useScheduleByQueue() {
  const { isLoading, error, data, mutate } = useMutation<
    TSchedule[],
    unknown,
    TRequestScheduleByQueueBody,
    unknown
  >("scheduleDataForQueue", ({ queue }) => {
    return fetch(
      `https://be-svitlo.oe.if.ua/schedule-by-queue?queue=${queue}`,
      {
        method: "GET",
        headers: {
          Host: "svitlo.oe.if.ua",
        },
      },
    ).then((res) => res.json());
  });

  return {
    schedulesByQueueData: data,
    schedulesByQueueError: error,
    isSchedulesByQueueLoading: isLoading,
    fetchSchedulesByQueue: mutate,
  };
}
