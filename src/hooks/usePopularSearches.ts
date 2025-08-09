import { useState, useEffect, useCallback } from "react";
import { fetchTrendingBooks } from "@/lib/api/trending";

export function usePopularSearches() {
  const [popularSearches, setPopularSearches] = useState<string[]>([
    "Harry Potter", "Science Fiction", "Mystery", "Biography"
  ]);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  const fetchPopularSearches = useCallback(async (forceRefetch = false) => {
    // Don't fetch if we've fetched recently (within 20 minutes) unless forcing
    const now = Date.now();
    if (!forceRefetch && lastFetched && (now - lastFetched) < 20 * 60 * 1000) {
      return;
    }

    setLoading(true);
    
    try {
      const trending = await fetchTrendingBooks(8); // Fetch more to have variety
      if (trending.length > 0) {
        setPopularSearches(trending.slice(0, 4)); // Use first 4
        setLastFetched(now);
      }
    } catch (error) {
      console.error('Failed to fetch popular searches:', error);
      // Keep the current/fallback searches
    } finally {
      setLoading(false);
    }
  }, [lastFetched]);

  useEffect(() => {
    fetchPopularSearches();
  }, [fetchPopularSearches]);

  return {
    popularSearches,
    loading,
    refetch: () => fetchPopularSearches(true)
  };
}
