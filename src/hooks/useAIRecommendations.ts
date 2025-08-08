"use client";

import { useState, useCallback } from "react";
import { getAIRecommendations } from "@/lib/api/openai";
import type { Book } from "@/types/BookTypes";
import type { AIRecommendationRequest, AIRecommendationResponse } from "@/types/AITypes";

interface UseAIRecommendationsReturn {
  recommendation: string;
  loading: boolean;
  error: string;
  getRecommendation: (book: Book) => Promise<void>;
  clearRecommendation: () => void;
  clearError: () => void;
}

export function useAIRecommendations(): UseAIRecommendationsReturn {
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRecommendation = useCallback(async (book: Book) => {
    setLoading(true);
    setError("");
    setRecommendation("");

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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get AI recommendations";
      setError(errorMessage);
      
      // Fallback for development - remove when API is implemented
      if (errorMessage.includes("not yet implemented")) {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1200));
        setRecommendation(`Here are some AI-powered recommendations based on "${book.title}":\n\n1. Similar book recommendation 1\n2. Similar book recommendation 2\n3. Similar book recommendation 3\n\nThese recommendations are based on genre, writing style, and reader preferences.`);
        setError("");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRecommendation = useCallback(() => {
    setRecommendation("");
    setError("");
  }, []);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    recommendation,
    loading,
    error,
    getRecommendation,
    clearRecommendation,
    clearError,
  };
}
