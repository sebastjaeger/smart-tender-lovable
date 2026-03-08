import { Badge } from "@mantine/core";
import type { AnalysisStatus } from "../client";

interface StatusBadgeProps {
  status: AnalysisStatus | undefined;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

function getStatusBadgeColor(status: AnalysisStatus | undefined) {
  switch (status) {
    case "pending":
      return "gray";
    case "in_progress":
      return "blue";
    case "completed":
      return "green";
    case "failed":
      return "red";
    default:
      return "gray";
  }
}

function getStatusLabel(status: AnalysisStatus | undefined) {
  switch (status) {
    case "pending":
      return "Pending";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    default:
      return "Unknown";
  }
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  return (
    <Badge color={getStatusBadgeColor(status)} variant="light" size={size}>
      {getStatusLabel(status)}
    </Badge>
  );
}
