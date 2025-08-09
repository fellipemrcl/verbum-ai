import { renderHook, waitFor, act } from '@testing-library/react';
import { usePopularSearches } from '@/hooks/usePopularSearches';
import * as trendingApi from '@/lib/api/trending';

// Mock the trending API
jest.mock('@/lib/api/trending');
const mockFetchTrendingBooks = trendingApi.fetchTrendingBooks as jest.MockedFunction<typeof trendingApi.fetchTrendingBooks>;

describe('usePopularSearches', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up a default mock implementation
    mockFetchTrendingBooks.mockResolvedValue(['Trending Book 1', 'Trending Book 2', 'Trending Book 3', 'Trending Book 4']);
  });

  it('should return default popular searches initially', () => {
    const { result } = renderHook(() => usePopularSearches());
    
    expect(result.current.popularSearches).toEqual([
      'Harry Potter', 'Science Fiction', 'Mystery', 'Biography'
    ]);
    expect(result.current.loading).toBe(true); // Initially loading
  });

  it('should update popular searches when trending books are fetched', async () => {
    const mockTrendingBooks = ['Trending Book 1', 'Trending Book 2', 'Trending Book 3', 'Trending Book 4'];
    mockFetchTrendingBooks.mockResolvedValueOnce(mockTrendingBooks);
    
    const { result } = renderHook(() => usePopularSearches());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.popularSearches).toEqual(mockTrendingBooks);
    expect(mockFetchTrendingBooks).toHaveBeenCalledWith(8);
  });

  it('should handle API error gracefully', async () => {
    mockFetchTrendingBooks.mockRejectedValueOnce(new Error('API Error'));
    
    const { result } = renderHook(() => usePopularSearches());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Should keep the default searches when API fails
    expect(result.current.popularSearches).toEqual([
      'Harry Potter', 'Science Fiction', 'Mystery', 'Biography'
    ]);
  });

  it('should limit popular searches to 4 items', async () => {
    const mockTrendingBooks = [
      'Book 1', 'Book 2', 'Book 3', 'Book 4', 'Book 5', 'Book 6', 'Book 7', 'Book 8'
    ];
    mockFetchTrendingBooks.mockResolvedValueOnce(mockTrendingBooks);
    
    const { result } = renderHook(() => usePopularSearches());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.popularSearches).toHaveLength(4);
    expect(result.current.popularSearches).toEqual(['Book 1', 'Book 2', 'Book 3', 'Book 4']);
  });

  it('should provide refetch functionality', async () => {
    const firstResponse = ['First Book 1', 'First Book 2', 'First Book 3', 'First Book 4'];
    const secondResponse = ['Second Book 1', 'Second Book 2', 'Second Book 3', 'Second Book 4'];
    
    mockFetchTrendingBooks
      .mockResolvedValueOnce(firstResponse)
      .mockResolvedValueOnce(secondResponse);
    
    const { result } = renderHook(() => usePopularSearches());
    
    // Wait for initial fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.popularSearches).toEqual(firstResponse);
    
    // Call refetch
    await act(async () => {
      result.current.refetch();
    });
    
    // Wait for refetch to complete
    await waitFor(() => {
      expect(result.current.popularSearches).toEqual(secondResponse);
    });
    
    // Should have made two calls total
    expect(mockFetchTrendingBooks).toHaveBeenCalledTimes(2);
  });
});
