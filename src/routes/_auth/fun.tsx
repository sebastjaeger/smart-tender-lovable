import { Stack, Text, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/fun")({
  component: FunPage,
});

function FunPage() {
  return (
    <Stack align="center" mt="xl">
      <Title order={1}>Fun Page</Title>
      <Text size="lg" c="dimmed">
        This is a fun page!
      </Text>
    </Stack>
  );
}
