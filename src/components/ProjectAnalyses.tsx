import {
  Button,
  Card,
  Group,
  Loader,
  Skeleton,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChartLine,
  IconDownload,
  IconEye,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAnalysisMutations } from "../hooks/useAnalysisMutations";
import {
  useProjectAnalyses,
  useProjectFiles,
} from "../hooks/useProjectQueries";
import { formatRelativeTime } from "../utils/date";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { EmptyState } from "./EmptyState";

import { CardSkeleton, HeaderSkeleton } from "./LoadingStates";
import { NoAnalysesRemainingModal } from "./NoAnalysesRemainingModal";
import { StatusBadge } from "./StatusBadge";

interface ProjectAnalysesProps {
  projectId: number;
}

export function ProjectAnalyses({ projectId }: ProjectAnalysesProps) {
  const theme = useMantineTheme();
  const [analysisToDelete, setAnalysisToDelete] = useState<number | null>(null);
  const [
    noAnalysesModalOpened,
    { open: openNoAnalysesModal, close: closeNoAnalysesModal },
  ] = useDisclosure(false);

  const { data: analyses, isError, isLoading } = useProjectAnalyses(projectId);

  // Fetch project files to check if any files exist
  const { data: projectFiles } = useProjectFiles(projectId);

  const {
    createAnalysis,
    deleteAnalysis,
    deleteAllAnalyses,
    downloadPdf,
    isCreateCooldown,
    isSuperuser,
  } = useAnalysisMutations(projectId, {
    onRateLimited: openNoAnalysesModal,
  });

  const handleCreateClick = () => {
    createAnalysis.mutate();
  };

  if (isLoading) {
    return (
      <Stack>
        <HeaderSkeleton />
        <Skeleton height={20} width="100%" />
        <Stack gap="md">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </Stack>
      </Stack>
    );
  }

  if (isError) {
    return (
      <Stack>
        <Card withBorder>
          <Text color="red">Failed to load analyses. Please try again.</Text>
        </Card>
      </Stack>
    );
  }

  const canCreateAnalysis =
    projectFiles && projectFiles.length > 0 && !isCreateCooldown;

  return (
    <Stack>
      <NoAnalysesRemainingModal
        opened={noAnalysesModalOpened}
        onClose={closeNoAnalysesModal}
      />

      <Group justify="space-between" align="center">
        <Title order={3}>Analyses</Title>

        <Group gap="xs" align="center">
          <Button.Group>
            <Button
              onClick={handleCreateClick}
              loading={createAnalysis.isPending}
              disabled={!canCreateAnalysis}
              variant="subtle"
              style={
                !canCreateAnalysis
                  ? { backgroundColor: "transparent" }
                  : undefined
              }
              title={
                !projectFiles || projectFiles.length === 0
                  ? "Upload files first to create an analysis"
                  : isCreateCooldown
                    ? "Please wait before creating another analysis"
                    : "Create New Analysis"
              }
            >
              <IconPlus size={16} />
            </Button>

            {/* Secondary Actions - only show if analyses exist */}
            {analyses && analyses.length > 0 && (
              <DeleteConfirmationModal
                title="Delete All Analyses"
                message={"Are you sure you want to delete all analyses?"}
                onConfirm={() => {
                  deleteAllAnalyses.mutate();
                }}
                isLoading={deleteAllAnalyses.isPending}
                trigger={(open) => (
                  <Button
                    variant="subtle"
                    color="red"
                    onClick={open}
                    loading={deleteAllAnalyses.isPending}
                    title="Delete All Analyses"
                  >
                    <IconTrash size={16} />
                  </Button>
                )}
              />
            )}
          </Button.Group>
        </Group>
      </Group>

      <Text size="sm" c="dimmed">
        Creating an analysis will queue it for processing in the background. You
        can view the analysis status and results once it's ready. Processing may
        take a few minutes depending on the size of your files.
      </Text>

      {analyses?.length === 0 ? (
        <EmptyState
          icon={<IconChartLine size={32} color="gray" />}
          title="No analyses found"
          description="Create your first analysis to get started!"
        />
      ) : (
        <Stack gap="md">
          {analyses?.map((analysis) => (
            <Card
              key={analysis.id}
              withBorder
              padding="lg"
              style={{
                borderColor:
                  analysis.status === "completed"
                    ? theme.colors.gray[3]
                    : theme.colors.gray[2],
                opacity: analysis.status === "completed" ? 1 : 0.8,
              }}
            >
              <Group justify="space-between" align="center">
                <Group gap="md">
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: theme.colors.gray[1],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {analysis.status === "in_progress" ? (
                      <Loader type="dots" size="sm" />
                    ) : (
                      <IconChartLine size={20} color={theme.colors.gray[6]} />
                    )}
                  </div>
                  <div>
                    <Group gap="sm" align="center">
                      <Link
                        to="/projects/$projectId/analyses/$analysisId"
                        params={{
                          projectId: projectId.toString(),
                          analysisId: analysis.id.toString(),
                        }}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Text fw={600} size="md" style={{ cursor: "pointer" }}>
                          Analysis #{analysis.id}
                        </Text>
                      </Link>
                      <StatusBadge status={analysis.status} />
                    </Group>
                    <Text size="xs" c="dimmed" mt={4}>
                      {formatRelativeTime(analysis.created_at)}
                    </Text>
                  </div>
                </Group>
                <Group gap="xs">
                  {analysis.status === "completed" && (
                    <>
                      {isSuperuser && (
                        <Link
                          to="/projects/$projectId/analyses/$analysisId/superuser"
                          params={{
                            projectId: projectId.toString(),
                            analysisId: analysis.id.toString(),
                          }}
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            variant="subtle"
                            size="xs"
                            style={{ padding: "4px 8px" }}
                            title={`View Superuser Analysis #${analysis.id}`}
                          >
                            <IconEye size={16} />
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={() => downloadPdf(analysis.id)}
                        style={{ padding: "4px 8px" }}
                        title={`Download Analysis #${analysis.id} as PDF`}
                      >
                        <IconDownload size={16} />
                      </Button>
                    </>
                  )}
                  <DeleteConfirmationModal
                    title="Delete Analysis"
                    message={`Are you sure you want to delete analysis #${analysis.id}?`}
                    onConfirm={() => {
                      setAnalysisToDelete(analysis.id);
                      deleteAnalysis.mutate(analysis.id);
                    }}
                    isLoading={
                      deleteAnalysis.isPending &&
                      analysisToDelete === analysis.id
                    }
                    trigger={(open) => (
                      <Button
                        variant="subtle"
                        color="red"
                        size="xs"
                        onClick={open}
                        loading={
                          deleteAnalysis.isPending &&
                          analysisToDelete === analysis.id
                        }
                        style={{ padding: "4px 8px" }}
                        title={`Delete Analysis #${analysis.id}`}
                      >
                        <IconTrash size={16} />
                      </Button>
                    )}
                  />
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
