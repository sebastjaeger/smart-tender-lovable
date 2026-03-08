/**
 * Email validation - used across all forms
 */
export const validateEmail = (value: string): string | null => {
  return /^\S+@\S+$/.test(value) ? null : "Invalid email";
};

/**
 * Password validation for signin - minimal validation since users might have existing passwords
 */
export const validateSigninPassword = (value: string): string | null => {
  return value.length < 1 ? "Password is required" : null;
};

/**
 * Password validation for signup/user creation - requires minimum 8 characters
 */
export const validateNewPassword = (value: string): string | null => {
  return value.length < 8 ? "Password must be at least 8 characters" : null;
};

/**
 * Confirm password validation
 */
export const validateConfirmPassword = (
  value: string,
  password: string,
): string | null => {
  return value !== password ? "Passwords do not match" : null;
};
