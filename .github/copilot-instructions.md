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

### Quality Assurance Workflow
**ALWAYS perform these checks after making any code changes:**

1. **Type Checking**: Run `npx tsc --noEmit` to verify TypeScript types
2. **Linting**: Run `npm run lint` to check for code style and potential errors
3. **Testing**: Run `npm test` to ensure all tests pass
4. **Test Coverage**: Use `npm run test:coverage` for coverage validation

```bash
# Quality check sequence after changes
npx tsc --noEmit      # Check TypeScript errors
npm run lint          # Check ESLint errors
npm test              # Run test suite
npm run test:coverage # Verify coverage thresholds
```

**Never commit code that:**
- Has TypeScript compilation errors
- Fails ESLint checks
- Breaks existing tests
- Reduces test coverage below thresholds

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
npm install framer-motion  # For animations and transitions
# Configure .env with DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OPENAI_API_KEY
npx prisma migrate dev --name init
npm run dev  # Uses --turbopack flag for faster builds
```

### Git Commit Conventions (Semantic Commits)
Follow conventional commit format for clear, automated versioning and changelog generation:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Commit Types
- **feat**: New feature for the user
- **fix**: Bug fix for the user
- **docs**: Documentation changes
- **style**: Code formatting, missing semicolons, etc.
- **refactor**: Code changes that neither fix bugs nor add features
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI configuration
- **chore**: Maintenance tasks, dependency updates

#### Examples
```bash
feat(auth): add Google OAuth authentication
fix(search): handle empty search results gracefully
docs(readme): update installation instructions
style(components): format code with prettier
refactor(hooks): extract book search logic to custom hook
test(api): add unit tests for book search functionality
perf(images): optimize book cover loading
build(deps): upgrade next.js to version 15
```

#### Scope Guidelines
- **auth**: Authentication and authorization
- **search**: Book search functionality
- **recommendations**: AI recommendation features
- **ui**: UI components and styling
- **api**: API routes and external integrations
- **db**: Database and Prisma changes
- **types**: TypeScript type definitions

### Shadcn UI Components
- Configured for "new-york" style with CSS variables in `components.json`
- Import paths use `@/components/ui/*` aliases
- Dialog component pattern shown in `BookSearch.tsx` for book details modal

### Styling Conventions
- **Tailwind CSS** with dark mode support
- Custom font loading: Geist Sans & Geist Mono in `layout.tsx`
- Responsive design patterns in main components
- Color scheme: Blue primary (`bg-blue-600`), gray neutrals

### Animation & Motion
- **Framer Motion** for smooth animations and transitions
- Use motion components for page transitions, modals, and interactive elements
- Implement micro-interactions for better user experience
- Animate book cards, search results, and recommendation displays

```tsx
// Animation example
import { motion } from "framer-motion";

export function BookCard({ book }: { book: Book }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="book-card"
    >
      {/* Card content */}
    </motion.div>
  );
}
```

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

### Pre-Commit Quality Checks
Before committing any changes, always run the complete quality check pipeline:

```bash
# Complete quality validation pipeline
npm run lint:check    # Check linting issues
npm run type:check    # TypeScript compilation check
npm test              # Run full test suite
npm run test:coverage # Verify coverage meets thresholds

# Fix issues if found
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code with Prettier
```

**Quality Gates:**
- ✅ No TypeScript errors
- ✅ No ESLint violations
- ✅ All tests passing
- ✅ Coverage above 70% threshold
- ✅ Code properly formatted

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

## Git Workflow Best Practices
- Use semantic commits for all changes
- Create feature branches for new functionality
- Write descriptive commit messages with proper scope
- Squash commits when merging to maintain clean history
- Use conventional commit format for automated versioning
- **NEVER create giant commits with all changes together**
- **ALWAYS group related files into logical, focused commits**

### Commit Grouping Strategy

**✅ DO: Create focused, logical commits**
- Group files by feature scope (e.g., all AI recommendation components together)
- Group by change type (e.g., all type definitions in one commit, tests in another)
- Group by architectural layer (e.g., API routes, UI components, hooks separately)
- Keep related changes together (e.g., component + its test + its types)

**❌ DON'T: Create monolithic commits**
- Never commit all modified files at once with `git add .`
- Don't mix unrelated changes (e.g., UI updates + API changes + tests)
- Don't group files just because they were modified at the same time

### Recommended Commit Grouping Patterns

1. **Feature Components Group**
   ```bash
   # Group related UI components and their immediate dependencies
   git add src/components/features/RecommendedBookCard.tsx
   git add src/components/features/RecommendedBookDialog.tsx
   git add src/components/features/RecommendedBooksList.tsx
   git commit -m "feat(recommendations): add recommended book UI components"
   ```

2. **Type Definitions Group**
   ```bash
   # Group type definitions and interfaces
   git add src/types/AITypes.ts
   git add src/types/BookTypes.ts
   git commit -m "feat(types): add AI recommendation type definitions"
   ```

3. **API Layer Group**
   ```bash
   # Group API routes and client functions
   git add src/app/api/ai-recommend/route.ts
   git add src/lib/api/openai.ts
   git commit -m "feat(api): implement AI recommendation API endpoint"
   ```

4. **Hook Logic Group**
   ```bash
   # Group custom hooks and their logic
   git add src/hooks/useAIRecommendations.ts
   git commit -m "feat(hooks): add AI recommendations custom hook"
   ```

5. **Test Coverage Group**
   ```bash
   # Group tests for related functionality
   git add src/__tests__/api/ai-recommend.test.ts
   git add src/__tests__/lib/openai.test.ts
   git add src/__tests__/hooks/useAIRecommendations.test.ts
   git commit -m "test(recommendations): add comprehensive test coverage for AI features"
   ```

6. **Integration Updates Group**
   ```bash
   # Group files that integrate new features into existing components
   git add src/components/features/BookDetailDialog.tsx
   git commit -m "feat(recommendations): integrate AI recommendations into book detail dialog"
   ```

### Example Development Flow with Proper Commit Grouping
```bash
# Create feature branch
git checkout -b feat/book-recommendations

# Step 1: Add type definitions first
git add src/types/AITypes.ts
git commit -m "feat(types): add RecommendedBook and AI response types"

# Step 2: Implement API layer
git add src/app/api/ai-recommend/route.ts
git add src/lib/api/openai.ts
git commit -m "feat(api): implement OpenAI recommendation API endpoint"

# Step 3: Create custom hook
git add src/hooks/useAIRecommendations.ts
git commit -m "feat(hooks): add useAIRecommendations hook for state management"

# Step 4: Build UI components
git add src/components/features/RecommendedBookCard.tsx
git add src/components/features/RecommendedBookDialog.tsx
git add src/components/features/RecommendedBooksList.tsx
git commit -m "feat(ui): add recommended books display components"

# Step 5: Integrate into existing components
git add src/components/features/BookDetailDialog.tsx
git commit -m "feat(recommendations): integrate AI recommendations into book details"

# Step 6: Add comprehensive tests
git add src/__tests__/api/ai-recommend.test.ts
git add src/__tests__/lib/openai.test.ts
git commit -m "test(api): add tests for AI recommendation endpoints"

git add src/__tests__/hooks/useAIRecommendations.test.ts
git commit -m "test(hooks): add tests for AI recommendations hook"

# Quality check after each commit group
npx tsc --noEmit && npm run lint && npm test

# Final quality check before push
npm run lint:check && npm run type:check && npm test

# Push and create pull request
git push origin feat/book-recommendations
```

### Commit Message Guidelines for Grouped Changes
- **Be specific about what the group contains**: "add UI components" vs "add RecommendedBookCard, Dialog, and List components"
- **Use scope to indicate the layer**: `feat(api)`, `feat(ui)`, `feat(hooks)`, `test(api)`
- **Reference related files in body if needed**:
  ```bash
  git commit -m "feat(ui): add recommended books display components
  
  - RecommendedBookCard: individual book recommendation display
  - RecommendedBookDialog: detailed book information modal  
  - RecommendedBooksList: grid layout for multiple recommendations"
  ```

### Pre-Commit Quality Checks (Per Commit Group)
Run quality checks after each logical commit group to catch issues early:

```bash
# After each commit group
npx tsc --noEmit      # Verify TypeScript
npm run lint          # Check ESLint
npm test              # Run affected tests

# Fix issues immediately before next commit group
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code with Prettier
```
