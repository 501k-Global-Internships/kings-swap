import { devtools, persist } from "zustand/middleware";
import { create } from ".";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const useUserStore = create()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setUser: (user) => set({ user }),
        setToken: (token) => set({ token }),
        initialize: (user, token) =>
          set({ user, token, isAuthenticated: !!token }),
      }),
      { name: "ks::user" }
    )
  )
);
