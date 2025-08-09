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

export interface RecommendedBook {
  title: string;
  author: string;
  reason: string;
  description?: string;
  genres?: string[];
  year?: number;
}

export interface AIRecommendationResponse {
  recommendations: string;
  recommendedBooks?: RecommendedBook[];
  reasoning?: string;
}

export interface AIError {
  message: string;
  code?: string;
  retryable?: boolean;
}
