/**
 * Centralized query key factories.
 * Using factories ensures consistency between query definitions and cache invalidation.
 */
export const queryKeys = {
  me: () => ["me"] as const,

  projects: {
    all: (limit?: number, offset?: number) =>
      ["projects", { limit, offset }] as const,
    detail: (projectId: string | number) =>
      ["project", projectId.toString()] as const,
    files: (projectId: number) => ["project-files", projectId] as const,
    analyses: (projectId: number) => ["project-analyses", projectId] as const,
    owner: (projectId: string | number) =>
      ["project-owner", projectId.toString()] as const,
  },

  analyses: {
    detail: (
      projectId: string | number,
      analysisId: string | number,
      useFull: boolean,
    ) =>
      [
        "analysis",
        projectId.toString(),
        analysisId.toString(),
        useFull ? "full" : "basic",
      ] as const,
  },

  users: {
    all: () => ["users"] as const,
    search: (search?: string) => ["users", { search }] as const,
    detail: (userId: number) => ["users", userId] as const,
    statistics: (userId: number) => ["users", userId, "statistics"] as const,
    byIds: (userIds: number[]) => ["users-by-ids", userIds] as const,
    byEmails: (emails: string[]) => ["users-by-emails", emails] as const,
  },
} as const;
