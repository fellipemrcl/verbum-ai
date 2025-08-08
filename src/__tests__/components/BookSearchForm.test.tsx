import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BookSearchForm } from "@/components/forms/BookSearchForm";

describe("BookSearchForm Component", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it("should render search form", () => {
    render(<BookSearchForm onSearch={mockOnSearch} />);

    expect(
      screen.getByPlaceholderText(/search for any book, author, or genre/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("should handle form submission", () => {
    render(<BookSearchForm onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText(/search for any book, author, or genre/i);
    const searchButton = screen.getByRole("button", { name: /search/i });

    fireEvent.change(searchInput, { target: { value: "test book" } });
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith("test book");
  });

  it("should disable submit button when loading", () => {
    render(<BookSearchForm onSearch={mockOnSearch} loading={true} />);

    const searchButton = screen.getByRole("button", { name: /searching/i });
    expect(searchButton).toBeDisabled();
  });

  it("should disable submit button when query is empty", () => {
    render(<BookSearchForm onSearch={mockOnSearch} />);

    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeDisabled();
  });
});
