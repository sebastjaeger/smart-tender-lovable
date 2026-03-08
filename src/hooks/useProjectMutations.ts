import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  projectsCreateProject,
  projectsDeleteProject,
  projectsUpdateProject,
} from "../client";
import { useAuth } from "../contexts/AuthContext";
import { queryKeys } from "../lib/query-keys";

/**
 * Hook for project create/update/delete mutations.
 */
export function useProjectMutations() {
  const { handleApiError } = useAuth();
  const queryClient = useQueryClient();

  const createProject = useMutation({
    mutationFn: async (name: string) => {
      const response = await projectsCreateProject({ body: { name } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => {
      handleApiError(error, "Failed to create project");
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({
      projectId,
      data,
    }: {
      projectId: number;
      data: { name?: string; description?: string };
    }) => {
      const response = await projectsUpdateProject({
        path: { project_id: projectId },
        body: data,
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(variables.projectId),
      });
    },
    onError: (error: Error) => {
      handleApiError(error, "Failed to update project");
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (projectId: number) => {
      const response = await projectsDeleteProject({
        path: { project_id: projectId },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: Error) => {
      handleApiError(error, "Failed to delete project");
    },
  });

  return { createProject, updateProject, deleteProject };
}
