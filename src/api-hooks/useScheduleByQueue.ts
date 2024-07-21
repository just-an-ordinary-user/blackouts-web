import type { TRequestScheduleByQueueBody } from "../types/Request";
import type { TResponseData } from "../types/Response";
import { useMutation } from "react-query";

export function useScheduleByQueue() {
  const { isLoading, error, data, mutate } = useMutation<
    TResponseData,
    unknown,
    TRequestScheduleByQueueBody,
    unknown
  >("scheduleDataForQueue", ({ queue }) => {
    return fetch("https://svitlo.oe.if.ua/GAVTurnOff/GavByQueue", {
      method: "POST",
      body: `{"queue":${queue}}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Host: "svitlo.oe.if.ua",
      },
    }).then((res) => res.json());
  });

  return {
    schedulesByQueueData: data,
    schedulesByQueueError: error,
    isSchedulesByQueueLoading: isLoading,
    fetchSchedulesByQueue: mutate,
  };
}
