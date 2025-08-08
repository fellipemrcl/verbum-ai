"use client";

import { useState, useCallback } from "react";
import { searchBooks } from "@/lib/api/books";
import type { Book, BookSearchParams } from "@/types/BookTypes";

interface UseBookSearchReturn {
  books: Book[];
  loading: boolean;
  error: string;
  search: (query: string) => Promise<void>;
  clearResults: () => void;
  clearError: () => void;
}

export function useBookSearch(): UseBookSearchReturn {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const searchParams: BookSearchParams = {
        query,
        limit: 10,
      };
      
      const results = await searchBooks(searchParams);
      setBooks(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to search books";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setBooks([]);
    setError("");
  }, []);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    books,
    loading,
    error,
    search,
    clearResults,
    clearError,
  };
}
