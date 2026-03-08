import { Stack, Tabs, Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { PasswordSettings } from "../../components/PasswordSettings";
import { ProfileSettings } from "../../components/ProfileSettings";

export const Route = createFileRoute("/_auth/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <Stack gap="lg">
      <Title order={2}>Settings</Title>
      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Tab value="profile">Profile</Tabs.Tab>
          <Tabs.Tab value="password">Password</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile" pt="md">
          <ProfileSettings />
        </Tabs.Panel>

        <Tabs.Panel value="password" pt="md">
          <PasswordSettings />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
