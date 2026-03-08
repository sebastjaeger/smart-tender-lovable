import { useMutation, useQueryClient } from "@tanstack/react-query";
import { meUpdateMe, meUpdateMePassword } from "../client";
import { useAuth } from "../contexts/AuthContext";
import { queryKeys } from "../lib/query-keys";
import { showSuccess } from "../utils/notifications";

/**
 * Hook for updating the current user's profile.
 */
export function useUpdateProfile() {
  const { handleApiError } = useAuth();
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (body: { full_name?: string | null }) => {
      const response = await meUpdateMe({ body });
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Success", "Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.me() });
    },
    onError: (error: Error) => {
      handleApiError(error, "Failed to update profile");
    },
  });

  return { updateProfile };
}

/**
 * Hook for updating the current user's password.
 */
export function useUpdatePassword() {
  const { handleApiError } = useAuth();

  const updatePassword = useMutation({
    mutationFn: async (body: {
      current_password: string;
      new_password: string;
    }) => {
      const response = await meUpdateMePassword({ body });
      return response.data;
    },
    onSuccess: () => {
      showSuccess("Success", "Password updated successfully");
    },
    onError: (error: Error) => {
      handleApiError(error, "Failed to update password");
    },
  });

  return { updatePassword };
}
