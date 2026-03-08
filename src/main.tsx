import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";

import { Container, LoadingOverlay } from "@mantine/core";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
// Import and configure API client
import { client } from "./lib/api-client";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Configure the API client with the backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

client.setConfig({
  baseUrl: API_BASE_URL,
});

// Create a new router instance
const router = createRouter({
  routeTree,
  // biome-ignore lint/style/noNonNullAssertion: provided as context
  context: { auth: undefined! },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Create a client
const queryClient = new QueryClient();

// Custom theme configuration
const theme = createTheme({
  primaryColor: "blue",
  colors: {
    blue: [
      "#f0f4ff",
      "#e0e9ff",
      "#c7d2fe",
      "#a5b4fc",
      "#818cf8",
      "#6366f1", // primary
      "#4f46e5",
      "#4338ca",
      "#3730a3",
      "#312e81",
    ],
    red: [
      "#fef2f2",
      "#fde8e8",
      "#fecaca",
      "#fca5a5",
      "#f87171",
      "#dc2626", // primary - slightly more muted
      "#b91c1c",
      "#991b1b",
      "#7f1d1d",
      "#450a0a",
    ],
    gray: [
      "#f8fafc",
      "#f1f5f9",
      "#e2e8f0",
      "#cbd5e1",
      "#94a3b8",
      "#64748b",
      "#475569",
      "#334155",
      "#1e293b",
      "#0f172a",
    ],
  },
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
  },
  spacing: {
    xs: "8px",
    sm: "12px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
  },
  shadows: {
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

function InnerApp() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <Container
        size="xl"
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingOverlay
          visible={true}
          overlayProps={{ backgroundOpacity: 0.15, blur: 2 }}
          loaderProps={{ size: "lg", type: "dots" }}
        />
      </Container>
    );
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications />
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
);
