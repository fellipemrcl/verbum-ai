import type { AIRecommendationRequest, AIRecommendationResponse } from "@/types/AITypes";

export async function getAIRecommendations(
  request: AIRecommendationRequest
): Promise<AIRecommendationResponse> {
  try {
    const response = await fetch("/api/ai-recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || response.statusText;
      throw new Error(`Failed to get AI recommendations: ${errorMessage}`);
    }

    const data: AIRecommendationResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred while getting AI recommendations");
  }
}

/**
 * Enhanced AI recommendations with user preferences support
 */
export async function getEnhancedAIRecommendations(
  book: { title: string; author_name?: string[]; subject?: string[] },
  userPreferences?: { genres?: string[]; authors?: string[] }
): Promise<AIRecommendationResponse> {
  const request: AIRecommendationRequest = {
    book,
    userPreferences,
  };

  return getAIRecommendations(request);
}
