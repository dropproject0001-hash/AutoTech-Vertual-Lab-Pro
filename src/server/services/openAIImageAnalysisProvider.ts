import OpenAI from 'openai';
import { ImageAnalysisProvider, ImageAnalysisResult } from './imageAnalysisTypes';
import { createManualImageAnalysisProvider } from './manualImageAnalysisProvider';

export function createOpenAIImageAnalysisProvider(): ImageAnalysisProvider {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return createManualImageAnalysisProvider();

  const openai = new OpenAI({ apiKey });
  const modelName = process.env.OPENAI_MODEL || 'gpt-4o';

  return {
    async analyzeImage(input: {
      imageBase64: string;
      documentName: string;
      documentType: string;
      regionBox?: { ymin?: number; xmin?: number; ymax?: number; xmax?: number; } | null;
    }): Promise<ImageAnalysisResult> {
      try {
        const response = await openai.chat.completions.create({
          model: modelName,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Analyze this PCB/schematic image. Return ONLY JSON matching the requested schema.' },
                {
                  type: 'image_url',
                  image_url: { url: `data:image/png;base64,${input.imageBase64}` }
                }
              ]
            }
          ],
          response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content || '{}';
        const parsed = JSON.parse(content);

        return {
          ...parsed,
          detectionMethod: "AI_ANALYZED",
          provider: "openai",
          model: modelName
        };
      } catch (e) {
        console.error("OpenAI analysis failed:", e);
        throw new Error("OpenAI analysis failed");
      }
    }
  };
}
