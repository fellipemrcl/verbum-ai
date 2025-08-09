// Mock for trending API functions

export const fetchTrendingBooks = jest.fn(() => 
  Promise.resolve([
    "Harry Potter",
    "The Great Gatsby", 
    "To Kill a Mockingbird",
    "Pride and Prejudice",
    "The Catcher in the Rye",
    "Lord of the Rings",
    "Jane Eyre",
    "Wuthering Heights"
  ])
);

export const getFallbackPopularSearches = jest.fn(() => [
  "Harry Potter",
  "Science Fiction", 
  "Mystery",
  "Biography"
]);
