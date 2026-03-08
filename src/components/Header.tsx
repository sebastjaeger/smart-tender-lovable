import {
  Avatar,
  Button,
  Container,
  Group,
  Menu,
  NavLink,
  Text,
  Title,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import {
  IconChevronDown,
  IconFolder,
  IconLogout,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { isSignupDisabled } from "../utils/config";

export function Header() {
  const theme = useMantineTheme();
  const { isAuthenticated, user, logout, isSuperuser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    // The auth state is already updated, so we can navigate immediately
    navigate({ to: "/signin", search: { redirect: undefined } });
    // showSuccess("Signed out", "You have been successfully signed out.");
  };

  return (
    <Container size="lg" h="100%">
      <Group h="100%" justify="space-between" px="md">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Title order={4} style={{ cursor: "pointer" }}>
            SmartTender.ai
          </Title>
        </Link>
        <Group>
          {!isAuthenticated && (
            <Button.Group>
              <Link
                to="/signin"
                search={{ redirect: undefined }}
                style={{ textDecoration: "none" }}
              >
                {({ isActive }) => (
                  <NavLink
                    component="div"
                    label="Sign In"
                    active={isActive}
                    variant="subtle"
                    style={{ borderRadius: 4 }}
                  />
                )}
              </Link>
              {!isSignupDisabled() && (
                <Link
                  to="/signup"
                  search={{ redirect: undefined }}
                  style={{ textDecoration: "none" }}
                >
                  {({ isActive }) => (
                    <NavLink
                      component="div"
                      label="Sign Up"
                      active={isActive}
                      variant="subtle"
                      style={{ borderRadius: 4 }}
                    />
                  )}
                </Link>
              )}
            </Button.Group>
          )}
          {isAuthenticated && isSuperuser && (
            <Menu shadow="md" width={200} trigger="hover">
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="xs" align="center">
                    <Text size="sm">Admin Menu</Text>
                    <IconChevronDown size={12} color={theme.colors.gray[6]} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconFolder size={14} />}
                  onClick={() => navigate({ to: "/projects" })}
                >
                  Projects
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconUsers size={14} />}
                  onClick={() => navigate({ to: "/users" })}
                >
                  Users
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
          {isAuthenticated && user && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap={7}>
                    <Avatar size={30} radius="xl" />
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconSettings size={14} />}
                  onClick={() => navigate({ to: "/settings" })}
                >
                  Settings
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconLogout size={14} />}
                  onClick={handleLogout}
                  color="red"
                >
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Group>
    </Container>
  );
}
