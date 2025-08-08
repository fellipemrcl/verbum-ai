import type { Book, BookSearchResponse, BookSearchParams } from "@/types/BookTypes";

const OPEN_LIBRARY_BASE_URL = "https://openlibrary.org";

export async function searchBooks(params: BookSearchParams): Promise<Book[]> {
  const { query, limit = 10, offset = 0 } = params;
  
  if (!query.trim()) {
    throw new Error("Search query cannot be empty");
  }

  try {
    const searchParams = new URLSearchParams({
      title: query,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await fetch(
      `${OPEN_LIBRARY_BASE_URL}/search.json?${searchParams}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.statusText}`);
    }

    const data: BookSearchResponse = await response.json();
    return data.docs || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred while searching books");
  }
}

export async function getBookDetails(bookKey: string): Promise<Book | null> {
  try {
    const response = await fetch(`${OPEN_LIBRARY_BASE_URL}${bookKey}.json`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch book details: ${response.statusText}`);
    }

    const bookData = await response.json();
    return bookData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred while fetching book details");
  }
}

export function getBookCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}
