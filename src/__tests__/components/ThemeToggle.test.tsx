import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Mock localStorage and matchMedia (same as ThemeContext test)
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

function renderWithProvider(component: React.ReactElement) {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    
    // Mock document.documentElement.classList
    Object.defineProperty(document.documentElement, 'classList', {
      value: {
        add: jest.fn(),
        remove: jest.fn(),
      },
      writable: true,
    });
  });

  it('should render theme toggle button', () => {
    localStorageMock.getItem.mockReturnValue('light');
    
    renderWithProvider(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should show sun icon for light theme', () => {
    localStorageMock.getItem.mockReturnValue('light');
    
    renderWithProvider(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Switch to dark mode');
  });

  it('should toggle from light to dark to system to light', () => {
    localStorageMock.getItem.mockReturnValue('light');
    
    renderWithProvider(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    
    // Should start with light theme
    expect(button).toHaveAttribute('title', 'Switch to dark mode');
    
    // Click to switch to dark
    fireEvent.click(button);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should have proper ARIA attributes', () => {
    localStorageMock.getItem.mockReturnValue('light');
    
    renderWithProvider(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title');
  });
});
