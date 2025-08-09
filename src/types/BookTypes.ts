export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
}

export interface BookDetail extends Book {
  description?: string;
  isbn?: string[];
  publisher?: string[];
  language?: string[];
  number_of_pages?: number;
}

export interface BookSearchResponse {
  docs: Book[];
  numFound: number;
  start: number;
}

export interface BookSearchParams {
  query: string;
  limit?: number;
  offset?: number;
}

// Trending/Popular Books types
export interface TrendingBook {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  edition_count?: number;
}

export interface TrendingResponse {
  works: TrendingBook[];
  query?: string;
  days?: number;
  hours?: number;
}
