"use client";

import { useState, useCallback } from "react";
import { getAIRecommendations } from "@/lib/api/openai";
import type { Book } from "@/types/BookTypes";
import type { AIRecommendationRequest, AIRecommendationResponse, RecommendedBook } from "@/types/AITypes";

interface UseAIRecommendationsReturn {
  recommendation: string;
  recommendedBooks: RecommendedBook[];
  loading: boolean;
  error: string;
  getRecommendation: (book: Book) => Promise<void>;
  clearRecommendation: () => void;
  clearError: () => void;
}

export function useAIRecommendations(): UseAIRecommendationsReturn {
  const [recommendation, setRecommendation] = useState("");
  const [recommendedBooks, setRecommendedBooks] = useState<RecommendedBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRecommendation = useCallback(async (book: Book) => {
    setLoading(true);
    setError("");
    setRecommendation("");
    setRecommendedBooks([]);

    try {
      const request: AIRecommendationRequest = {
        book: {
          title: book.title,
          author_name: book.author_name,
          subject: book.subject,
        },
      };

      const response: AIRecommendationResponse = await getAIRecommendations(request);
      setRecommendation(response.recommendations);
      setRecommendedBooks(response.recommendedBooks || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get AI recommendations";
      setError(errorMessage);
      console.error("AI Recommendation Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRecommendation = useCallback(() => {
    setRecommendation("");
    setRecommendedBooks([]);
    setError("");
  }, []);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    recommendation,
    recommendedBooks,
    loading,
    error,
    getRecommendation,
    clearRecommendation,
    clearError,
  };
}
