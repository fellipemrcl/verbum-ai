/**
 * Hook for managing hardcoded popular search suggestions
 */
export function usePopularSearches() {
  const popularSearches = [
    "Harry Potter", 
    "Science Fiction", 
    "Mystery", 
    "Biography"
  ];

  return {
    popularSearches,
    loading: false
  };
}
