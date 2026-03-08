import { Button, Card, Group, PasswordInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useUpdateUserPassword } from "../hooks/useUserMutations";

interface PasswordFormData {
  new_password: string;
  confirm_password: string;
}

interface UserPasswordSettingsProps {
  userId: number;
}

// TODO: Merge with PasswordSettings
export function UserPasswordSettings({ userId }: UserPasswordSettingsProps) {
  const { updatePassword } = useUpdateUserPassword(userId);

  // Password form - always starts empty
  const passwordForm = useForm<PasswordFormData>({
    mode: "uncontrolled",
    initialValues: {
      new_password: "",
      confirm_password: "",
    },
    validate: {
      new_password: (value) =>
        value.length < 4 ? "New password must be at least 4 characters" : null,
      confirm_password: (value, values) =>
        value !== values.new_password ? "Passwords do not match" : null,
    },
  });

  const handleUpdatePassword = (values: PasswordFormData) => {
    updatePassword.mutate(values.new_password, {
      onSuccess: () => passwordForm.reset(),
    });
  };

  return (
    <Card withBorder>
      <form onSubmit={passwordForm.onSubmit(handleUpdatePassword)}>
        <Stack>
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            required
            key={passwordForm.key("new_password")}
            {...passwordForm.getInputProps("new_password")}
          />
          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm new password"
            required
            key={passwordForm.key("confirm_password")}
            {...passwordForm.getInputProps("confirm_password")}
          />
          <Group justify="flex-end">
            <Button type="submit" loading={updatePassword.isPending}>
              Update Password
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
