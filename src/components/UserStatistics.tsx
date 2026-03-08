import { Card, Group, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useUserStatistics } from "../hooks/useUserQueries";

interface UserStatisticsProps {
  userId: number;
}

export function UserStatistics({ userId }: UserStatisticsProps) {
  const { data: stats, isLoading, isError } = useUserStatistics(userId);

  if (isError) {
    return (
      <Card withBorder>
        <Text c="red">Failed to load statistics. Please try again.</Text>
      </Card>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={isLoading} />
      <Card withBorder>
        <Stack>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Projects
            </Text>
            <Text fw={500}>{stats?.project_count ?? 0}</Text>
          </Group>

          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Analyses
            </Text>
            <Text fw={500}>{stats?.analysis_count ?? 0}</Text>
          </Group>
        </Stack>
      </Card>
    </div>
  );
}
