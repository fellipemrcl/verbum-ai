import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Test component to access theme context
function TestComponent() {
  const { theme, setTheme, effectiveTheme } = useTheme();
  
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="effective-theme">{effectiveTheme}</span>
      <button onClick={() => setTheme('light')} data-testid="light-btn">
        Light
      </button>
      <button onClick={() => setTheme('dark')} data-testid="dark-btn">
        Dark
      </button>
      <button onClick={() => setTheme('system')} data-testid="system-btn">
        System
      </button>
    </div>
  );
}

function renderWithProvider(component: React.ReactElement) {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
}

describe('ThemeContext', () => {
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

  it('should initialize with system theme by default', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    renderWithProvider(<TestComponent />);
    
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
  });

  it('should load saved theme from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    renderWithProvider(<TestComponent />);
    
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('should update theme when setTheme is called', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    renderWithProvider(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('dark-btn'));
    
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should apply theme class to document element', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    renderWithProvider(<TestComponent />);
    
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith('light', 'dark');
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
  });

  it('should use system preference when theme is system', () => {
    // Mock dark mode preference
    (window.matchMedia as jest.Mock).mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    localStorageMock.getItem.mockReturnValue('system');
    
    renderWithProvider(<TestComponent />);
    
    expect(screen.getByTestId('effective-theme')).toHaveTextContent('dark');
  });

  it('should throw error when useTheme is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => render(<TestComponent />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
    
    console.error = originalError;
  });
});
