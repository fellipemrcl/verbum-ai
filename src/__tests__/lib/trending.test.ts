import { fetchTrendingBooks, getPopularSubjects } from '@/lib/api/trending';

// Mock fetch globally
global.fetch = jest.fn();

describe('Trending API', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('fetchTrendingBooks', () => {
    it('should fetch trending books successfully', async () => {
      const mockResponse = {
        works: [
          {
            key: '/works/OL1W',
            title: 'Test Book One',
            author_name: ['Test Author'],
            cover_i: 123,
            first_publish_year: 2020,
            edition_count: 5
          },
          {
            key: '/works/OL2W',
            title: 'Another Great Book: A Subtitle',
            author_name: ['Another Author'],
            cover_i: 456,
            first_publish_year: 2021,
            edition_count: 3
          }
        ],
        query: '',
        days: 0,
        hours: 0
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchTrendingBooks(4);
      
      expect(fetch).toHaveBeenCalledWith(
        'https://openlibrary.org/trending.json?limit=4',
        expect.objectContaining({
          headers: {
            'User-Agent': 'Verbum-AI/1.0 (contact@verbum-ai.com)',
          },
        })
      );
      
      expect(result).toEqual(['Test Book One', 'Another Great Book', 'Harry Potter', 'Science Fiction']);
    });

    it('should clean up book titles properly', async () => {
      const mockResponse = {
        works: [
          {
            key: '/works/OL1W',
            title: 'Book with Subtitle: The Long Story',
            author_name: ['Author Name']
          },
          {
            key: '/works/OL2W',
            title: 'Book with Series (Book 1)',
            author_name: ['Another Author']
          },
          {
            key: '/works/OL3W',
            title: 'Very Long Title That Goes On And On And Should Be Replaced',
            author_name: ['Short Author']
          }
        ]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchTrendingBooks();
      
      expect(result).toEqual([
        'Book with Subtitle',
        'Book with Series',
        'Short Author', // Long title replaced with author name
        'Harry Potter' // Fallback item to fill to 4
      ]);
    });

    it('should return fallback searches when API fails', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await fetchTrendingBooks();
      
      expect(result).toEqual(['Harry Potter', 'Science Fiction', 'Mystery', 'Biography']);
    });

    it('should return fallback searches when response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await fetchTrendingBooks();
      
      expect(result).toEqual(['Harry Potter', 'Science Fiction', 'Mystery', 'Biography']);
    });

    it('should handle malformed response data', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'data' }),
      });

      const result = await fetchTrendingBooks();
      
      expect(result).toEqual(['Harry Potter', 'Science Fiction', 'Mystery', 'Biography']);
    });

    it('should remove duplicates and limit to 4 suggestions', async () => {
      const mockResponse = {
        works: [
          { key: '/works/OL1W', title: 'Harry Potter', author_name: ['J.K. Rowling'] },
          { key: '/works/OL2W', title: 'Harry Potter', author_name: ['J.K. Rowling'] }, // Duplicate
          { key: '/works/OL3W', title: 'Lord of the Rings', author_name: ['J.R.R. Tolkien'] },
          { key: '/works/OL4W', title: 'The Hobbit', author_name: ['J.R.R. Tolkien'] },
          { key: '/works/OL5W', title: 'Dune', author_name: ['Frank Herbert'] },
          { key: '/works/OL6W', title: 'Foundation', author_name: ['Isaac Asimov'] },
        ]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await fetchTrendingBooks();
      
      expect(result).toHaveLength(4);
      expect(result).toEqual(['Harry Potter', 'Lord of the Rings', 'The Hobbit', 'Dune']);
    });
  });

  describe('getPopularSubjects', () => {
    it('should return predefined popular subjects', () => {
      const subjects = getPopularSubjects();
      
      expect(subjects).toContain('Fiction');
      expect(subjects).toContain('Fantasy');
      expect(subjects).toContain('Science Fiction');
      expect(subjects.length).toBeGreaterThan(10);
    });
  });
});
