import { searchBooks, getBookCoverUrl } from '@/lib/api/books';

// Mock fetch globally
global.fetch = jest.fn();

describe('Books API', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('searchBooks', () => {
    it('should fetch books successfully', async () => {
      const mockResponse = {
        docs: [
          { 
            key: '/works/1', 
            title: 'Test Book', 
            author_name: ['Test Author'] 
          }
        ]
      };
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchBooks({ query: 'test' });
      
      expect(result).toEqual(mockResponse.docs);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('openlibrary.org/search.json')
      );
    });

    it('should handle fetch error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(searchBooks({ query: 'test' })).rejects.toThrow(
        'Failed to fetch books: Not Found'
      );
    });

    it('should handle empty query', async () => {
      await expect(searchBooks({ query: '' })).rejects.toThrow(
        'Search query cannot be empty'
      );
    });
  });

  describe('getBookCoverUrl', () => {
    it('should generate correct cover URL', () => {
      const url = getBookCoverUrl(123, 'M');
      expect(url).toBe('https://covers.openlibrary.org/b/id/123-M.jpg');
    });

    it('should use default size when not specified', () => {
      const url = getBookCoverUrl(123);
      expect(url).toBe('https://covers.openlibrary.org/b/id/123-M.jpg');
    });
  });
});
