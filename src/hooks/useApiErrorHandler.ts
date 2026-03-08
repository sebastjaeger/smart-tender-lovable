import { useCallback, useState } from "react";
import { ApiError } from "../utils/errors";
import { showError } from "../utils/notifications";

interface ApiErrorHandlerOptions {
  /** Called when we receive a 401. */
  onUnauthorized: () => void;
  /** Whether to suppress all error notifications (e.g. during logout). */
  isSuppressed: boolean;
}

/**
 * Hook that centralises API error handling logic.
 * Tracks backend reachability and delegates auth failures upward.
 */
export function useApiErrorHandler({
  onUnauthorized,
  isSuppressed,
}: ApiErrorHandlerOptions) {
  const [isBackendReachable, setIsBackendReachable] = useState(true);

  const handleApiError = useCallback(
    (error: Error, title?: string) => {
      if (isSuppressed) return;

      // Network error (no status code) → backend unreachable
      if (!(error instanceof ApiError) || !error.statusCode) {
        setIsBackendReachable(false);
        showError(
          "Service Unavailable",
          "The service is currently unavailable. Please try again later.",
        );
        return;
      }

      // Backend is reachable if we got an HTTP response
      setIsBackendReachable(true);

      if (error.statusCode === 401) {
        showError("Authentication Failed", error.message);
        onUnauthorized();
        return;
      }

      // Inactive account: token was valid but user has been deactivated
      if (
        error.statusCode === 403 &&
        error.message?.toLowerCase().includes("inactive")
      ) {
        showError("Account deactivated", error.message);
        onUnauthorized();
        return;
      }

      showError(title || "Operation Failed", error);
    },
    [onUnauthorized, isSuppressed],
  );

  const markBackendReachable = useCallback(() => {
    setIsBackendReachable(true);
  }, []);

  return { handleApiError, isBackendReachable, markBackendReachable };
}
