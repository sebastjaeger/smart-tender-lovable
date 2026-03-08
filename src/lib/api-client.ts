import type { HttpError, HttpValidationError } from "../client";
import { client } from "../client/client.gen";
import { ApiError } from "../utils/errors";
import { getToken } from "./auth-storage";

// Type for error data that can come from API responses
type ApiErrorData = HttpError | HttpValidationError;

// Configure request interceptor to automatically add authentication headers
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    // Modify the headers directly on the config object
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Configure interceptors to capture status codes
client.interceptors.response.use(async (response) => {
  if (!response.ok) {
    let errorData: ApiErrorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: "Unknown error occurred" };
    }

    const message = Array.isArray(errorData.detail)
      ? errorData.detail[0].msg
      : errorData.detail || "Unknown error";

    throw new ApiError(message, response.status, errorData);
  }

  return response;
});

export { client };
