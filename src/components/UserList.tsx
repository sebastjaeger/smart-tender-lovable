import {
  Badge,
  Button,
  Card,
  Group,
  LoadingOverlay,
  Modal,
  PasswordInput,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconSearch, IconUser } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { UserCreate } from "../client";
import { useAuth } from "../contexts/AuthContext";
import { useUserMutations } from "../hooks/useUserMutations";
import { useUsers } from "../hooks/useUserQueries";
import { validateEmail, validateNewPassword } from "../utils/validation";
import { EmptyState } from "./EmptyState";

interface UserCreateFormData {
  email: string;
  password: string;
  full_name: string;
}

export function UserList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 500);

  const {
    data: usersResponse,
    isError,
    isLoading,
  } = useUsers({ search: debouncedSearch || undefined });
  const users = usersResponse?.items;

  const { createUser } = useUserMutations();

  const createUserForm = useForm<UserCreateFormData>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      full_name: "",
    },
    validate: {
      email: validateEmail,
      password: validateNewPassword,
    },
  });

  const handleCreateUser = (values: UserCreateFormData) => {
    const userData: UserCreate = {
      email: values.email,
      password: values.password,
      full_name: values.full_name || null,
      is_superuser: false,
    };

    createUser.mutate(userData, {
      onSuccess: () => {
        close();
        createUserForm.reset();
      },
    });
  };

  const navigateToUser = (userId: number) => {
    if (user?.id === userId) {
      navigate({ to: "/settings" });
    } else {
      navigate({
        to: "/users/$userId/settings",
        params: { userId: userId.toString() },
      });
    }
  };

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Users</Title>
        <Button onClick={open}>Create User</Button>
      </Group>

      <TextInput
        placeholder="Search users by name or email..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />

      {isError ? (
        <Card withBorder>
          <Text color="red">Failed to load users. Please try again.</Text>
        </Card>
      ) : (
        <div style={{ position: "relative" }}>
          <LoadingOverlay visible={isLoading} />
          {users && users.length === 0 ? (
            <EmptyState
              icon={<IconUser size={32} color="gray" />}
              title="No users found"
              description="Create your first user to get started!"
            />
          ) : (
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Name</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {users?.map((userRow) => (
                  <Table.Tr
                    key={userRow.id}
                    onClick={() => navigateToUser(userRow.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <Table.Td>
                      <Group gap="xs">
                        <Text fw={500} size="sm">
                          {userRow.email}
                        </Text>
                        {userRow.is_superuser && (
                          <Badge size="xs" variant="light" color="gray">
                            admin
                          </Badge>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {userRow.full_name || "—"}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </div>
      )}

      <Modal opened={opened} onClose={close} title="Create New User">
        <form onSubmit={createUserForm.onSubmit(handleCreateUser)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="user@example.com"
              required
              key={createUserForm.key("email")}
              {...createUserForm.getInputProps("email")}
            />

            <TextInput
              label="Full Name"
              placeholder="Full name (optional)"
              key={createUserForm.key("full_name")}
              {...createUserForm.getInputProps("full_name")}
            />

            <PasswordInput
              label="Password"
              placeholder="Password"
              required
              key={createUserForm.key("password")}
              {...createUserForm.getInputProps("password")}
            />

            <Group justify="flex-end">
              <Button variant="light" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" loading={createUser.isPending}>
                Create User
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
