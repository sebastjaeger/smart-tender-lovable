import { Center, Container } from "@mantine/core";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { SigninForm } from "../components/SigninForm";

interface SigninSearch {
  redirect?: string;
}

export const Route = createFileRoute("/signin")({
  validateSearch: (search: SigninSearch) => ({
    redirect: search.redirect || undefined,
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      // If there's a redirect parameter, use it; otherwise go to projects
      const redirectTo = search.redirect || "/projects";
      throw redirect({
        to: redirectTo,
      });
    }
  },
  component: Signin,
});

function Signin() {
  return (
    <Container size="xs">
      <Center h="100%">
        <SigninForm />
      </Center>
    </Container>
  );
}
