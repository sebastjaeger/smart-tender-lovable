import { createFileRoute } from "@tanstack/react-router";
import { AccessDenied } from "../../components/AccessDenied";

export const Route = createFileRoute("/_auth/noaccess")({
  component: NoAccessPage,
});

function NoAccessPage() {
  return <AccessDenied />;
}
