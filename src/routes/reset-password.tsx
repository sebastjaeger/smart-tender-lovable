import {
  Alert,
  Button,
  Center,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useResetPassword } from "../hooks/useAuthActions";
import {
  validateConfirmPassword,
  validateNewPassword,
} from "../utils/validation";

interface ResetPasswordSearch {
  token?: string;
}

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: ResetPasswordSearch) => ({
    token: search.token || undefined,
  }),
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: ResetPassword,
});

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

function ResetPassword() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const { isSubmitting, error, resetPassword } = useResetPassword(token);

  const form = useForm<ResetPasswordFormData>({
    mode: "uncontrolled",
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      newPassword: validateNewPassword,
      confirmPassword: (value, values) =>
        validateConfirmPassword(value, values.newPassword),
    },
  });

  const handleSubmit = async (values: ResetPasswordFormData) => {
    const success = await resetPassword(values.newPassword);
    if (success) {
      navigate({ to: "/signin", search: { redirect: undefined } });
    }
  };

  // Show error if no token is provided
  if (!token) {
    return (
      <Container size="xs">
        <Center h="100%">
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Title order={2} ta="center" mb="lg">
              Invalid Reset Link
            </Title>
            <Alert color="red" variant="light" mb="md">
              This password reset link is invalid or has expired.
            </Alert>
            <Text ta="center" size="sm" c="dimmed">
              <Text
                component="a"
                href="/forgot-password"
                c="blue"
                td="underline"
              >
                Request a new reset link
              </Text>
            </Text>
          </Paper>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xs">
      <Center h="100%">
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Title order={2} ta="center" mb="lg">
            Set New Password
          </Title>

          <Text size="sm" c="dimmed" mb="lg">
            Enter your new password below.
          </Text>

          {error && (
            <Alert color="red" mb="md" variant="light">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <PasswordInput
                label="New Password"
                placeholder="Enter new password"
                required
                key={form.key("newPassword")}
                {...form.getInputProps("newPassword")}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm new password"
                required
                key={form.key("confirmPassword")}
                {...form.getInputProps("confirmPassword")}
              />

              <Button type="submit" loading={isSubmitting} fullWidth mt="md">
                Reset Password
              </Button>
            </Stack>
          </form>

          <Text ta="center" mt="md" size="sm" c="dimmed">
            Remember your password?{" "}
            <Text component="a" href="/signin" c="blue" td="underline">
              Sign in here
            </Text>
          </Text>
        </Paper>
      </Center>
    </Container>
  );
}
