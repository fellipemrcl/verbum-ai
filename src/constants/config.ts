export const API_ENDPOINTS = {
  OPEN_LIBRARY: {
    BASE_URL: "https://openlibrary.org",
    SEARCH: "/search.json",
    COVERS: "https://covers.openlibrary.org/b/id",
  },
  AI_RECOMMEND: "/api/ai-recommend",
} as const;

export const BOOK_SEARCH_CONFIG = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50,
  DEFAULT_OFFSET: 0,
} as const;

export const UI_CONFIG = {
  COVER_SIZES: {
    SMALL: "S",
    MEDIUM: "M",
    LARGE: "L",
  },
  THEME_COLORS: {
    PRIMARY: "bg-blue-600",
    PRIMARY_HOVER: "hover:bg-blue-700",
    SECONDARY: "bg-gray-200",
    SECONDARY_HOVER: "hover:bg-gray-300",
  },
} as const;
