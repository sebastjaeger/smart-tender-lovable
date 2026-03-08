import { Alert, Button, Card, Group, Loader, Stack, Text } from "@mantine/core";
import { IconChartLine, IconRefresh } from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { BackLink } from "../../../../../../components/BackLink";

import { ContentSkeleton } from "../../../../../../components/LoadingStates";
import { StatusBadge } from "../../../../../../components/StatusBadge";
import {
  useAnalysis,
  useProject,
} from "../../../../../../hooks/useProjectQueries";
import { formatRelativeTime } from "../../../../../../utils/date";
import styles from "../$analysisId.module.css";

export const Route = createFileRoute(
  "/_auth/projects/$projectId/analyses/$analysisId/",
)({
  component: AnalysisPage,
});

function AnalysisPage() {
  const { projectId, analysisId } = Route.useParams();
  const navigate = useNavigate();

  const {
    data: analysis,
    isLoading,
    isError,
    refetch,
  } = useAnalysis(projectId, analysisId, false);
  const { data: project } = useProject(projectId);

  // Manual refresh remains available via button; background polling handled in hook via refetchInterval

  const handleBackClick = () => {
    navigate({
      to: "/projects/$projectId",
      params: { projectId },
      search: { tab: "analyses" },
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Stack>
        <BackLink
          label={`Back to ${project?.name || "project"}`}
          onClick={handleBackClick}
        />
        <ContentSkeleton />
      </Stack>
    );
  }

  if (isError) {
    return (
      <Stack>
        <BackLink
          label={`Back to ${project?.name || "project"}`}
          onClick={handleBackClick}
        />
        <Card withBorder>
          <Text c="red">Failed to load analysis. Please try again.</Text>
        </Card>
      </Stack>
    );
  }

  if (!analysis) {
    return (
      <Stack>
        <BackLink
          label={`Back to ${project?.name || "project"}`}
          onClick={handleBackClick}
        />
        <Card withBorder>
          <Text c="red">Analysis not found</Text>
        </Card>
      </Stack>
    );
  }

  const isProcessing =
    analysis.status === "pending" || analysis.status === "in_progress";

  const contentToDisplay = analysis.content;

  return (
    <Stack>
      <BackLink
        label={`Back to ${project?.name || "project"}`}
        onClick={handleBackClick}
      />

      {/* Status Header */}

      {isProcessing && (
        <Group justify="space-between" align="center">
          <Group gap="md">
            <StatusBadge status={analysis.status} size="lg" />
            <Text size="sm" c="dimmed">
              Created {formatRelativeTime(analysis.created_at)}
            </Text>
          </Group>
          <Button
            variant="subtle"
            size="sm"
            onClick={handleRefresh}
            leftSection={<IconRefresh size={16} />}
          >
            Refresh
          </Button>
        </Group>
      )}

      {/* Analysis Content */}
      {isProcessing ? (
        <Card withBorder p="xl">
          <Stack gap="md" align="center">
            {analysis.status === "in_progress" ? (
              <Loader type="dots" size="md" />
            ) : (
              <IconChartLine size={32} color="gray" />
            )}
            <Text size="lg" fw={500}>
              {analysis.status === "pending"
                ? "Analysis Queued"
                : "Analysis in Progress"}
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              {analysis.status === "pending"
                ? "Your analysis has been queued and will start processing soon. This page will automatically update when the analysis is ready."
                : "Your analysis is being processed. This may take a few minutes. This page will automatically update when the analysis is complete."}
            </Text>
          </Stack>
        </Card>
      ) : analysis.status === "failed" ? (
        <Card withBorder p="xl">
          <Stack gap="md" align="center">
            <IconChartLine size={32} color="red" />
            <Text size="lg" fw={500} c="red">
              Analysis Failed
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              The analysis failed to complete. Please try creating a new
              analysis.
            </Text>
          </Stack>
        </Card>
      ) : contentToDisplay ? (
        <>
          <div className={styles.markdownContent}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[[rehypeRaw], [rehypeSanitize, defaultSchema]]}
            >
              {contentToDisplay}
            </ReactMarkdown>
          </div>
          <Alert
            variant="light"
            color="gray"
            title="Haftungsausschluss"
            mt="xl"
          >
            <Text size="sm">
              Diese KI-gestützte Analyse dient ausschließlich Informations- und
              Demonstrationszwecken. Sie ersetzt keine Rechts- oder Fachberatung
              und kann die Besonderheiten Ihres konkreten Einzelfalls nicht
              berücksichtigen.
            </Text>
            <Text size="sm" mt="xs">
              Die Ergebnisse werden automatisiert auf Grundlage der
              bereitgestellten Dokumente generiert und können Fehler oder
              Auslassungen enthalten. Entscheidungen, insbesondere im Rahmen
              öffentlicher Ausschreibungen oder Vertragsabschlüsse, dürfen nicht
              allein auf Grundlage dieser Analyse getroffen werden.
            </Text>
            <Text size="sm" mt="xs">
              Eine Haftung für Schäden, die aus der Nutzung oder dem Vertrauen
              auf die bereitgestellten Informationen entstehen, wird
              ausgeschlossen. Die Nutzung erfolgt in eigener Verantwortung des
              Anwenders.
            </Text>
          </Alert>
        </>
      ) : (
        <Card withBorder p="xl">
          <Stack gap="md" align="center">
            <IconChartLine size={32} color="gray" />
            <Text size="lg" fw={500}>
              No content available
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              This analysis doesn't have any results yet.
            </Text>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
