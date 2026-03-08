import {
  Badge,
  Button,
  Card,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFolder, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { ProjectListItem } from "../client";
import { useAuth } from "../contexts/AuthContext";
import { useProjectMutations } from "../hooks/useProjectMutations";
import { useProjects } from "../hooks/useProjectQueries";
import { formatRelativeTime } from "../utils/date";
import { showError } from "../utils/notifications";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { EmptyState } from "./EmptyState";

// Component to display project counts
function ProjectCounts({ project }: { project: ProjectListItem }) {
  return (
    <Group gap="xs">
      {(project.file_count ?? 0) > 0 && (
        <Badge size="xs" variant="light" color="blue">
          {project.file_count} {project.file_count === 1 ? "file" : "files"}
        </Badge>
      )}
      {(project.analysis_count ?? 0) > 0 && (
        <Badge size="xs" variant="light" color="blue">
          {project.analysis_count}{" "}
          {project.analysis_count === 1 ? "analysis" : "analyses"}
        </Badge>
      )}
    </Group>
  );
}

// Shared component for displaying a project table row
function ProjectTableRow({
  project,
  onDelete,
  isDeleting,
}: {
  project: ProjectListItem;
  onDelete: (projectId: number) => void;
  isDeleting: boolean;
}) {
  const navigate = useNavigate();

  return (
    <Table.Tr key={project.id}>
      <Table.Td>
        <div>
          <Group gap="xs" align="center">
            <Text
              fw={500}
              size="sm"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate({
                  to: "/projects/$projectId",
                  params: { projectId: project.id.toString() },
                  search: { tab: "files" },
                })
              }
            >
              {project.name}
            </Text>
            <ProjectCounts project={project} />
          </Group>
          <Text size="xs" c="dimmed">
            {formatRelativeTime(project.created_at)}
          </Text>
        </div>
      </Table.Td>
      <Table.Td style={{ verticalAlign: "middle" }}>
        <Group gap={0} justify="flex-end">
          <DeleteConfirmationModal
            title="Delete Project"
            message={`Are you sure you want to delete "${project.name}"?`}
            onConfirm={() => onDelete(project.id)}
            isLoading={isDeleting}
            trigger={(open) => (
              <Button
                variant="subtle"
                color="red"
                size="xs"
                onClick={open}
                loading={isDeleting}
                style={{ padding: "4px 8px" }}
              >
                <IconTrash size={16} />
              </Button>
            )}
          />
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}

// Shared component for displaying a section of projects
function ProjectSection({
  title,
  projects,
  onDelete,
  deletingProjectId,
  isDeleting,
}: {
  title?: string | null;
  projects: ProjectListItem[];
  onDelete: (projectId: number) => void;
  deletingProjectId: number | null;
  isDeleting: boolean;
}) {
  if (projects.length === 0) return null;

  return (
    <div>
      {title && (
        <Title order={3} mb="md">
          {title}
        </Title>
      )}
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Tbody>
            {projects.map((project) => (
              <ProjectTableRow
                key={project.id}
                project={project}
                onDelete={onDelete}
                isDeleting={isDeleting && deletingProjectId === project.id}
              />
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  );
}

/**
 * Build project sections, grouping by owner for superusers.
 */
function buildProjectSections(
  projects: ProjectListItem[],
  isSuperuser: boolean,
  currentUserEmail: string | undefined,
) {
  if (!isSuperuser) {
    return [{ title: null as string | null, projects }];
  }

  // Group projects by owner email
  const grouped: Record<string, ProjectListItem[]> = {};
  for (const project of projects) {
    if (!grouped[project.owner_email]) {
      grouped[project.owner_email] = [];
    }
    grouped[project.owner_email].push(project);
  }

  const sections = Object.entries(grouped).map(([email, ownerProjects]) => ({
    title: email as string | null,
    projects: ownerProjects,
  }));

  // Current user's projects first
  sections.sort((a, b) => {
    if (a.title === currentUserEmail) return -1;
    if (b.title === currentUserEmail) return 1;
    return 0;
  });

  // Hide header for current user's section
  if (sections.length > 0 && sections[0].title === currentUserEmail) {
    sections[0].title = null;
  }

  return sections;
}

export function ProjectList() {
  const { isSuperuser, user } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [newProjectName, setNewProjectName] = useState("");

  const { data: projectsResponse, isLoading, isError } = useProjects();
  const { createProject, deleteProject } = useProjectMutations();

  const projects = projectsResponse?.items;

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      showError("Error", "Project name required");
      return;
    }
    createProject.mutate(newProjectName, {
      onSuccess: () => {
        close();
        setNewProjectName("");
      },
    });
  };

  const handleDeleteProject = (projectId: number) => {
    setProjectToDelete(projectId);
    deleteProject.mutate(projectId, {
      onSettled: () => setProjectToDelete(null),
    });
  };

  const sections = projects
    ? buildProjectSections(projects, isSuperuser, user?.email)
    : [];

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Projects</Title>
        <Button onClick={open} variant="filled">
          Create Project
        </Button>
      </Group>

      {isError ? (
        <Card withBorder>
          <Text color="red">Failed to load projects. Please try again.</Text>
        </Card>
      ) : (
        <div style={{ position: "relative" }}>
          <LoadingOverlay visible={isLoading} />
          {projects && projects.length === 0 ? (
            <EmptyState
              icon={<IconFolder size={32} color="gray" />}
              title="No projects found"
              description="Create your first project to get started!"
            />
          ) : (
            <Stack gap="lg">
              {sections.map((section, index) => (
                <ProjectSection
                  key={section.title || index}
                  title={section.title}
                  projects={section.projects}
                  onDelete={handleDeleteProject}
                  deletingProjectId={projectToDelete}
                  isDeleting={deleteProject.isPending}
                />
              ))}
            </Stack>
          )}
        </div>
      )}

      <Modal opened={opened} onClose={close} title="Create New Project">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateProject();
          }}
        >
          <Stack>
            <TextInput
              label="Project Name"
              placeholder="Enter project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              required
            />
            <Group justify="flex-end">
              <Button variant="light" onClick={close} type="button">
                Cancel
              </Button>
              <Button type="submit" loading={createProject.isPending}>
                Create
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
