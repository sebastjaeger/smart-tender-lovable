import { Stack, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home")({
  component: Home,
});

function Home() {
  return (
    <Stack align="center" mt="xl">
      <Title order={3}>Welcome to SmartTender.ai</Title>
    </Stack>
  );
}
