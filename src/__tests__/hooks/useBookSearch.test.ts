import { renderHook, waitFor, act } from '@testing-library/react';
import { useBookSearch } from '@/hooks/useBookSearch';

// Mock the API
jest.mock('@/lib/api/books', () => ({
  searchBooks: jest.fn(),
}));

import { searchBooks } from '@/lib/api/books';

const mockSearchBooks = searchBooks as jest.MockedFunction<typeof searchBooks>;

describe('useBookSearch Hook', () => {
  beforeEach(() => {
    mockSearchBooks.mockClear();
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useBookSearch());
    
    expect(result.current.books).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('should handle successful search', async () => {
    const mockBooks = [
      { key: '/works/1', title: 'Test Book', author_name: ['Test Author'] }
    ];
    
    mockSearchBooks.mockResolvedValueOnce(mockBooks);

    const { result } = renderHook(() => useBookSearch());
    
    await act(async () => {
      await result.current.search('test query');
    });

    await waitFor(() => {
      expect(result.current.books).toEqual(mockBooks);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('');
    });

    expect(mockSearchBooks).toHaveBeenCalledWith({
      query: 'test query',
      limit: 10,
    });
  });

  it('should handle search error', async () => {
    mockSearchBooks.mockRejectedValueOnce(new Error('Search failed'));

    const { result } = renderHook(() => useBookSearch());
    
    await act(async () => {
      await result.current.search('test query');
    });

    await waitFor(() => {
      expect(result.current.books).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Search failed');
    });
  });

  it('should handle empty search query', async () => {
    const { result } = renderHook(() => useBookSearch());
    
    await act(async () => {
      await result.current.search('   ');
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Please enter a search term');
    });
    
    expect(mockSearchBooks).not.toHaveBeenCalled();
  });
});
