import { AppShell, Container } from "@mantine/core";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Header } from "../components/Header";
import type { AuthContext } from "../contexts/AuthContext";

export interface RouterContext {
  auth: AuthContext;
}

function RootComponent() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <Outlet />
        </Container>
      </AppShell.Main>

      {import.meta.env.DEV && (
        <>
          <TanStackRouterDevtools />
          <ReactQueryDevtools />
        </>
      )}
    </AppShell>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <RootComponent />,
});
