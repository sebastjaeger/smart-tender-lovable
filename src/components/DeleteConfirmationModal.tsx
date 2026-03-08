import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ReactNode } from "react";

interface DeleteConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  isLoading?: boolean;
  trigger: (open: () => void) => ReactNode;
}

export function DeleteConfirmationModal({
  title,
  message,
  onConfirm,
  isLoading = false,
  trigger,
}: DeleteConfirmationModalProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const handleConfirm = () => {
    onConfirm();
    close();
  };

  return (
    <>
      {trigger(open)}
      <Modal opened={opened} onClose={close} title={title} lockScroll={false}>
        <Stack>
          <Text size="sm">{message}</Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={close} disabled={isLoading}>
              Cancel
            </Button>
            <Button color="red" onClick={handleConfirm} loading={isLoading}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
