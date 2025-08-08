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
      throw new Error(`Failed to get AI recommendations: ${response.statusText}`);
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

// TODO: Implement OpenAI client when API route is created
export async function generateRecommendationsWithOpenAI(
  book: { title: string; author_name?: string[]; subject?: string[] }
): Promise<string> {
  // This is a placeholder implementation
  // The actual OpenAI integration should be implemented in an API route
  // to keep API keys secure on the server side
  
  // Example prompt that would be used in the API route:
  // `Based on the book "${book.title}"${
  //   book.author_name ? ` by ${book.author_name.join(", ")}` : ""
  // }${
  //   book.subject ? ` (genres: ${book.subject.slice(0, 3).join(", ")})` : ""
  // }, recommend 3-5 similar books that readers might enjoy.`

  console.log("Book for AI recommendation:", book);
  
  // This would be implemented in /api/ai-recommend route
  throw new Error("AI recommendations not yet implemented. Please create /api/ai-recommend endpoint.");
}
