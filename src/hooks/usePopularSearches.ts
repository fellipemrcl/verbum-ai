/**
 * Hook for managing hardcoded popular search suggestions
 */
export function usePopularSearches() {
  const popularSearches = [
    "Harry Potter", 
    "The Great Gatsby", 
    "To Kill a Mockingbird", 
    "1984"
  ];

  return {
    popularSearches,
    loading: false
  };
}
