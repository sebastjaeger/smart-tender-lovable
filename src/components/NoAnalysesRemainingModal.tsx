import { Button, Modal, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

interface NoAnalysesRemainingModalProps {
  opened: boolean;
  onClose: () => void;
}

export function NoAnalysesRemainingModal({
  opened,
  onClose,
}: NoAnalysesRemainingModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="md"
      lockScroll={false}
    >
      <Stack align="center" gap="md" p="md">
        <IconAlertCircle size={64} color="orange" />
        <Title order={3}>No Analyses Remaining</Title>
        <Text size="sm" ta="center">
          You have used all your available analyses. Please contact support if
          you need more analyses.
        </Text>
        <Button onClick={onClose} fullWidth mt="md">
          Got it
        </Button>
      </Stack>
    </Modal>
  );
}
