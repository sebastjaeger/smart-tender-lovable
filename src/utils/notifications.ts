import { notifications } from "@mantine/notifications";

export function showError(title: string, err: Error | string | null) {
  notifications.show({
    title: title,
    message: err instanceof Error ? err.message : err,
    color: "red",
    autoClose: 5000,
  });
}

export function showSuccess(title: string, message: string) {
  notifications.show({
    title: title,
    message: message,
    color: "green",
    autoClose: 5000,
  });
}
