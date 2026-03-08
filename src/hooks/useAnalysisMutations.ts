import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
  analysesCreateAnalysis,
  analysesDeleteAllProjectAnalyses,
  analysesDeleteAnalysis,
  analysesGetAnalysisPdf,
} from "../client";
import { useAuth } from "../contexts/AuthContext";
import { queryKeys } from "../lib/query-keys";
import { downloadApiResponse } from "../utils/download";
import { ApiError } from "../utils/errors";

const CREATE_COOLDOWN_MS = 7000;

interface AnalysisMutationsOptions {
  /** Called when analysis creation is rejected due to rate limiting (HTTP 429). */
  onRateLimited?: () => void;
}

/**
 * Hook for analysis create/delete/download mutations scoped to a project.
 * Includes a cooldown timer after creation and rate-limit (429) detection.
 */
export function useAnalysisMutations(
  projectId: number,
  options?: AnalysisMutationsOptions,
) {
  const { handleApiError, isSuperuser } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateCooldown, setIsCreateCooldown] = useState(false);

  const invalidateAnalyses = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.projects.analyses(projectId),
    });
  };

  const createAnalysis = useMutation({
    mutationFn: async () => {
      const response = await analysesCreateAnalysis({
        path: { project_id: projectId },
      });
      return response.data;
    },
    onSuccess: () => {
      invalidateAnalyses();
      // Prevent rapid re-creation
      setIsCreateCooldown(true);
      setTimeout(() => setIsCreateCooldown(false), CREATE_COOLDOWN_MS);
    },
    onError: (error: Error) => {
      if (error instanceof ApiError && error.statusCode === 429) {
        options?.onRateLimited?.();
        return;
      }
      handleApiError(error, "Failed to create analysis");
    },
  });

  const deleteAnalysis = useMutation({
    mutationFn: async (analysisId: number) => {
      const response = await analysesDeleteAnalysis({
        path: { project_id: projectId, analysis_id: analysisId },
      });
      return response.data;
    },
    onSuccess: invalidateAnalyses,
    onError: (error: Error) => {
      handleApiError(error, "Failed to delete analysis");
    },
  });

  const deleteAllAnalyses = useMutation({
    mutationFn: async () => {
      const response = await analysesDeleteAllProjectAnalyses({
        path: { project_id: projectId },
      });
      return response.data;
    },
    onSuccess: invalidateAnalyses,
    onError: (error: Error) => {
      handleApiError(error, "Failed to delete all analyses");
    },
  });

  const downloadPdf = useCallback(
    async (analysisId: number) => {
      try {
        const response = await analysesGetAnalysisPdf({
          path: { project_id: projectId, analysis_id: analysisId },
        });
        downloadApiResponse(
          response,
          `analysis_${analysisId}.pdf`,
          "application/pdf",
        );
      } catch (error) {
        handleApiError(error as Error, "Failed to download analysis PDF");
      }
    },
    [projectId, handleApiError],
  );

  return {
    createAnalysis,
    deleteAnalysis,
    deleteAllAnalyses,
    downloadPdf,
    isCreateCooldown,
    isSuperuser,
  };
}
