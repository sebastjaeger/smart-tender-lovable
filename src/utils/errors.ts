import type { HttpError, HttpValidationError } from "../client";

/**
 * Custom error class that preserves HTTP status code from API responses.
 */
export class ApiError extends Error {
  statusCode?: number;
  originalError?: HttpError | HttpValidationError;

  constructor(
    message: string,
    statusCode?: number,
    originalError?: HttpError | HttpValidationError,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}
