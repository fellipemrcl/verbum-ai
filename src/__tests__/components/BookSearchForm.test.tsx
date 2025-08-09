import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BookSearchForm } from "@/components/forms/BookSearchForm";

// Mock the usePopularSearches hook
jest.mock("@/hooks/usePopularSearches", () => ({
  usePopularSearches: jest.fn(() => ({
    popularSearches: ["Harry Potter", "Science Fiction", "Mystery", "Biography"],
    loading: false,
    refetch: jest.fn()
  }))
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    div: ({ children, initial, animate, transition, whileHover, whileTap, ...props }: any) => 
      <div {...props}>{children}</div>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any  
    button: ({ children, initial, animate, transition, whileHover, whileTap, ...props }: any) => 
      <button {...props}>{children}</button>
  }
}));

describe("BookSearchForm Component", () => {
  const mockOnSearch = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    mockOnClear.mockClear();
  });

  it("should render search form", async () => {
    await act(async () => {
      render(<BookSearchForm onSearch={mockOnSearch} />);
    });

    expect(
      screen.getByPlaceholderText(/search for any book, author, or genre/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("should handle form submission", async () => {
    await act(async () => {
      render(<BookSearchForm onSearch={mockOnSearch} />);
    });

    const searchInput = screen.getByPlaceholderText(/search for any book, author, or genre/i);
    const searchButton = screen.getByRole("button", { name: /search/i });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "test book" } });
    });
    
    await act(async () => {
      fireEvent.click(searchButton);
    });

    expect(mockOnSearch).toHaveBeenCalledWith("test book");
  });

  it("should disable submit button when loading", async () => {
    await act(async () => {
      render(<BookSearchForm onSearch={mockOnSearch} loading={true} />);
    });

    const searchButton = screen.getByRole("button", { name: /searching/i });
    expect(searchButton).toBeDisabled();
  });

  it("should disable submit button when query is empty", async () => {
    await act(async () => {
      render(<BookSearchForm onSearch={mockOnSearch} />);
    });

    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeDisabled();
  });

  it("should call onClear when input is emptied", async () => {
    await act(async () => {
      render(<BookSearchForm onSearch={mockOnSearch} onClear={mockOnClear} />);
    });

    const searchInput = screen.getByPlaceholderText(/search for any book, author, or genre/i);

    // First, add some text
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "test book" } });
    });
    expect(mockOnClear).not.toHaveBeenCalled();

    // Then, clear the input
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "" } });
    });
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it("should not call onClear when onClear prop is not provided", async () => {
    await act(async () => {
      render(<BookSearchForm onSearch={mockOnSearch} />);
    });

    const searchInput = screen.getByPlaceholderText(/search for any book, author, or genre/i);

    // Add text and then clear it - should not throw error
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "test book" } });
    });
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "" } });
    });

    // No error should occur since onClear is optional
    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});
