import {
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconMailCheck } from "@tabler/icons-react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import type { UserCreate } from "../client";
import { useAuth } from "../contexts/AuthContext";
import { showSuccess } from "../utils/notifications";
import {
  validateConfirmPassword,
  validateEmail,
  validateNewPassword,
} from "../utils/validation";

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
}

export function SignupForm() {
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const auth = useAuth();
  const router = useRouter();
  const { signUpMutation, isLoading } = auth;
  const navigate = useNavigate();

  const form = useForm<SignupFormData>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      full_name: "",
    },
    validate: {
      email: validateEmail,
      password: validateNewPassword,
      confirmPassword: (value, values) =>
        validateConfirmPassword(value, values.password),
    },
  });

  const handleSubmit = (values: SignupFormData) => {
    const userData: UserCreate = {
      email: values.email,
      password: values.password,
      full_name: values.full_name || null,
    };

    signUpMutation.mutate(userData, {
      onSuccess: async (user) => {
        form.reset();
        await router.invalidate();

        if (user.is_email_verified) {
          // Email verification not required, can sign in immediately
          showSuccess(
            "Welcome!",
            "Account created successfully. Please sign in to continue.",
          );
          navigate({ to: "/signin", search: { redirect: undefined } });
        } else {
          // Email verification required - show success state with instructions
          setRegisteredEmail(values.email);
        }
      },
    });
  };

  // Show email verification required message after successful signup
  if (registeredEmail) {
    return (
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Stack align="center" gap="md">
          <ThemeIcon size={64} radius="xl" color="blue" variant="light">
            <IconMailCheck size={36} />
          </ThemeIcon>

          <Title order={2} ta="center">
            Check your email
          </Title>

          <Text ta="center" c="dimmed" maw={350}>
            We've sent a verification link to:
          </Text>

          <Text fw={600} ta="center">
            {registeredEmail}
          </Text>

          <Text ta="center" c="dimmed" size="sm" maw={350}>
            Click the link in the email to verify your account. If you don't see
            it, check your spam folder.
          </Text>

          <Button
            variant="light"
            fullWidth
            mt="md"
            onClick={() =>
              navigate({ to: "/signin", search: { redirect: undefined } })
            }
          >
            Go to Sign In
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <Title order={2} ta="center" mb="lg">
        Create your account
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            key={form.key("email")}
            {...form.getInputProps("email")}
          />

          <TextInput
            label="Full Name"
            placeholder="Your full name (optional)"
            key={form.key("full_name")}
            {...form.getInputProps("full_name")}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            key={form.key("password")}
            {...form.getInputProps("password")}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            key={form.key("confirmPassword")}
            {...form.getInputProps("confirmPassword")}
          />

          <Button
            type="submit"
            loading={signUpMutation.isPending || isLoading}
            fullWidth
            mt="xl"
          >
            Create Account
          </Button>
        </Stack>
      </form>

      <Text ta="center" mt="md" size="sm" c="dimmed">
        Already have an account?{" "}
        <Text component="a" href="/signin" c="blue" td="underline">
          Sign in here
        </Text>
      </Text>
    </Paper>
  );
}
