import {
  Alert,
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMailCheck } from "@tabler/icons-react";
import { useState } from "react";
import type { BodyLoginLoginAccessToken } from "../client";
import { useAuth } from "../contexts/AuthContext";
import { useResendVerification } from "../hooks/useAuthActions";
import { isSignupDisabled } from "../utils/config";
import { ApiError } from "../utils/errors";
import { validateEmail, validateSigninPassword } from "../utils/validation";

interface SigninFormData {
  email: string;
  password: string;
}

export function SigninForm() {
  const [error, setError] = useState<string | null>(null);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const auth = useAuth();
  const { loginMutation, isLoading } = auth;
  const { isResending, resendSuccess, resendVerification } =
    useResendVerification();

  const form = useForm<SigninFormData>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: validateEmail,
      password: validateSigninPassword,
    },
  });

  const handleSubmit = (values: SigninFormData) => {
    setError(null);
    setEmailNotVerified(false);

    const loginData: BodyLoginLoginAccessToken = {
      username: values.email, // API expects username field, but we use email
      password: values.password,
      grant_type: "password",
    };

    loginMutation.mutate(loginData, {
      onSuccess: async () => {
        form.reset();
        // The signin route will automatically handle the redirect when the user becomes authenticated
      },
      onError: (err: Error) => {
        if (err instanceof ApiError && err.statusCode === 403) {
          if (err.message?.toLowerCase().includes("inactive")) {
            // setError(err.message || "Your account is inactive.");
          } else {
            setEmailNotVerified(true);
          }
        }
      },
    });
  };

  const handleResendVerification = () => {
    const email = form.getValues().email;
    resendVerification(email);
  };

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <Title order={2} ta="center" mb="lg">
        Sign in to your account
      </Title>

      {error && (
        <Alert color="red" mb="md" variant="light">
          {error}
        </Alert>
      )}

      {emailNotVerified && !resendSuccess && (
        <Alert
          color="blue"
          mb="md"
          variant="light"
          icon={<IconMailCheck size={16} />}
          title="Email verification required"
        >
          Please check your inbox and click the verification link before signing
          in. If you didn't receive the email, check your spam folder or{" "}
          <Anchor
            component="button"
            type="button"
            onClick={handleResendVerification}
            disabled={isResending}
            fz="inherit"
          >
            click here
          </Anchor>{" "}
          to request a new verification link.
        </Alert>
      )}

      {resendSuccess && (
        <Alert
          color="green"
          mb="md"
          variant="light"
          icon={<IconMailCheck size={16} />}
          title="Verification email sent"
        >
          A new verification link has been sent to your inbox.
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

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            key={form.key("password")}
            {...form.getInputProps("password")}
          />

          <Text ta="right" size="sm">
            <Text component="a" href="/forgot-password" c="blue" td="underline">
              Forgot password?
            </Text>
          </Text>

          <Button
            type="submit"
            loading={loginMutation.isPending || isLoading}
            fullWidth
            mt="md"
          >
            Sign In
          </Button>
        </Stack>
      </form>

      {!isSignupDisabled() && (
        <Text ta="center" mt="md" size="sm" c="dimmed">
          Don't have an account?{" "}
          <Text component="a" href="/signup" c="blue" td="underline">
            Sign up here
          </Text>
        </Text>
      )}
    </Paper>
  );
}
