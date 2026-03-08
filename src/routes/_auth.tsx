import { Container } from "@mantine/core";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context, location }) => {
    // If user data is still loading, let the route load and handle it in the component
    if (context.auth.isLoading) {
      return;
    }

    // If backend is unreachable, redirect to service unavailable page
    if (!context.auth.isBackendReachable) {
      throw redirect({
        to: "/service-unavailable",
      });
    }

    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/signin",
        search: {
          redirect: location.pathname,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <Container size="xl">
      <Outlet />
    </Container>
  );
}
