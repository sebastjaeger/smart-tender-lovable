import { Alert, Button, Container, Stack } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";

interface ServiceUnavailableProps {
  title?: string;
  message?: string;
  onRetry?: () => Promise<void>;
  isRetrying?: boolean;
}

export function ServiceUnavailable({
  title = "Service Unavailable",
  message = "The service is currently unavailable. Please try again later.",
  onRetry,
  isRetrying = false,
}: ServiceUnavailableProps) {
  return (
    <Container size="lg">
      <Stack align="center" mt="xl">
        <Alert
          color="red"
          title={title}
          variant="light"
          style={{ width: "100%" }}
        >
          {message}
        </Alert>

        {onRetry && (
          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={onRetry}
            loading={isRetrying}
            variant="light"
            color="blue"
          >
            {isRetrying ? "Checking..." : "Reload app"}
          </Button>
        )}
      </Stack>
    </Container>
  );
}
