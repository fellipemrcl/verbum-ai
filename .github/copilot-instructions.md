# Copilot Instructions for Verbum AI

## Project Overview
Verbum AI is a Next.js 15 book recommendation app using App Router with TypeScript. Users sign in via Google OAuth to search books (Open Library API) and get AI-powered recommendations (OpenAI API).

## Clean Code & Scalable Architecture

### Project Structure (Organized & Scalable)
```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                # Shadcn UI primitives
│   ├── forms/             # Form components (reusable)
│   ├── layout/            # Layout components (Header, Footer)
│   └── features/          # Feature-specific components
├── lib/
│   ├── auth/              # Authentication utilities
│   ├── api/               # API client functions
│   ├── utils/             # Shared utilities
│   └── validations/       # Zod schemas & validation
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── constants/             # App constants & config
└── __tests__/             # Test files
```

### Authentication Flow
- **NextAuth.js** with Google provider in `src/app/api/auth/[...nextauth]/route.ts`
- JWT session strategy with custom session callback for user ID mapping
- Authentication state managed via `ClientHeaderProvider` wrapper around entire app
- Conditional rendering in `page.tsx` based on `useSession()` status

### Component Architecture (Clean Separation)
```
src/app/layout.tsx (root)
├── ClientHeaderProvider (SessionProvider wrapper)
│   ├── Header (auth-aware navigation)
│   └── {children}
```

## Code Organization & Clean Patterns

### Single Responsibility Principle
- **Components**: One purpose per component (e.g., `BookCard`, `SearchForm`, `RecommendationList`)
- **Custom hooks**: Extract logic (`useBookSearch`, `useAIRecommendations`)
- **API functions**: Separate data fetching (`lib/api/books.ts`, `lib/api/openai.ts`)

### File Naming Conventions
- **Components**: PascalCase (`BookSearch.tsx`, `UserProfile.tsx`)
- **Utilities**: camelCase (`formatBookData.ts`, `validateInput.ts`)
- **Types**: PascalCase with suffix (`BookType.ts`, `UserTypes.ts`)
- **Test files**: `*.test.ts` or `*.spec.ts`

### Code Quality Standards
- **ESLint**: Enforce consistent code style and catch errors
- **TypeScript strict mode**: Enable all strict type checking
- **Prettier**: Auto-format code consistently
- **Import organization**: Group imports (external → internal → relative)

```tsx
// Clean component example
import { useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { useBookSearch } from "@/hooks/useBookSearch";
import { BookCard } from "@/components/features/BookCard";
import type { Book } from "@/types/BookTypes";

export function BookSearchContainer() {
  const { data: session } = useSession();
  const { books, loading, search } = useBookSearch();
  
  // Component logic here
}
```

### Database & Prisma Setup
- **Custom Prisma output**: `src/generated/prisma` (not default `node_modules/.prisma`)
- PostgreSQL database via environment variable `DATABASE_URL`
- Use `npx prisma studio` for visual database browsing
- Run `npx prisma migrate dev --name [description]` for schema changes

### External API Integration
- **Open Library API**: Book search via `https://openlibrary.org/search.json`
- **OpenAI API**: Set `OPENAI_API_KEY` in `.env` (placeholder implementation in `BookSearch.tsx`)
- **Image handling**: Book covers from `covers.openlibrary.org` (configured in `next.config.ts`)

## Development Workflow

### Environment Setup
```bash
npm install
# Configure .env with DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OPENAI_API_KEY
npx prisma migrate dev --name init
npm run dev  # Uses --turbopack flag for faster builds
```

### Shadcn UI Components
- Configured for "new-york" style with CSS variables in `components.json`
- Import paths use `@/components/ui/*` aliases
- Dialog component pattern shown in `BookSearch.tsx` for book details modal

### Styling Conventions
- **Tailwind CSS** with dark mode support
- Custom font loading: Geist Sans & Geist Mono in `layout.tsx`
- Responsive design patterns in main components
- Color scheme: Blue primary (`bg-blue-600`), gray neutrals

## Testing Strategy

### Testing Framework Setup
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev jest jest-environment-jsdom
npm install --save-dev @types/jest
```

### Test Structure & Organization
```
src/
├── __tests__/
│   ├── components/        # Component unit tests
│   ├── hooks/            # Custom hook tests
│   ├── lib/              # Utility function tests
│   ├── pages/            # Page integration tests
│   └── __mocks__/        # Mock implementations
├── components/
│   └── BookSearch.test.tsx  # Co-located tests (alternative)
```

### Testing Patterns

#### Component Testing
```tsx
// src/__tests__/components/BookSearch.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import BookSearch from '@/components/BookSearch';

const renderWithSession = (component: React.ReactElement) => {
  return render(
    <SessionProvider session={mockSession}>
      {component}
    </SessionProvider>
  );
};

describe('BookSearch Component', () => {
  it('should render search form', () => {
    renderWithSession(<BookSearch />);
    expect(screen.getByPlaceholderText(/search for a book/i)).toBeInTheDocument();
  });

  it('should handle search submission', async () => {
    renderWithSession(<BookSearch />);
    const searchInput = screen.getByPlaceholderText(/search for a book/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(searchInput, { target: { value: 'test book' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/searching/i)).toBeInTheDocument();
    });
  });
});
```

#### API Testing
```tsx
// src/__tests__/lib/api/books.test.ts
import { searchBooks } from '@/lib/api/books';

// Mock fetch globally
global.fetch = jest.fn();

describe('Books API', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should fetch books successfully', async () => {
    const mockResponse = { docs: [{ title: 'Test Book' }] };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await searchBooks('test');
    expect(result).toEqual(mockResponse.docs);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('openlibrary.org/search.json')
    );
  });
});
```

#### Custom Hook Testing
```tsx
// src/__tests__/hooks/useBookSearch.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useBookSearch } from '@/hooks/useBookSearch';

describe('useBookSearch Hook', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useBookSearch());
    
    expect(result.current.books).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });
});
```

### Mock Patterns
```tsx
// src/__tests__/__mocks__/next-auth.ts
export const useSession = jest.fn(() => ({
  data: {
    user: { id: '1', name: 'Test User', email: 'test@example.com' },
  },
  status: 'authenticated',
}));

// src/__tests__/__mocks__/openai.ts
export const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn(() => 
        Promise.resolve({
          choices: [{ message: { content: 'Mock recommendation' } }],
        })
      ),
    },
  },
};
```

### Test Configuration
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Testing Commands
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
npm run test:ci       # CI-friendly test run
```

## Code Patterns & Conventions

### Client vs Server Components
- Most interactive components are `"use client"` due to auth state dependency
- Server components for static content only
- Auth state accessed via `useSession()` hook from NextAuth

### State Management Pattern
```tsx
// BookSearch.tsx example - local state for API interactions
const [loading, setLoading] = useState(false);
const [results, setResults] = useState<Book[]>([]);
const [error, setError] = useState("");
```

### Error Handling
- Try-catch blocks with user-friendly error messages
- Loading states for async operations
- Graceful degradation for missing book covers

### TypeScript Interfaces
- Define API response shapes (`Book`, `BookDetail` interfaces)
- Extend NextAuth types for custom session properties
- Proper typing for component props and state

## Key Files to Understand
- `src/app/page.tsx`: Main app logic with conditional auth rendering
- `src/components/BookSearch.tsx`: Core book search and recommendation feature
- `src/components/ClientHeaderProvider.tsx`: Authentication context wrapper
- `prisma/schema.prisma`: Database schema (currently minimal setup)
- `next.config.ts`: Image domain allowlist for external APIs

## Environment Variables Required
```
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
OPENAI_API_KEY=...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
```

## Common Commands
- `npm run dev` - Development server with Turbopack
- `npx prisma studio` - Database browser
- `npx prisma generate` - Regenerate client after schema changes
- `npx shadcn@latest add [component]` - Add new UI components
- `npm test` - Run test suite
- `npm run test:coverage` - Generate test coverage report
