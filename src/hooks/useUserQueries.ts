import { usersGetUser, usersGetUserStatistics, usersGetUsers } from "../client";
import { isLoggedIn } from "../lib/auth-storage";
import { queryKeys } from "../lib/query-keys";
import { useQueryWithErrorHandling } from "./useQueryWithErrorHandling";

/**
 * Hook for fetching users (profile data only).
 * By default returns all users; pass search to filter, or limit/offset to paginate.
 */
export function useUsers(options?: {
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const { search, limit, offset } = options ?? {};
  return useQueryWithErrorHandling({
    queryKey: queryKeys.users.search(search ?? undefined),
    queryFn: async () => {
      const response = await usersGetUsers({
        query: {
          ...(search && { search }),
          ...(limit !== undefined && { limit }),
          ...(offset !== undefined && { offset }),
        },
      });
      return response.data;
    },
    enabled: isLoggedIn(),
    errorMessage: "Failed to load users",
    notifyOnError: false,
  });
}

/**
 * Hook for fetching a specific user by ID (profile data only)
 */
export function useUser(userId: number) {
  return useQueryWithErrorHandling({
    queryKey: queryKeys.users.detail(userId),
    queryFn: async () => {
      const response = await usersGetUser({
        path: { user_id: userId },
      });
      return response.data;
    },
    enabled: isLoggedIn(),
    errorMessage: "Failed to load user",
    notifyOnError: false,
  });
}

/**
 * Hook for fetching statistics for a specific user (statistical data only)
 */
export function useUserStatistics(userId: number) {
  return useQueryWithErrorHandling({
    queryKey: queryKeys.users.statistics(userId),
    queryFn: async () => {
      const response = await usersGetUserStatistics({
        path: { user_id: userId },
      });
      return response.data;
    },
    enabled: isLoggedIn(),
    errorMessage: "Failed to load user statistics",
    notifyOnError: false,
  });
}

/**
 * Hook for fetching users by IDs (superuser only)
 */
export function useUsersByIds(userIds: number[]) {
  return useQueryWithErrorHandling({
    queryKey: queryKeys.users.byIds(userIds),
    queryFn: async () => {
      const response = await usersGetUsers({
        query: { user_ids: userIds.join(",") },
      });
      return response.data;
    },
    enabled: userIds.length > 0 && isLoggedIn(),
    errorMessage: "Failed to load users",
    notifyOnError: false,
  });
}

/**
 * Hook for fetching users by email addresses (superuser only)
 */
export function useUsersByEmails(emails: string[]) {
  return useQueryWithErrorHandling({
    queryKey: queryKeys.users.byEmails(emails),
    queryFn: async () => {
      const response = await usersGetUsers({
        query: { emails: emails.join(",") },
      });
      return response.data;
    },
    enabled: emails.length > 0 && isLoggedIn(),
    errorMessage: "Failed to load users",
    notifyOnError: false,
  });
}
