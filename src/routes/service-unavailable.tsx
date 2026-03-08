import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { healthHealth } from "../client";
import { ServiceUnavailable } from "../components/ServiceUnavailable";
import { useAuth } from "../contexts/AuthContext";

export const Route = createFileRoute("/service-unavailable")({
  component: ServiceUnavailablePage,
});

function ServiceUnavailablePage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { handleApiError, markBackendReachable } = useAuth();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Use the health endpoint which doesn't require authentication
      await healthHealth();

      // Mark backend as reachable in auth context
      markBackendReachable();

      // Ensure the router re-evaluates loaders/guards with fresh context
      await router.invalidate();

      // Navigate to appropriate page based on auth status
      navigate({ to: "/" });
    } catch (error) {
      handleApiError(error as Error);
    } finally {
      setIsRetrying(false);
    }
  };

  return <ServiceUnavailable onRetry={handleRetry} isRetrying={isRetrying} />;
}
