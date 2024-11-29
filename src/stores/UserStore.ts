import type { User } from "firebase/auth";
import { create } from "zustand";

type TUserStore = {
  user: User | null;
  setUser(user: User | null): void;
};

export const useUserStore = create<TUserStore>()((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
}));
