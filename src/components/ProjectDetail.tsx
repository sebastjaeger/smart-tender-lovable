import { Card, Group, Stack, Tabs, Text, Title } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { useProjectMutations } from "../hooks/useProjectMutations";
import { useProject } from "../hooks/useProjectQueries";
import { BackLink } from "./BackLink";
import { EditableText } from "./EditableText";
import { ContentSkeleton } from "./LoadingStates";
import { ProjectAnalyses } from "./ProjectAnalyses";
import { ProjectFiles } from "./ProjectFiles";

interface ProjectDetailProps {
  projectId: string;
  activeTab?: string;
}

export function ProjectDetail({
  projectId,
  activeTab = "files",
}: ProjectDetailProps) {
  const navigate = useNavigate();
  const { data: project, isLoading, isError } = useProject(projectId);
  const { updateProject } = useProjectMutations();

  const handleBackClick = () => {
    navigate({ to: "/projects" });
  };

  const handleTabChange = (value: string | null) => {
    if (value && value !== activeTab) {
      navigate({
        to: "/projects/$projectId",
        params: { projectId },
        search: { tab: value },
      });
    }
  };

  const handleSaveName = async (name: string) => {
    await updateProject.mutateAsync({
      projectId: Number(projectId),
      data: { name },
    });
  };

  const handleSaveDescription = async (description: string) => {
    await updateProject.mutateAsync({
      projectId: Number(projectId),
      data: { description: description || undefined },
    });
  };

  if (isLoading) {
    return (
      <Stack>
        <BackLink label="Back to projects" onClick={handleBackClick} />
        <ContentSkeleton />
      </Stack>
    );
  }

  if (isError) {
    return (
      <Stack>
        <BackLink label="Back to projects" onClick={handleBackClick} />
        <Card withBorder>
          <Text color="red">Failed to load project. Please try again.</Text>
        </Card>
      </Stack>
    );
  }

  if (!project) {
    return (
      <Stack>
        <BackLink label="Back to projects" onClick={handleBackClick} />
        <Card withBorder>
          <Text color="red">Project not found</Text>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack>
      <BackLink label="Back to projects" onClick={handleBackClick} />

      {/* Project Header */}
      <Stack gap="md">
        {/* Project Name */}
        <Group justify="space-between" align="flex-start">
          <div style={{ flex: 1 }}>
            <Title order={2}>
              <EditableText
                value={project.name}
                onSave={handleSaveName}
                placeholder="Project name"
              />
            </Title>
          </div>
        </Group>

        {/* Project Description */}
        <Text c="dimmed">
          <EditableText
            value={project.description || ""}
            onSave={handleSaveDescription}
            placeholder="No description"
            multiline
          />
        </Text>
      </Stack>

      {/* Project Content Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tabs.List>
          <Tabs.Tab value="files">Files</Tabs.Tab>
          <Tabs.Tab value="analyses">Analyses</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="files" pt="md">
          <ProjectFiles projectId={Number(projectId)} />
        </Tabs.Panel>

        <Tabs.Panel value="analyses" pt="md">
          <ProjectAnalyses projectId={Number(projectId)} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
