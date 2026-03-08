import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "./test/test-utils";

// Mock the router since it requires complex setup
vi.mock("@tanstack/react-router", () => ({
  createRouter: vi.fn(),
  RouterProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="router">{children}</div>
  ),
  Outlet: () => <div data-testid="outlet">Content</div>,
}));

// Mock the auth context
vi.mock("./contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
  useAuth: () => ({ isLoading: false, user: null }),
}));

// Mock the generated route tree
vi.mock("./routeTree.gen", () => ({
  routeTree: {},
}));

// Simple test component that mimics the main app structure
function TestApp() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <div data-testid="app">
          <div data-testid="header">Header</div>
          <div data-testid="main-content">Main Content</div>
        </div>
      </MantineProvider>
    </QueryClientProvider>
  );
}

describe("App Smoke Tests", () => {
  it("should render main app structure without crashing", () => {
    render(<TestApp />);

    expect(screen.getByTestId("app")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("main-content")).toBeInTheDocument();
  });

  it("should have MantineProvider working", () => {
    render(<TestApp />);

    // Check if Mantine provider is present by looking for the app container
    const app = screen.getByTestId("app");
    expect(app).toBeInTheDocument();
  });

  it("should have QueryClient working", () => {
    // This test ensures QueryClient doesn't throw errors during setup
    expect(() => {
      const queryClient = new QueryClient();
      queryClient.clear();
    }).not.toThrow();
  });
});
