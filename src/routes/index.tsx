import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/projects", search: { error: undefined } });
    }
    throw redirect({ to: "/signin", search: { redirect: undefined } });
  },
  component: () => <></>,
});
