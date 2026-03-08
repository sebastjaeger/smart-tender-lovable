import { Card, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

/**
 * Simple reusable component for empty states across the application.
 * Provides consistent styling and layout for when lists or collections are empty.
 */
export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <Card withBorder>
      <Stack gap="md" align="center" py="xl">
        {icon}
        <Text size="lg" fw={500}>
          {title}
        </Text>
        <Text size="sm" c="dimmed" ta="center">
          {description}
        </Text>
      </Stack>
    </Card>
  );
}
