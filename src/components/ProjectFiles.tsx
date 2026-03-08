import {
  Badge,
  Button,
  Card,
  FileButton,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  IconDownload,
  IconFile,
  IconFileAi,
  IconFileCode,
  IconFileSpreadsheet,
  IconFileText,
  IconFileTypeDoc,
  IconFileTypePdf,
  IconFileTypePpt,
  IconFileZip,
  IconPhoto,
  IconTrash,
  IconUpload,
  IconVideo,
} from "@tabler/icons-react";
import { useState } from "react";
import { useFileMutations } from "../hooks/useFileMutations";
import { useProjectFiles } from "../hooks/useProjectQueries";
import { formatRelativeTime } from "../utils/date";
import { getMimeTypeIcon } from "../utils/mime";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { EmptyState } from "./EmptyState";
import { HeaderSkeleton, ListSkeleton } from "./LoadingStates";

interface ProjectFilesProps {
  projectId: number;
}

// Helper function to get the appropriate icon for file types
function getMimeTypeIconComponent(mimeType: string | null | undefined) {
  const iconName = getMimeTypeIcon(mimeType);

  switch (iconName) {
    case "file-pdf":
      return <IconFileTypePdf size={16} color="red" />;
    case "file-word":
      return <IconFileTypeDoc size={16} color="blue" />;
    case "file-excel":
      return <IconFileSpreadsheet size={16} color="green" />;
    case "file-powerpoint":
      return <IconFileTypePpt size={16} color="orange" />;
    case "file-lines":
      return <IconFileText size={16} color="gray" />;
    case "file-code":
      return <IconFileCode size={16} color="violet" />;
    case "file-image":
      return <IconPhoto size={16} color="pink" />;
    case "file-audio":
      return <IconFileAi size={16} color="cyan" />;
    case "file-video":
      return <IconVideo size={16} color="indigo" />;
    case "file-zipper":
      return <IconFileZip size={16} color="yellow" />;
    default:
      return <IconFile size={16} color="gray" />;
  }
}

export function ProjectFiles({ projectId }: ProjectFilesProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [fileToDelete, setFileToDelete] = useState<number | null>(null);

  const { data: projectFiles, isLoading, isError } = useProjectFiles(projectId);
  const {
    uploadFile,
    deleteFile,
    deleteAllFiles,
    uploadFiles,
    downloadFile,
    downloadAllFiles,
  } = useFileMutations(projectId);

  const handleFileSelect = async (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    const success = await uploadFiles(selectedFiles);
    if (success) {
      setFiles([]);
    }
  };

  const handleDeleteFile = (fileId: number) => {
    setFileToDelete(fileId);
    deleteFile.mutate(fileId, {
      onSettled: () => setFileToDelete(null),
    });
  };

  const handleDownloadFile = (fileId: number) => {
    const filename =
      projectFiles?.find((f) => f.id === fileId)?.filename || "download";
    downloadFile(fileId, filename);
  };

  // Calculate project stats
  const currentFileCount = projectFiles?.length || 0;
  const currentTotalSize =
    projectFiles?.reduce((sum, file) => sum + file.size, 0) || 0;
  const currentSizeMB = currentTotalSize / (1024 * 1024);

  // Global limits (from backend settings)
  // Keep in sync with backend via env/config
  const MAX_FILES = Number(import.meta.env.VITE_MAX_FILES || 25);
  const MAX_SIZE_MB = Number(import.meta.env.VITE_MAX_TOTAL_SIZE_MB || 25);

  if (isLoading) {
    return (
      <Stack>
        <HeaderSkeleton />
        <ListSkeleton count={4} />
      </Stack>
    );
  }

  if (isError) {
    return (
      <Stack>
        <Card withBorder>
          <Text color="red">Failed to load files. Please try again.</Text>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack>
      <Group justify="space-between" align="center">
        <Group gap="md" align="center">
          <Title order={3}>Files</Title>
          {projectFiles && projectFiles.length > 0 && (
            <Group gap="xs">
              <Badge variant="light" size="sm">
                {currentFileCount}/{MAX_FILES} files
              </Badge>
              <Badge variant="light" size="sm">
                {currentSizeMB.toFixed(2)}/{MAX_SIZE_MB} MB
              </Badge>
            </Group>
          )}
        </Group>

        <Button.Group>
          {/* Primary Action */}
          <FileButton
            onChange={handleFileSelect}
            accept=".pdf,.docx,.txt,.md"
            multiple
          >
            {(props) => (
              <Button
                {...props}
                loading={uploadFile.isPending}
                variant="subtle"
                title="Upload Files"
              >
                <IconUpload size={16} />
              </Button>
            )}
          </FileButton>

          {/* Secondary Actions - only show if files exist */}
          {projectFiles && projectFiles.length > 0 && (
            <>
              <Button
                variant="subtle"
                onClick={downloadAllFiles}
                title="Download All Files"
              >
                <IconDownload size={16} />
              </Button>
              <DeleteConfirmationModal
                title="Delete All Files"
                message={"Are you sure you want to delete all files?"}
                onConfirm={() => {
                  deleteAllFiles.mutate();
                }}
                isLoading={deleteAllFiles.isPending}
                trigger={(open) => (
                  <Button
                    variant="subtle"
                    color="red"
                    onClick={open}
                    loading={deleteAllFiles.isPending}
                    title="Delete All Files"
                  >
                    <IconTrash size={16} />
                  </Button>
                )}
              />
            </>
          )}
        </Button.Group>
      </Group>

      {files.length > 0 && (
        <Card withBorder p="xs">
          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Selected Files:
            </Text>
            <Text size="sm">{files.map((file) => file.name).join(", ")}</Text>
          </Stack>
        </Card>
      )}

      {projectFiles?.length === 0 ? (
        <EmptyState
          icon={<IconFile size={32} color="gray" />}
          title="No files found"
          description="Upload your first file to get started!"
        />
      ) : (
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm">
            <Table.Tbody>
              {projectFiles?.map((file) => (
                <Table.Tr key={file.id}>
                  <Table.Td>
                    <Group gap="sm">
                      {getMimeTypeIconComponent(file.content_type)}
                      <div>
                        <Group gap="xs" align="center">
                          <Text
                            size="sm"
                            fw={500}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDownloadFile(file.id)}
                            title={`Download ${file.filename}`}
                          >
                            {file.filename}
                          </Text>
                          <Badge size="xs" variant="light">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </Badge>
                        </Group>
                        <Text size="xs" c="dimmed">
                          {formatRelativeTime(file.created_at)}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td style={{ verticalAlign: "middle" }}>
                    <Group gap={0} justify="flex-end">
                      <DeleteConfirmationModal
                        title="Delete File"
                        message={`Are you sure you want to delete "${file.filename}"?`}
                        onConfirm={() => handleDeleteFile(file.id)}
                        isLoading={
                          deleteFile.isPending && fileToDelete === file.id
                        }
                        trigger={(open) => (
                          <Button
                            variant="subtle"
                            color="red"
                            size="xs"
                            onClick={open}
                            loading={
                              deleteFile.isPending && fileToDelete === file.id
                            }
                            style={{ padding: "4px 8px" }}
                          >
                            <IconTrash size={16} />
                          </Button>
                        )}
                      />
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </Stack>
  );
}
