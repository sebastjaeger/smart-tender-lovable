interface ResponseWithHeaders {
  data: unknown;
  response: {
    headers: {
      get(name: string): string | null;
    };
  };
}

/**
 * Extract the filename from a Content-Disposition response header.
 * Returns null if the header is missing or doesn't contain a filename.
 */
export function extractFilenameFromHeader(
  response: ResponseWithHeaders,
): string | null {
  const contentDisposition = response.response.headers.get(
    "content-disposition",
  );
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (filenameMatch) {
      return filenameMatch[1];
    }
  }
  return null;
}

/**
 * Trigger a file download in the browser by creating a temporary anchor element.
 */
export function triggerDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Download a file from an API response.
 * Handles blob creation, filename extraction, and triggering the browser download.
 */
export function downloadApiResponse(
  response: ResponseWithHeaders,
  fallbackFilename: string,
  contentType?: string,
) {
  const blob = new Blob([response.data as BlobPart], {
    type:
      contentType || response.response.headers.get("content-type") || undefined,
  });
  const filename = extractFilenameFromHeader(response) || fallbackFilename;
  triggerDownload(blob, filename);
}
