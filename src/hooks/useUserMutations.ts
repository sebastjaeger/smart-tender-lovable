import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UserCreate, usersCreateUser, usersUpdateUser } from "../client";
import { useAuth } from "../contexts/AuthContext";
import { queryKeys } from "../lib/query-keys";
import { showSuccess } from "../utils/notifications";

/**
 * Hook for admin user mutations (create user, update user settings).
 */
export function useUserMutations() {
  const { handleApiError } = useAuth();
  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: async (userData: UserCreate) => {
      const response = await usersCreateUser({ body: userData });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      showSuccess("Success", "User created successfully");
    },
    onError: (error: Error) => {
      handleApiError(error, "Failed to create user");
    },
  });

  return { createUser };
}

/**
 * Hook for updating a specific user's admin settings.
 */
export function useUpdateUserAdmin(userId: number) {
  const { user: currentUser, handleApiError } = useAuth();
  const queryClient = useQueryClient();

  const updateUser = useMutation({
    mutationFn: async (body: {
      is_active?: boolean;
      is_superuser?: boolean;
      has_llm_access?: boolean;
      bonus_analyses?: number;
    }) => {
      const response = await usersUpdateUser({
        path: { user_id: userId },
        body,
      });
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Success", "User settings updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(userId),
      });
    },
    onError: (error: Error) => {
      handleApiError(error, "Failed to update user settings");
    },
  });

  /**
   * Validate admin settings before submission.
   * Returns an error message string or null if valid.
   */
  const validateAdminUpdate = (values: {
    is_active: boolean;
    is_superuser: boolean;
  }): string | null => {
    if (currentUser?.id === userId && !values.is_active) {
      return "You cannot deactivate your own account";
    }
    if (currentUser?.id === userId && !values.is_superuser) {
      return "You cannot remove your own admin privileges";
    }
    return null;
  };

  return { updateUser, validateAdminUpdate, currentUserId: currentUser?.id };
}

/**
 * Hook for updating a specific user's profile (admin context).
 */
export function useUpdateUserProfile(userId: number) {
  const { handleApiError } = useAuth();
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (body: {
      full_name?: string | null;
      email?: string | null;
    }) => {
      const response = await usersUpdateUser({
        path: { user_id: userId },
        body,
      });
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Success", "User profile updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(userId),
      });
    },
    onError: (error: Error) => {
      handleApiError(error, "Failed to update user profile");
    },
  });

  return { updateProfile };
}

/**
 * Hook for updating a specific user's password (admin context).
 */
export function useUpdateUserPassword(userId: number) {
  const { handleApiError } = useAuth();
  const queryClient = useQueryClient();

  const updatePassword = useMutation({
    mutationFn: async (newPassword: string) => {
      const response = await usersUpdateUser({
        path: { user_id: userId },
        body: { password: newPassword },
      });
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Success", "User password updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(userId),
      });
    },
    onError: (error: Error) => {
      handleApiError(error, "Failed to update user password");
    },
  });

  return { updatePassword };
}
