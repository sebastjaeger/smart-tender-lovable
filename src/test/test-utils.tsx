import { MantineProvider } from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render } from "@testing-library/react";
import type React from "react";
import { vi } from "vitest";

// Create a custom render function that includes providers
function TestProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <Notifications />
        {children}
      </QueryClientProvider>
    </MantineProvider>
  );
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: TestProviders, ...options });

// Utility function to clean up notifications
const cleanNotifications = () => {
  notifications.clean();
};

// Common form data for testing
const validFormData = {
  email: "test@example.com",
  password: "password123",
  confirmPassword: "password123",
  fullName: "John Doe",
};

// Mock router utilities
const createMockRouter = () => {
  const mockNavigate = vi.fn();

  return {
    mockNavigate,
    mockRouterModule: {
      useRouter: () => ({
        navigate: mockNavigate,
      }),
    },
  };
};

// Mock client utilities
const createMockClient = () => {
  const mockLoginRegister = vi.fn();

  return {
    mockLoginRegister,
    mockClientModule: {
      loginRegister: mockLoginRegister,
    },
  };
};

// Re-export everything from testing-library/react
export * from "@testing-library/react";

// Override render
export { customRender as render };

// Export utilities
export {
  cleanNotifications,
  validFormData,
  createMockRouter,
  createMockClient,
};
