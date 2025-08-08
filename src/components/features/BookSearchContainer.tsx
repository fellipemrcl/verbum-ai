"use client";

import { useState } from "react";
import { useBookSearch } from "@/hooks/useBookSearch";
import { BookSearchForm } from "@/components/forms/BookSearchForm";
import { BookList } from "@/components/features/BookList";
import { BookDetailDialog } from "@/components/features/BookDetailDialog";
import type { Book } from "@/types/BookTypes";

export function BookSearchContainer() {
  const { books, loading, error, search } = useBookSearch();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearch = (query: string) => {
    search(query);
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      <BookSearchForm onSearch={handleSearch} loading={loading} />
      
      {error && (
        <div className="text-red-600 mb-2 p-3 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}
      
      <BookList books={books} onBookSelect={handleBookSelect} />
      
      <BookDetailDialog
        book={selectedBook}
        open={dialogOpen}
        onClose={handleDialogClose}
      />
    </div>
  );
}
