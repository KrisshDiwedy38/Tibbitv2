import axios from 'axios';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL !== undefined 
  ? process.env.NEXT_PUBLIC_API_URL 
  : (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '' : 'http://localhost:8000')).replace(/\/$/, '');

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for catching 401s and refreshing tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry on the refresh endpoint itself, or login/register to prevent loops
      const url = originalRequest.url;
      if (url.includes('/token/refresh') || url.includes('/login') || url.includes('/register')) {
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      
      try {
        // Ping the backend refresh endpoint. 
        // It relies on the HttpOnly refresh_token cookie and will set a new access_token cookie.
        await axios.post(`${API_BASE_URL}/api/users/token/refresh/`, {}, { withCredentials: true });
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, we're fully logged out. 
        // In a real app, you might trigger a global event here to clear state or redirect.
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Extract a human-readable error message from a DRF error response.
 */
export function extractDRFError(data: Record<string, any> | undefined): string {
  if (!data) return "SUBMISSION FAILED. TRY AGAIN.";
  
  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
    return String(data.non_field_errors[0]);
  }
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string") {
      return val[0];
    }
    if (typeof val === "string" && key !== "status") {
      return val;
    }
  }
  if (typeof data.error === "string") return data.error;
  if (typeof data.detail === "string") return data.detail;
  if (typeof data.message === "string") return data.message;

  return "SUBMISSION FAILED. TRY AGAIN.";
}

/**
 * Legacy wrapper for backwards compatibility with existing waitlist code.
 */
export async function apiPost(
  path: string,
  body: Record<string, unknown>
): Promise<any> {
  try {
    const response = await api.post(path, body);
    return response.data;
  } catch (error: any) {
    const data = error.response?.data;
    throw new Error(extractDRFError(data).toUpperCase());
  }
}
