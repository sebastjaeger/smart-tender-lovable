import {
  Alert,
  Button,
  Center,
  Container,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { createFileRoute, redirect } from "@tanstack/react-router";
import type { PasswordRecoveryRequest } from "../client";
import { useForgotPassword } from "../hooks/useAuthActions";
import { validateEmail } from "../utils/validation";

export const Route = createFileRoute("/forgot-password")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: ForgotPassword,
});

function ForgotPassword() {
  const { isSubmitting, isSuccess, error, recoverPassword } =
    useForgotPassword();

  const form = useForm<PasswordRecoveryRequest>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
    },
    validate: {
      email: validateEmail,
    },
  });

  const handleSubmit = (values: PasswordRecoveryRequest) => {
    recoverPassword(values);
  };

  return (
    <Container size="xs">
      <Center h="100%">
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Title order={2} ta="center" mb="lg">
            Reset your password
          </Title>

          {isSuccess ? (
            <Stack>
              <Text>
                We've sent you a password reset link. Please check your inbox.
              </Text>
              <Text ta="center" size="sm" c="dimmed">
                <Text component="a" href="/signin" c="blue" td="underline">
                  Back to sign in
                </Text>
              </Text>
            </Stack>
          ) : (
            <>
              <Text size="sm" c="dimmed" mb="lg">
                Enter your email address and we'll send you a link to reset your
                password.
              </Text>

              {error && (
                <Alert color="red" mb="md" variant="light">
                  {error}
                </Alert>
              )}

              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                  <TextInput
                    label="Email"
                    placeholder="your-email@example.com"
                    required
                    key={form.key("email")}
                    {...form.getInputProps("email")}
                  />

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    fullWidth
                    mt="md"
                  >
                    Send Reset Link
                  </Button>
                </Stack>
              </form>

              <Text ta="center" mt="md" size="sm" c="dimmed">
                Remember your password?{" "}
                <Text component="a" href="/signin" c="blue" td="underline">
                  Sign in here
                </Text>
              </Text>
            </>
          )}
        </Paper>
      </Center>
    </Container>
  );
}
