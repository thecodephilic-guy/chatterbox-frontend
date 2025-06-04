import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Data = {
  id: string;
  name: string;
  username: string;
  gender: string;
  lastSeen: string | null;
  updatedAt: string;
  createdAt: string;
  deletedAt: string | null;
};

type State = {
  data: Data | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

type Actions = {
  setAuth: (data: Data, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (message: string | null) => void;
};

export const useAuthStore = create<State & Actions>()(
  persist<State & Actions>(
    (set) => ({
      //defining initial state:
      data: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      //defining actions:
      setAuth: (data, token) =>
        set({
          data,
          token,
          isAuthenticated: true,
          loading: false,
          error: null,
        }),
      logout: () =>
        set({
          data: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        }),
      setLoading: (loading) => set({ loading }),
      setError: (message) => set({ error: message }),
    }),
    {
      name: "chatterbox-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
