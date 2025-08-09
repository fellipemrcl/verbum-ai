/**
 * API functions for Open Library trending/popular content
 */

import type { TrendingResponse } from "@/types/BookTypes";

/**
 * Fetch trending books from Open Library
 * @param limit - Number of trending books to fetch (default: 10)
 * @returns Promise<string[]> - Array of trending search terms/book titles
 */
export async function fetchTrendingBooks(limit: number = 10): Promise<string[]> {
  try {
    const response = await fetch(
      `https://openlibrary.org/trending.json?limit=${limit}`,
      {
        headers: {
          'User-Agent': 'Verbum-AI/1.0 (contact@verbum-ai.com)',
        },
      }
    );

    if (!response.ok) {
      console.warn('Failed to fetch trending books, using fallback');
      return getFallbackPopularSearches();
    }

    const data: TrendingResponse = await response.json();
    
    if (!data.works || !Array.isArray(data.works)) {
      console.warn('Invalid trending data structure, using fallback');
      return getFallbackPopularSearches();
    }

    // Extract meaningful search terms from trending books
    const trendingTerms = data.works
      .slice(0, limit)
      .map(book => {
        // Prefer shorter, more searchable titles
        if (book.title) {
          // Clean up the title - remove subtitles, series info, etc.
          const cleanTitle = book.title.split(':')[0].split('(')[0].trim();
          
          // If title is too long, try to extract author name instead
          if (cleanTitle.length > 25 && book.author_name && book.author_name[0]) {
            return book.author_name[0];
          }
          
          return cleanTitle;
        }
        
        // Fallback to author name
        if (book.author_name && book.author_name[0]) {
          return book.author_name[0];
        }
        
        return null;
      })
      .filter((term): term is string => term !== null && term.length > 0)
      .filter((term, index, array) => array.indexOf(term) === index); // Remove duplicates

    // If we don't have enough trending terms, fill with fallback
    if (trendingTerms.length < 4) {
      const fallback = getFallbackPopularSearches();
      const needed = 4 - trendingTerms.length;
      const combined = [...trendingTerms, ...fallback.filter(f => !trendingTerms.includes(f)).slice(0, needed)];
      return combined.slice(0, 4);
    }

    return trendingTerms.slice(0, 4); // Limit to 4 suggestions
  } catch (error) {
    console.error('Error fetching trending books:', error);
    return getFallbackPopularSearches();
  }
}

/**
 * Fallback popular searches when trending API is unavailable
 */
function getFallbackPopularSearches(): string[] {
  return ["Harry Potter", "Science Fiction", "Mystery", "Biography"];
}

/**
 * Get popular subjects from Open Library subjects page
 * This could be used as an alternative source for popular search terms
 */
export function getPopularSubjects(): string[] {
  return [
    "Fiction",
    "Fantasy", 
    "Romance",
    "Mystery",
    "Science Fiction",
    "Biography",
    "History",
    "Poetry",
    "Young Adult",
    "Children's Books",
    "Self-help",
    "Cooking"
  ];
}
