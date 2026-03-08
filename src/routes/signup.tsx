import { Center, Container } from "@mantine/core";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignupForm } from "../components/SignupForm";

export const Route = createFileRoute("/signup")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: Signup,
});

function Signup() {
  return (
    <Container size="xs">
      <Center h="100%">
        <SignupForm />
      </Center>
    </Container>
  );
}
