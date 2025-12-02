import { useMutation } from "react-query";
import type { TRequestScheduleByAddressBody } from "../types/Request";
import type { TResponseData } from "../types/Response";

export function useScheduleByAddress() {
  const { isLoading, error, data, mutate } = useMutation<
    TResponseData,
    unknown,
    TRequestScheduleByAddressBody,
    unknown
  >("scheduleDataForAddress", ({ address }) => {
    return fetch("https://be-svitlo.oe.if.ua/schedule-by-search", {
      method: "POST",
      body: new URLSearchParams({
        address: address,
        userSearchChoice: "pob",
        accountNumber: "",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Host: "svitlo.oe.if.ua",
      },
    }).then((res) => res.json());
  });

  return {
    schedulesByAddressData: data,
    schedulesByAddressError: error,
    isSchedulesByAddressLoading: isLoading,
    fetchSchedulesByAddress: mutate,
  };
}
