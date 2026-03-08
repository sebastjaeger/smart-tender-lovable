import { createFileRoute } from "@tanstack/react-router";
import { UserList } from "../../../components/UserList";

export const Route = createFileRoute("/_auth/users/")({
  component: UsersPage,
});

function UsersPage() {
  return <UserList />;
}
