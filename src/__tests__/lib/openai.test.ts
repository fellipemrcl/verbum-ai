import { getAIRecommendations, getEnhancedAIRecommendations } from '@/lib/api/openai';
import type { AIRecommendationRequest } from '@/types/AITypes';

// Mock fetch globally
global.fetch = jest.fn();

describe('OpenAI API', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('getAIRecommendations', () => {
    it('should get AI recommendations successfully', async () => {
      const mockResponse = {
        recommendations: 'Great book recommendations here!',
        reasoning: 'Based on genre and style analysis'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const request: AIRecommendationRequest = {
        book: {
          title: 'Test Book',
          author_name: ['Test Author'],
          subject: ['Fiction']
        }
      };

      const result = await getAIRecommendations(request);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/ai-recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
    });

    it('should handle API errors with detailed error messages', async () => {
      const errorResponse = { error: 'OpenAI API key not configured' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => errorResponse,
      });

      const request: AIRecommendationRequest = {
        book: {
          title: 'Test Book',
        }
      };

      await expect(getAIRecommendations(request)).rejects.toThrow(
        'Failed to get AI recommendations: OpenAI API key not configured'
      );
    });

    it('should handle network errors gracefully', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const request: AIRecommendationRequest = {
        book: {
          title: 'Test Book',
        }
      };

      await expect(getAIRecommendations(request)).rejects.toThrow('Network error');
    });
  });

  describe('getEnhancedAIRecommendations', () => {
    it('should call getAIRecommendations with proper request format', async () => {
      const mockResponse = {
        recommendations: 'Enhanced recommendations!',
        reasoning: 'Based on preferences and book analysis'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const book = {
        title: 'Test Book',
        author_name: ['Test Author'],
        subject: ['Fiction']
      };

      const userPreferences = {
        genres: ['Fantasy', 'Adventure'],
        authors: ['J.R.R. Tolkien']
      };

      const result = await getEnhancedAIRecommendations(book, userPreferences);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/ai-recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book,
          userPreferences,
        }),
      });
    });

    it('should work without user preferences', async () => {
      const mockResponse = {
        recommendations: 'Simple recommendations!',
        reasoning: 'Based on book analysis only'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const book = {
        title: 'Test Book',
        author_name: ['Test Author'],
        subject: ['Fiction']
      };

      const result = await getEnhancedAIRecommendations(book);

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith('/api/ai-recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book,
          userPreferences: undefined,
        }),
      });
    });
  });
});
