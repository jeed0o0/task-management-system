import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role, User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  init: () => void;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
}

const MOCK_USER: User = {
  id: "admin-1",
  keycloakId: "mock-keycloak-id",
  email: "admin@taskmanager.com",
  username: "Admin User",
  role: Role.ADMIN,
  avatar: undefined,
  createdAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      init: () => {
        // Auto-login for development
        set({ user: MOCK_USER, isAuthenticated: true, loading: false });
      },

      login: (user) => {
        set({ user, isAuthenticated: true, loading: false });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, loading: false });
      },

      setUser: (user) => {
        set({ user });
      },

      setLoading: (loading) => {
        set({ loading });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
