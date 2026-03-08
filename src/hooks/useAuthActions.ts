import { useCallback, useState } from "react";
import type {
  EmailVerificationRequest,
  NewPassword,
  PasswordRecoveryRequest,
} from "../client";
import {
  loginRecoverPassword,
  loginResendVerification,
  loginResetPassword,
  loginVerifyEmail,
} from "../client";
import { ApiError } from "../utils/errors";
import { showSuccess } from "../utils/notifications";

// -- Email verification --

export type VerificationStatus = "pending" | "verifying" | "success" | "error";

/**
 * Hook encapsulating the email verification flow.
 */
export function useVerifyEmail(token: string | undefined) {
  const [status, setStatus] = useState<VerificationStatus>("pending");
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(async () => {
    if (!token) return;

    setStatus("verifying");
    setError(null);

    try {
      const body: EmailVerificationRequest = { token };
      const { error: apiError } = await loginVerifyEmail({ body });

      if (apiError) {
        setStatus("error");
        if (apiError instanceof ApiError) {
          if (apiError.statusCode === 400) {
            setError(
              apiError.message ||
                "Invalid or expired verification link. Please request a new one.",
            );
          } else if (apiError.statusCode === 404) {
            setError("User not found. The account may have been deleted.");
          } else {
            setError(
              apiError.message || "An error occurred. Please try again.",
            );
          }
        } else {
          setError("An error occurred. Please try again.");
        }
      } else {
        setStatus("success");
      }
    } catch {
      setStatus("error");
      setError("Failed to connect to the server. Please try again.");
    }
  }, [token]);

  return { status, error, verify };
}

// -- Password reset --

interface ResetPasswordResult {
  isSubmitting: boolean;
  error: string | null;
  resetPassword: (newPassword: string) => Promise<boolean>;
}

/**
 * Hook encapsulating the password reset flow.
 */
export function useResetPassword(
  token: string | undefined,
): ResetPasswordResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (newPassword: string): Promise<boolean> => {
    if (!token) {
      setError("Invalid or missing reset token.");
      return false;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const body: NewPassword = { token, new_password: newPassword };
      const { error: apiError } = await loginResetPassword({ body });

      if (apiError) {
        if (apiError instanceof ApiError) {
          if (apiError.statusCode === 400) {
            setError(
              apiError.message ||
                "Invalid or expired reset token. Please request a new password reset link.",
            );
          } else if (apiError.statusCode === 403) {
            setError(
              apiError.message ||
                "Your account is inactive. Please contact support.",
            );
          } else if (apiError.statusCode === 404) {
            setError(
              "User not found. Please request a new password reset link.",
            );
          } else {
            setError(
              apiError.message || "An error occurred. Please try again.",
            );
          }
        } else {
          setError("An error occurred. Please try again.");
        }
        return false;
      }

      showSuccess(
        "Password Reset",
        "Your password has been reset successfully. Please sign in with your new password.",
      );
      return true;
    } catch {
      setError("Failed to connect to the server. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, error, resetPassword };
}

// -- Forgot password --

interface ForgotPasswordResult {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  recoverPassword: (values: PasswordRecoveryRequest) => Promise<void>;
}

/**
 * Hook encapsulating the forgot password / recovery flow.
 */
export function useForgotPassword(): ForgotPasswordResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recoverPassword = async (values: PasswordRecoveryRequest) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: apiError } = await loginRecoverPassword({ body: values });

      if (apiError) {
        if (apiError instanceof ApiError && apiError.statusCode === 503) {
          setError(
            "Email service is currently unavailable. Please try again later.",
          );
        } else {
          setError("An error occurred. Please try again.");
        }
      } else {
        setIsSuccess(true);
      }
    } catch {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, isSuccess, error, recoverPassword };
}

// -- Resend verification --

interface ResendVerificationResult {
  isResending: boolean;
  resendSuccess: boolean;
  resendVerification: (email: string) => Promise<void>;
}

/**
 * Hook for resending a verification email.
 */
export function useResendVerification(): ResendVerificationResult {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const resendVerification = async (email: string) => {
    if (!email) return;

    setIsResending(true);
    setResendSuccess(false);

    try {
      await loginResendVerification({ body: { email } });
      setResendSuccess(true);
    } catch {
      // Show success anyway for security (don't reveal if email exists)
      setResendSuccess(true);
    } finally {
      setIsResending(false);
    }
  };

  return { isResending, resendSuccess, resendVerification };
}
