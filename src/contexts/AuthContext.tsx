import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type BodyLoginLoginAccessToken,
  loginLoginAccessToken,
  loginRegister,
  meReadMe,
  type User,
  type UserCreate,
} from "../client";
import { useApiErrorHandler } from "../hooks/useApiErrorHandler";
import {
  getToken,
  isLoggedIn,
  removeToken,
  setToken,
} from "../lib/auth-storage";
import { queryKeys } from "../lib/query-keys";

export interface AuthContext {
  isAuthenticated: boolean;
  isSuperuser: boolean;
  accessToken: string | null;
  user: User | null;
  loginMutation: ReturnType<
    typeof useMutation<void, Error, BodyLoginLoginAccessToken>
  >;
  signUpMutation: ReturnType<typeof useMutation<User, Error, UserCreate>>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isBackendReachable: boolean;
  handleApiError: (error: Error, title?: string) => void;
  markBackendReachable: () => void;
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(() => !!getToken());
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    // Mark that we're logging out to suppress error notifications
    setIsLoggingOut(true);
    // Update local state first to prevent new queries from starting
    setIsAuth(false);
    // Remove token immediately to prevent interceptor from adding auth headers
    removeToken();
    // Then cancel all in-flight queries
    await queryClient.cancelQueries();
    // Clear cache
    await queryClient.invalidateQueries({ queryKey: queryKeys.me() });
    await queryClient.resetQueries({ queryKey: queryKeys.me() });
    queryClient.clear();
    // Reset logging out flag after a short delay to ensure all cleanup is done
    setTimeout(() => setIsLoggingOut(false), 100);
  }, [queryClient]);

  const { handleApiError, isBackendReachable, markBackendReachable } =
    useApiErrorHandler({
      onUnauthorized: logout,
      isSuppressed: isLoggingOut,
    });

  // Get user data
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<User | null, Error>({
    queryKey: queryKeys.me(),
    queryFn: async () => {
      const response = await meReadMe();
      return response.data || null;
    },
    enabled: isLoggedIn(),
    retry: false,
  });

  // Handle errors from the me query
  useEffect(() => {
    if (isError && error) {
      handleApiError(error, "Failed to fetch user data");
    }
  }, [isError, error, handleApiError]);

  const loginMutation = useMutation<void, Error, BodyLoginLoginAccessToken>({
    mutationFn: async (data: BodyLoginLoginAccessToken) => {
      const response = await loginLoginAccessToken({ body: data });
      if (response.data?.access_token) {
        setToken(response.data.access_token);
        setIsAuth(true);
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.me() }),
    onError: (err: Error) => {
      handleApiError(err, "Sign in failed");
    },
  });

  const signUpMutation = useMutation<User, Error, UserCreate>({
    mutationFn: async (data: UserCreate) => {
      const response = await loginRegister({ body: data });
      if (!response.data) {
        throw new Error("Failed to create account");
      }
      return response.data;
    },
    onError: (err: Error) => {
      handleApiError(err, "Sign up failed");
    },
  });

  const value = {
    isAuthenticated: isAuth,
    isSuperuser: !!user?.is_superuser,
    accessToken: getToken(),
    loginMutation,
    signUpMutation,
    logout,
    user: user ?? null,
    isLoading,
    isBackendReachable,
    handleApiError,
    markBackendReachable,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
