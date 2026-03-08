import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../test/test-utils";
import { Header } from "./Header";

// Mock the router hooks
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
  Link: ({
    children,
    to,
  }: {
    children:
      | React.ReactNode
      | ((props: { isActive: boolean }) => React.ReactNode);
    to: string;
  }) => {
    if (typeof children === "function") {
      return <div>{children({ isActive: false })}</div>;
    }
    return <a href={to}>{children}</a>;
  },
}));

// Mock the utils
vi.mock("../utils/common", () => ({
  isSignupDisabled: () => false,
}));

// Mock the auth context
vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isSuperuser: false,
    logout: vi.fn(),
  }),
}));

describe("Header", () => {
  it("should render without crashing", () => {
    render(<Header />);

    // Check for the main title that should always be present
    expect(screen.getByText("SmartTender.ai")).toBeInTheDocument();

    // Check for sign in/sign up links when not authenticated
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("should render when user is not authenticated", () => {
    // This test ensures the header handles unauthenticated state
    expect(() => {
      render(<Header />);
    }).not.toThrow();
  });
});
