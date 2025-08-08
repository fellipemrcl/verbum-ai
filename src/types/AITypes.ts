export interface AIRecommendationRequest {
  book: {
    title: string;
    author_name?: string[];
    subject?: string[];
  };
  userPreferences?: {
    genres?: string[];
    authors?: string[];
  };
}

export interface AIRecommendationResponse {
  recommendations: string;
  relatedBooks?: string[];
  reasoning?: string;
}

export interface AIError {
  message: string;
  code?: string;
  retryable?: boolean;
}
