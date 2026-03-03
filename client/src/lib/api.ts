import axios from "axios";

// This is the structure expected from the Django backend
export interface ForensicResponse {
  is_fake: boolean;
  confidence: number;
  reasons: string[];
  metadata: Record<string, any>;
}

// In a real application, you would connect to:
// export const api = axios.create({ baseURL: "http://127.0.0.1:8000/api/" });

// Mock API for prototype demonstration
export const api = {
  post: async (endpoint: string, data: any): Promise<{ data: ForensicResponse }> => {
    // Simulate network delay for "processing" state
    await new Promise((resolve) => setTimeout(resolve, 3500));
    
    // Simulate different responses based on endpoint
    if (endpoint.includes("video")) {
      return {
        data: {
          is_fake: true,
          confidence: 94.2,
          reasons: [
            "Inconsistent facial muscle micro-movements detected at 0:12",
            "Unnatural blink rate and eye trajectory",
            "Audio-visual sync discrepancy of 14ms",
            "Artifacts detected in neck boundary blending"
          ],
          metadata: {
            resolution: "1920x1080",
            fps: 30,
            duration: "0:45",
            model_used: "DeepFake-V3-Detector"
          }
        }
      };
    }
    
    if (endpoint.includes("audio")) {
      return {
        data: {
          is_fake: true,
          confidence: 88.7,
          reasons: [
            "Unnatural spectral harmonics in vocal range 4kHz-8kHz",
            "Absence of expected room impulse response",
            "Synthetic breathing artifacts detected"
          ],
          metadata: {
            sample_rate: "44100Hz",
            channels: 2,
            duration: "0:15",
            model_used: "Voice-Clone-Scanner-X"
          }
        }
      };
    }
    
    if (endpoint.includes("image")) {
      return {
        data: {
          is_fake: false,
          confidence: 91.5,
          reasons: [
            "Error level analysis shows consistent compression",
            "No copy-move forgery artifacts detected",
            "Metadata structure aligns with standard camera sensors"
          ],
          metadata: {
            extracted_text: "SECURITY CLEARANCE: LEVEL 5\nID: 9482-A\nSTATUS: ACTIVE",
            resolution: "4000x3000",
            color_space: "sRGB",
            model_used: "Image-Forensics-Pro"
          }
        }
      };
    }

    return {
      data: {
        is_fake: false,
        confidence: 0,
        reasons: [],
        metadata: {}
      }
    };
  }
};
