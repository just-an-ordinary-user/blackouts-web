export type TScheduleItem = {
  hour: number;
  electricity: number;
};

export type TScheduleNormalizedItem = TScheduleItem & {
  hours: string;
  from: number;
  to: number;
};

export type TDayData = {
  scheduleApprovedSince: string;
  hoursList: TScheduleItem[];
};

export type TCurrentData = {
  note: string;
  hasQueue: "yes" | "many" | "no";
  queue: number;
  subqueue: number;
  possibleQueues?: string[];
};

export type TGraphsData = {
  today?: TDayData;
  tomorrow?: TDayData;
};

export type TResponseData = {
  current: TCurrentData;
  graphs?: TGraphsData;
  showFutureDateUntil: string;
};
