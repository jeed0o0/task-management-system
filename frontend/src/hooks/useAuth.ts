import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { getCurrentUser } from "../api/auth";

export function useAuth() {
  const { isAuthenticated, loading, init, login, logout, user, setUser } =
    useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    init();
  }, [init]);

  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: isAuthenticated && !user,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (userData) setUser(userData);
  }, [userData, setUser]);

  const requireAuth = () => {
    if (!loading && !isAuthenticated) {
      init();
    }
  };

  return {
    isAuthenticated,
    loading,
    user,
    login,
    logout,
    requireAuth,
    navigate,
  };
}
