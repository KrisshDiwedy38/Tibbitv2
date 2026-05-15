const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL !== undefined 
  ? process.env.NEXT_PUBLIC_API_URL 
  : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '' : 'http://localhost:8000')).replace(/\/$/, '');

/**
 * Extract a human-readable error message from a DRF error response.
 * DRF returns field-specific errors as { "field": ["error msg"] }
 * or generic errors as { "detail": "..." } / { "error": "..." }.
 */
function extractDRFError(data: Record<string, unknown>): string {
  // 1. Check for 'non_field_errors' which is common in DRF
  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
    return String(data.non_field_errors[0]);
  }

  // 2. Iterate through all keys to find field-specific errors
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string") {
      return val[0];
    }
    // Handle cases where the error might be a direct string instead of an array
    if (typeof val === "string" && key !== "status") {
      return val;
    }
  }

  // 3. Fallback to generic error/detail/message keys
  if (typeof data.error === "string") return data.error;
  if (typeof data.detail === "string") return data.detail;
  if (typeof data.message === "string") return data.message;

  return "SUBMISSION FAILED. TRY AGAIN.";
}

/**
 * POST to a backend API endpoint.
 * Throws an Error with an uppercase message on failure.
 */
export async function apiPost(
  path: string,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data: Record<string, unknown> = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(extractDRFError(data).toUpperCase());
  }

  return data;
}
