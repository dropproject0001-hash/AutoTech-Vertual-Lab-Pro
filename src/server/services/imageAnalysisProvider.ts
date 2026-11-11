import { ImageAnalysisProvider } from './imageAnalysisTypes';
import { createGeminiImageAnalysisProvider } from './geminiImageAnalysisProvider';
import { createOpenAIImageAnalysisProvider } from './openAIImageAnalysisProvider';
import { createManualImageAnalysisProvider } from './manualImageAnalysisProvider';

export function getImageAnalysisProvider(): ImageAnalysisProvider {
  const provider = process.env.IMAGE_ANALYSIS_PROVIDER?.trim().toLowerCase() || "manual";

  switch (provider) {
    case "gemini":
      return createGeminiImageAnalysisProvider();
    case "openai":
      return createOpenAIImageAnalysisProvider();
    case "manual":
    default:
      return createManualImageAnalysisProvider();
  }
}
