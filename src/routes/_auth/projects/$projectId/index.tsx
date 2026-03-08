import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetail } from "../../../../components/ProjectDetail";

export const Route = createFileRoute("/_auth/projects/$projectId/")({
  component: ProjectDetailPage,
  validateSearch: (search: Record<string, unknown>) => ({
    tab: search.tab as string | undefined,
  }),
});

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const { tab } = Route.useSearch();
  return <ProjectDetail projectId={projectId} activeTab={tab || "files"} />;
}
