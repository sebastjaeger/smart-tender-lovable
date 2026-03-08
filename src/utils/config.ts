/**
 * Check if signup is disabled based on environment variable.
 */
export function isSignupDisabled(): boolean {
  return import.meta.env.VITE_DISABLE_SIGNUP === "true";
}
