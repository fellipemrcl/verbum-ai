import { renderHook } from '@testing-library/react';
import { usePopularSearches } from '@/hooks/usePopularSearches';

describe('usePopularSearches', () => {
  it('should return hardcoded popular searches', () => {
    const { result } = renderHook(() => usePopularSearches());
    
    expect(result.current.popularSearches).toEqual([
      'Harry Potter', 'The Great Gatsby', 'To Kill a Mockingbird', '1984'
    ]);
    expect(result.current.loading).toBe(false);
  });

  it('should always return the same popular searches', () => {
    const { result: result1 } = renderHook(() => usePopularSearches());
    const { result: result2 } = renderHook(() => usePopularSearches());
    
    expect(result1.current.popularSearches).toEqual(result2.current.popularSearches);
    expect(result1.current.loading).toBe(false);
    expect(result2.current.loading).toBe(false);
  });

  it('should return exactly 4 popular searches', () => {
    const { result } = renderHook(() => usePopularSearches());
    
    expect(result.current.popularSearches).toHaveLength(4);
  });
});
