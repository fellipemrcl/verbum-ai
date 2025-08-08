// Mock for next-auth module
// This file provides mock implementations for testing

const mockSession = {
  user: { 
    id: '1', 
    name: 'Test User', 
    email: 'test@example.com',
    image: 'https://example.com/avatar.jpg'
  },
};

export const useSession = jest.fn(() => ({
  data: mockSession,
  status: 'authenticated',
}));

export const signOut = jest.fn();
export const signIn = jest.fn();
