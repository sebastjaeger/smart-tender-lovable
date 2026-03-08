import { Card, Group, Skeleton, Stack } from "@mantine/core";

/**
 * Simple loading skeleton for page headers with title and action buttons
 */
export function HeaderSkeleton() {
  return (
    <Group justify="space-between">
      <Skeleton height={32} width={100} />
      <Group>
        <Skeleton height={36} width={100} />
        <Skeleton height={36} width={120} />
      </Group>
    </Group>
  );
}

/**
 * Simple loading skeleton for a list item with icon, text, and actions
 */
export function ListItemSkeleton() {
  return (
    <Group justify="space-between" p="xs">
      <Group gap="sm">
        <Skeleton height={16} width={16} />
        <div>
          <Skeleton height={16} width={120} />
          <Skeleton height={12} width={80} />
        </div>
      </Group>
      <Group gap="xs">
        <Skeleton height={24} width={60} />
        <Skeleton height={24} width={50} />
      </Group>
    </Group>
  );
}

/**
 * Loading skeleton for a list of items
 */
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Card withBorder>
      <Stack gap="xs">
        {Array.from({ length: count }, (_, i) => (
          <ListItemSkeleton key={`skeleton-${i + 1}`} />
        ))}
      </Stack>
    </Card>
  );
}

/**
 * Simple loading skeleton for basic content
 */
export function ContentSkeleton() {
  return (
    <Stack gap="md">
      <Skeleton height={40} />
      <Skeleton height={20} />
      <Skeleton height={100} />
    </Stack>
  );
}

/**
 * Loading skeleton for card-based items (like analysis cards)
 */
export function CardSkeleton() {
  return (
    <Card withBorder padding="lg">
      <Group justify="space-between">
        <Group gap="sm">
          <Skeleton height={24} width={24} />
          <div>
            <Skeleton height={20} width={80} />
            <Skeleton height={16} width={120} />
          </div>
        </Group>
        <Group gap="xs">
          <Skeleton height={32} width={60} />
          <Skeleton height={32} width={60} />
        </Group>
      </Group>
    </Card>
  );
}
