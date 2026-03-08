import {
  Alert,
  Button,
  Center,
  Container,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useVerifyEmail } from "../hooks/useAuthActions";

interface VerifyEmailSearch {
  token?: string;
}

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: VerifyEmailSearch) => ({
    token: search.token || undefined,
  }),
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: VerifyEmail,
});

function VerifyEmail() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const { status, error, verify } = useVerifyEmail(token);

  useEffect(() => {
    verify();
  }, [verify]);

  // Show error if no token is provided
  if (!token) {
    return (
      <Container size="xs">
        <Center h="100%">
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Title order={2} ta="center" mb="lg">
              Invalid Verification Link
            </Title>
            <Alert
              color="red"
              variant="light"
              mb="md"
              icon={<IconX size={16} />}
            >
              This email verification link is invalid or missing.
            </Alert>
            <Text ta="center" size="sm" c="dimmed">
              Please check the link in your email or{" "}
              <Text component="a" href="/signup" c="blue" td="underline">
                sign up again
              </Text>
              .
            </Text>
          </Paper>
        </Center>
      </Container>
    );
  }

  // Show loading state while verifying
  if (status === "pending" || status === "verifying") {
    return (
      <Container size="xs">
        <Center h="100%">
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Title order={2} ta="center">
                Verifying Your Email
              </Title>
              <Text size="sm" c="dimmed" ta="center">
                Please wait while we verify your email address...
              </Text>
            </Stack>
          </Paper>
        </Center>
      </Container>
    );
  }

  // Show success state
  if (status === "success") {
    return (
      <Container size="xs">
        <Center h="100%">
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Stack align="center" gap="md">
              <IconCheck size={48} color="var(--mantine-color-green-6)" />
              <Title order={2} ta="center">
                Email Verified!
              </Title>
              <Text size="sm" c="dimmed" ta="center">
                Your email has been successfully verified. You can now sign in
                to your account.
              </Text>
              <Button
                fullWidth
                mt="md"
                onClick={() =>
                  navigate({ to: "/signin", search: { redirect: undefined } })
                }
              >
                Sign In
              </Button>
            </Stack>
          </Paper>
        </Center>
      </Container>
    );
  }

  // Show error state
  return (
    <Container size="xs">
      <Center h="100%">
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Stack align="center" gap="md">
            <IconX size={48} color="var(--mantine-color-red-6)" />
            <Title order={2} ta="center">
              Verification Failed
            </Title>
            <Alert color="red" variant="light" w="100%">
              {error}
            </Alert>
            <Text size="sm" c="dimmed" ta="center">
              If you continue to have issues, please try signing up again or
              contact support.
            </Text>
            <Button
              variant="light"
              fullWidth
              mt="md"
              onClick={() => navigate({ to: "/signup" })}
            >
              Back to Sign Up
            </Button>
          </Stack>
        </Paper>
      </Center>
    </Container>
  );
}
