/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/ai-recommend/route';

// Mock OpenAI
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: "1. **The Name of the Wind** by Patrick Rothfuss - A beautifully written fantasy novel with lyrical prose and deep character development.\n\n2. **The Way of Kings** by Brandon Sanderson - Epic fantasy with intricate world-building and complex magic systems.\n\n3. **The Lies of Locke Lamora** by Scott Lynch - A clever heist story set in a fantasy world with witty dialogue and intricate plotting."
                }
              }
            ]
          })
        }
      }
    }))
  };
});

describe('/api/ai-recommend', () => {
  beforeEach(() => {
    // Set up environment variable for tests
    process.env.OPENAI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return AI recommendations for a valid book request', async () => {
    const requestBody = {
      book: {
        title: 'The Hobbit',
        author_name: ['J.R.R. Tolkien'],
        subject: ['Fantasy', 'Adventure']
      }
    };

    const request = new NextRequest('http://localhost:3000/api/ai-recommend', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('recommendations');
    expect(data.recommendations).toContain('The Name of the Wind');
    expect(data).toHaveProperty('reasoning');
  });

  it('should return 400 error for missing book title', async () => {
    const requestBody = {
      book: {
        author_name: ['Some Author']
      }
    };

    const request = new NextRequest('http://localhost:3000/api/ai-recommend', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Book title is required');
  });

  it('should return 500 error when OpenAI API key is not configured', async () => {
    delete process.env.OPENAI_API_KEY;

    const requestBody = {
      book: {
        title: 'Test Book',
        author_name: ['Test Author']
      }
    };

    const request = new NextRequest('http://localhost:3000/api/ai-recommend', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('OpenAI API key not configured');
  });

  it('should handle user preferences in the request', async () => {
    const requestBody = {
      book: {
        title: 'Dune',
        author_name: ['Frank Herbert'],
        subject: ['Science Fiction']
      },
      userPreferences: {
        genres: ['Science Fiction', 'Space Opera'],
        authors: ['Isaac Asimov', 'Ursula K. Le Guin']
      }
    };

    const request = new NextRequest('http://localhost:3000/api/ai-recommend', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('recommendations');
  });
});
