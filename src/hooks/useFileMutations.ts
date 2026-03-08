import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  projectsDeleteAllProjectFiles,
  projectsDeleteFile,
  projectsDownloadFileContent,
  projectsDownloadProjectArchive,
  projectsUploadFile,
} from "../client";
import { useAuth } from "../contexts/AuthContext";
import { queryKeys } from "../lib/query-keys";
import { downloadApiResponse } from "../utils/download";
import { showError } from "../utils/notifications";

/** Maximum file size in bytes (keep in sync with backend). */
const MAX_FILE_SIZE_BYTES = 32 * 1024 * 1024; // 32MB

/**
 * Validate file sizes against the maximum limit.
 * Returns the list of oversized file names, or an empty array if all are valid.
 */
export function validateFileSizes(files: File[]): string[] {
  return files
    .filter((file) => file.size > MAX_FILE_SIZE_BYTES)
    .map((f) => f.name);
}

/**
 * Hook for file upload/delete/download mutations scoped to a project.
 */
export function useFileMutations(projectId: number) {
  const { handleApiError } = useAuth();
  const queryClient = useQueryClient();

  const invalidateFiles = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.projects.files(projectId),
    });
  };

  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      const response = await projectsUploadFile({
        path: { project_id: projectId },
        body: { file },
      });
      return response.data;
    },
    onSuccess: invalidateFiles,
    onError: (error: Error) => {
      handleApiError(error, "Failed to upload file");
    },
  });

  const deleteFile = useMutation({
    mutationFn: async (fileId: number) => {
      const response = await projectsDeleteFile({
        path: { project_id: projectId, file_id: fileId },
      });
      return response.data;
    },
    onSuccess: invalidateFiles,
    onError: (error: Error) => {
      handleApiError(error, "Failed to delete file");
    },
  });

  const deleteAllFiles = useMutation({
    mutationFn: async () => {
      const response = await projectsDeleteAllProjectFiles({
        path: { project_id: projectId },
      });
      return response.data;
    },
    onSuccess: invalidateFiles,
    onError: (error: Error) => {
      handleApiError(error, "Failed to delete all files");
    },
  });

  /**
   * Upload multiple files sequentially, validating sizes first.
   * Returns true if all uploads succeeded, false otherwise.
   */
  const uploadFiles = async (files: File[]): Promise<boolean> => {
    const oversized = validateFileSizes(files);
    if (oversized.length > 0) {
      showError(
        "File(s) too large",
        `The following file(s) exceed the 32MB limit: ${oversized.join(", ")}`,
      );
      return false;
    }
    for (const file of files) {
      try {
        await uploadFile.mutateAsync(file);
      } catch {
        // Error handling is done in the mutation onError
        return false;
      }
    }
    return true;
  };

  const downloadFile = async (fileId: number, fallbackFilename: string) => {
    try {
      const response = await projectsDownloadFileContent({
        path: { project_id: projectId, file_id: fileId },
      });
      downloadApiResponse(response, fallbackFilename);
    } catch (error) {
      showError("Failed to download file", error as Error);
    }
  };

  const downloadAllFiles = async () => {
    try {
      const response = await projectsDownloadProjectArchive({
        path: { project_id: projectId },
      });
      downloadApiResponse(response, "files.zip", "application/zip");
    } catch (error) {
      showError("Failed to download archive", error as Error);
    }
  };

  return {
    uploadFile,
    deleteFile,
    deleteAllFiles,
    uploadFiles,
    downloadFile,
    downloadAllFiles,
  };
}
