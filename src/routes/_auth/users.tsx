import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/users")({
  beforeLoad: ({ context }) => {
    // Only superusers can access any user management routes
    if (!context.auth.isSuperuser) {
      throw redirect({
        to: "/noaccess",
      });
    }
  },
  component: UsersLayout,
});

function UsersLayout() {
  return <Outlet />;
}
