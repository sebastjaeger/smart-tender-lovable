import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

/**
 * Simple wrapper around useQuery that automatically handles errors with the auth context.
 * This eliminates the repetitive pattern of manual error handling in every component.
 */
export function useQueryWithErrorHandling<TData = unknown, TError = Error>(
  options: UseQueryOptions<TData, TError> & {
    errorMessage?: string;
    notifyOnError?: boolean; // default false to avoid duplicate inline + toast
  },
): UseQueryResult<TData, TError> {
  const { handleApiError } = useAuth();
  const { errorMessage, notifyOnError = false, ...queryOptions } = options;

  const result = useQuery(queryOptions);

  // Automatically handle errors
  useEffect(() => {
    if (notifyOnError && result.isError && result.error) {
      handleApiError(result.error as unknown as Error, errorMessage);
    }
  }, [
    notifyOnError,
    result.isError,
    result.error,
    handleApiError,
    errorMessage,
  ]);

  return result;
}
