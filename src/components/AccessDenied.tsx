import { Alert, Container } from "@mantine/core";

interface AccessDeniedProps {
  title?: string;
  message?: string;
  variant?: "light" | "filled" | "outline";
}

export function AccessDenied({
  title = "Access Denied",
  message = "You don't have permission to view this page.",
  variant = "filled",
}: AccessDeniedProps) {
  return (
    <Container size="lg">
      <Alert color="red" title={title} mt="xl" variant={variant}>
        {message}
      </Alert>
    </Container>
  );
}
