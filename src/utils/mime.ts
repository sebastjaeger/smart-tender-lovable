/**
 * Map a MIME type into a logical icon key used by Tabler icon selection
 * @param mimeType - The MIME type string
 * @returns The icon key used by the UI switch
 */
export function getMimeTypeIcon(mimeType: string | null | undefined): string {
  if (!mimeType) return "file";

  const type = mimeType.toLowerCase();

  // Document types
  if (type.includes("pdf")) return "file-pdf";
  if (
    type.includes("word") ||
    type.includes("document") ||
    type.includes("doc")
  )
    return "file-word";
  if (
    type.includes("excel") ||
    type.includes("spreadsheet") ||
    type.includes("xls")
  )
    return "file-excel";
  if (
    type.includes("powerpoint") ||
    type.includes("presentation") ||
    type.includes("ppt")
  )
    return "file-powerpoint";

  // Text files
  if (type.includes("text/plain") || type.includes("txt")) return "file-lines";
  if (type.includes("text/markdown") || type.includes("md"))
    return "file-lines";
  if (type.includes("text/html") || type.includes("html")) return "file-code";
  if (type.includes("text/css") || type.includes("css")) return "file-code";
  if (type.includes("javascript") || type.includes("js")) return "file-code";
  if (type.includes("json")) return "file-code";
  if (type.includes("xml")) return "file-code";

  // Image types
  if (type.includes("image/")) return "file-image";

  // Audio types
  if (type.includes("audio/")) return "file-audio";

  // Video types
  if (type.includes("video/")) return "file-video";

  // Archive types
  if (
    type.includes("zip") ||
    type.includes("rar") ||
    type.includes("tar") ||
    type.includes("gz")
  )
    return "file-zipper";

  // Default
  return "file";
}
