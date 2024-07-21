import type { TRequestScheduleByAddressBody } from "../types/Request";
import type { TResponseData } from "../types/Response";
import { useMutation } from "react-query";

export function useScheduleByAddress() {
  const { isLoading, error, data, mutate } = useMutation<
    TResponseData,
    unknown,
    TRequestScheduleByAddressBody,
    unknown
  >("scheduleDataForAddress", ({ address }) => {
    return fetch("https://svitlo.oe.if.ua/GAVTurnOff/GavGroupByAccountNumber", {
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
