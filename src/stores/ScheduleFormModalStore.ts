import { create } from "zustand";

type TScheduleFormModalStore = {
  opened: boolean;
  open(): void;
  close(): void;
  toggle(): void;
};

export const useScheduleFormModalStore = create<TScheduleFormModalStore>()(
  (set) => ({
    opened: false,
    open: () => set(() => ({ opened: true })),
    close: () => set(() => ({ opened: false })),
    toggle: () => set((state) => ({ opened: !state.opened })),
  }),
);
