import { createFileRoute } from "@tanstack/react-router";
import { ProjectList } from "../../../components/ProjectList";

export const Route = createFileRoute("/_auth/projects/")({
  component: ProjectsPage,
});

function ProjectsPage() {
  return <ProjectList />;
}
