import axios from "axios";

// This is the structure expected from the Django backend
export interface ForensicResponse {
  is_fake: boolean;
  confidence: number;
  reasons: string[];
  metadata: Record<string, any>;
}

// Create axios instance pointing to the forensic backend.
// Prefer `import.meta.env.VITE_API_URL`, fall back to the Render URL in production.
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://digital-forensics-backend.onrender.com",
});
// Ensure axios does not force JSON Content-Type for POSTs so the browser
// can set the multipart/form-data boundary when sending FormData.
delete axiosInstance.defaults.headers.post?.["Content-Type"];

// Export a wrapper that handles multipart/form-data properly
export const api = {
  post: async (
    endpoint: string,
    data: any
  ): Promise<{ data: ForensicResponse }> => {
    // Accept either a prepared FormData or an object with a file property.
    let payload: FormData;

    if (data instanceof FormData) {
      payload = data;
    } else {
      payload = new FormData();
      if (data?.file) {
        payload.append("file", data.file);
      }
    }

    // Ensure axios does not set application/json for this request
    delete axiosInstance.defaults.headers.post?.["Content-Type"];

    // Send the FormData directly; browser will set Content-Type with boundary
    try {
      const response = await axiosInstance.post(endpoint, payload);
      const responseData = response.data as any;
      console.log("[API Response]", endpoint, responseData);

      return {
        data: {
          is_fake: responseData?.is_fake ?? false,
          confidence: responseData?.confidence ?? 0,
          reasons: responseData?.reasons ?? [],
          metadata: responseData?.metadata ?? {}
        }
      };
    } catch (error) {
      console.error("[API Error]", endpoint, error);
      throw error;
    }
  },
};
