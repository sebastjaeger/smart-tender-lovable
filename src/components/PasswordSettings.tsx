import { Button, Card, Group, PasswordInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useUpdatePassword } from "../hooks/useProfileMutations";

interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export function PasswordSettings() {
  const { updatePassword } = useUpdatePassword();

  // Password form - always starts empty
  const passwordForm = useForm<PasswordFormData>({
    mode: "uncontrolled",
    initialValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    validate: {
      current_password: (value) =>
        value.length < 1 ? "Current password is required" : null,
      new_password: (value) =>
        value.length < 4 ? "New password must be at least 4 characters" : null,
      confirm_password: (value, values) =>
        value !== values.new_password ? "Passwords do not match" : null,
    },
  });

  const handleUpdatePassword = (values: PasswordFormData) => {
    updatePassword.mutate(
      {
        current_password: values.current_password,
        new_password: values.new_password,
      },
      {
        onSuccess: () => passwordForm.reset(),
      },
    );
  };

  return (
    <Card withBorder>
      <form onSubmit={passwordForm.onSubmit(handleUpdatePassword)}>
        <Stack>
          <PasswordInput
            label="Current Password"
            placeholder="Enter current password"
            required
            key={passwordForm.key("current_password")}
            {...passwordForm.getInputProps("current_password")}
          />
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
