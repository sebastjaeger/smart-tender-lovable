import { Stack, Tabs, Title } from "@mantine/core";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BackLink } from "../../../../components/BackLink";
import { UserAdminSettings } from "../../../../components/UserAdminSettings";
import { UserPasswordSettings } from "../../../../components/UserPasswordSettings";
import { UserProfileSettings } from "../../../../components/UserProfileSettings";
import { UserStatistics } from "../../../../components/UserStatistics";

export const Route = createFileRoute("/_auth/users/$userId/settings")({
  component: UserSettingsPage,
});

function UserSettingsPage() {
  const { userId } = Route.useParams();
  const navigate = useNavigate();

  return (
    <Stack gap="lg">
      <BackLink
        label="Back to users"
        onClick={() => navigate({ to: "/users" })}
      />

      <Title order={2}>User Settings</Title>
      <Tabs defaultValue="admin">
        <Tabs.List>
          <Tabs.Tab value="admin">Admin</Tabs.Tab>
          <Tabs.Tab value="profile">Profile</Tabs.Tab>
          <Tabs.Tab value="password">Password</Tabs.Tab>
          <Tabs.Tab value="statistics">Statistics</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="admin" pt="md">
          <UserAdminSettings userId={Number(userId)} />
        </Tabs.Panel>

        <Tabs.Panel value="profile" pt="md">
          <UserProfileSettings userId={Number(userId)} />
        </Tabs.Panel>

        <Tabs.Panel value="password" pt="md">
          <UserPasswordSettings userId={Number(userId)} />
        </Tabs.Panel>

        <Tabs.Panel value="statistics" pt="md">
          <UserStatistics userId={Number(userId)} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
