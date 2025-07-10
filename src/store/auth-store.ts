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
  isAuthenticated: boolean;
  loading: boolean;
  authError: string | null;
};

type Actions = {
  setAuth: (data: Data) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setAuthError: (message: string | null) => void;
};

export const useAuthStore = create<State & Actions>()(
  persist<State & Actions>(
    (set) => ({
      //defining initial state:
      data: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      authError: null,

      //defining actions:
      setAuth: (data) =>
        set({
          data,
          isAuthenticated: true,
          loading: false,
          authError: null,
        }),

      logout: () =>
        set({
          data: null,
          isAuthenticated: false,
          loading: false,
          authError: null,
        }),

      setLoading: (loading) => set({ loading }),
      
      setAuthError: (message) => set({ authError: message }),
    }),
    {
      name: "chatterbox-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
