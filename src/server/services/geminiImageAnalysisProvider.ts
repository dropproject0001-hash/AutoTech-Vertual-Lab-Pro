import { GoogleGenAI } from '@google/genai';
import { ImageAnalysisProvider, ImageAnalysisResult } from './imageAnalysisTypes';
import { createManualImageAnalysisProvider } from './manualImageAnalysisProvider';

export function createGeminiImageAnalysisProvider(): ImageAnalysisProvider {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return createManualImageAnalysisProvider();

  const ai = new GoogleGenAI({ apiKey });
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  return {
    async analyzeImage(input: {
      imageBase64: string;
      documentName: string;
      documentType: string;
      regionBox?: { ymin?: number; xmin?: number; ymax?: number; xmax?: number; } | null;
    }): Promise<ImageAnalysisResult> {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: 'image/png',
                    data: input.imageBase64
                  }
                },
                {
                  text: `Analyze this PCB/schematic image...`
                }
              ]
            }
          ]
        });

        // Use response.text() directly, it's a string, not a function that returns a string.
        const text = response.text || '{}';
        const parsed = JSON.parse(text);

        return {
          ...parsed,
          detectionMethod: "AI_ANALYZED",
          provider: "gemini",
          model: modelName
        };
      } catch (e) {
        console.error("Gemini analysis failed:", e);
        throw new Error("Gemini analysis failed");
      }
    }
  };
}
