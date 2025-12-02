// export type TScheduleItem = {
//   hour: string;
//   electricity: number;
// };

// export type TScheduleNormalizedItem = TScheduleItem & {
//   hours: string;
//   from: number | null;
//   to: number | null;
// };

// export type TDayData = {
//   scheduleApprovedSince: string;
//   hoursList: TScheduleItem[];
// };

export type TCurrentData = {
  note: string;
  hasQueue: "yes" | "many" | "no";
  queue: number;
  subQueue: number;
  possibleQueues?: string[];
};

// export type TGraphsData = {
//   today?: TDayData;
//   tomorrow?: TDayData;
// };

export type TQueueInSchedule = {
  from: string;
  shutdownHours: string;
  status: number;
  to: string;
};

export type TQueue = Record<
  number, // queue
  TQueueInSchedule[]
>;

export type TSchedule = {
  createdAt: string;
  eventDate: string;
  queues: TQueue;
  scheduleApprovedSince: string;
};

export type TResponseData = {
  current: TCurrentData;
  schedule?: TSchedule[];
  showFutureDateUntil: string;
};
