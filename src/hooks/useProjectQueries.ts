import {
  analysesGetAnalysis,
  analysesGetFullAnalysis,
  analysesListProjectAnalyses,
  projectsGetProject,
  projectsGetProjectOwner,
  projectsListProjectFiles,
  projectsListProjects,
} from "../client";
import { isLoggedIn } from "../lib/auth-storage";
import { queryKeys } from "../lib/query-keys";
import { useQueryWithErrorHandling } from "./useQueryWithErrorHandling";

/**
 * Hook for fetching a single project
 */
export function useProject(projectId: string | number) {
  return useQueryWithErrorHandling({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: async () => {
      const response = await projectsGetProject({
        path: { project_id: Number(projectId) },
      });
      return response.data;
    },
    enabled: isLoggedIn(),
    errorMessage: "Failed to load project",
    notifyOnError: false,
  });
}

/**
 * Hook for fetching projects list with stats and owner info.
 * By default returns all projects; pass limit/offset to paginate.
 */
export function useProjects(options?: { limit?: number; offset?: number }) {
  const { limit, offset } = options ?? {};
  return useQueryWithErrorHandling({
    queryKey: queryKeys.projects.all(limit, offset),
    queryFn: async () => {
      const response = await projectsListProjects({
        query: {
          ...(limit !== undefined && { limit }),
          ...(offset !== undefined && { offset }),
        },
      });
      return response.data;
    },
    enabled: isLoggedIn(),
    errorMessage: "Failed to load projects",
    notifyOnError: false,
  });
}

/**
 * Hook for fetching project owner information
 */
export function useProjectOwner(projectId: string | number) {
  return useQueryWithErrorHandling({
    queryKey: queryKeys.projects.owner(projectId),
    queryFn: async () => {
      const response = await projectsGetProjectOwner({
        path: { project_id: Number(projectId) },
      });
      return response.data;
    },
    enabled: isLoggedIn(),
    errorMessage: "Failed to load project owner",
    notifyOnError: false,
  });
}

/**
 * Hook for fetching project files
 */
export function useProjectFiles(projectId: number) {
  return useQueryWithErrorHandling({
    queryKey: queryKeys.projects.files(projectId),
    queryFn: async () => {
      const response = await projectsListProjectFiles({
        path: { project_id: projectId },
      });
      return response.data;
    },
    enabled: isLoggedIn(),
    errorMessage: "Failed to load project files",
    notifyOnError: false,
  });
}

/**
 * Hook for fetching project analyses
 */
export function useProjectAnalyses(projectId: number) {
  return useQueryWithErrorHandling({
    queryKey: queryKeys.projects.analyses(projectId),
    queryFn: async () => {
      const response = await analysesListProjectAnalyses({
        path: { project_id: projectId },
      });
      return response.data;
    },
    enabled: isLoggedIn(),
    errorMessage: "Failed to load project analyses",
    notifyOnError: false,
    // Poll while any analysis is processing
    refetchInterval: (query) => {
      const data =
        (query.state.data as Array<{ status?: string }> | undefined) ?? [];
      const hasProcessing = data.some(
        (a) => a.status === "pending" || a.status === "in_progress",
      );
      return hasProcessing ? 5000 : false;
    },
  });
}

/**
 * Hook for fetching a single analysis
 */
export function useAnalysis(
  projectId: string | number,
  analysisId: string | number,
  useFull = false,
) {
  return useQueryWithErrorHandling({
    queryKey: queryKeys.analyses.detail(projectId, analysisId, useFull),
    queryFn: async () => {
      // For superusers, we fetch the full analysis including intermediate results
      if (useFull) {
        const response = await analysesGetFullAnalysis({
          path: {
            project_id: Number(projectId),
            analysis_id: Number(analysisId),
          },
        });
        return response.data;
      }
      const response = await analysesGetAnalysis({
        path: {
          project_id: Number(projectId),
          analysis_id: Number(analysisId),
        },
      });
      return response.data;
    },
    enabled: isLoggedIn(),
    errorMessage: "Failed to load analysis",
    notifyOnError: false,
    // Poll while analysis is processing
    refetchInterval: (query) => {
      const data = query.state.data as { status?: string } | undefined;
      const isProcessing =
        data?.status === "pending" || data?.status === "in_progress";
      return isProcessing ? 5000 : false;
    },
  });
}
