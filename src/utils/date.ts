import { formatDistanceToNow } from "date-fns";

/**
 * Formats a date as a relative time string (e.g., "2 hours ago", "1 day ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}
