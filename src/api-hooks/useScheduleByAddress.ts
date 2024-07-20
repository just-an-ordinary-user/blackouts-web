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
    const body = new FormData();
    body.append("address", address);
    body.append("userSearchChoice", "pob");
    body.append("accountNumber", "");

    return fetch("https://svitlo.oe.if.ua/GAVTurnOff/GavGroupByAccountNumber", {
      method: "POST",
      body: new URLSearchParams({
        address: address,
        userSearchChoice: "pob",
        accountNumber: "",
      }),
      // body,
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
