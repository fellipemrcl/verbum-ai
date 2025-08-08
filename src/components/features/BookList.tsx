"use client";

import type { Book } from "@/types/BookTypes";
import { BookCard } from "./BookCard";

interface BookListProps {
  books: Book[];
  onBookSelect: (book: Book) => void;
}

export function BookList({ books, onBookSelect }: BookListProps) {
  if (books.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-4">
      {books.map((book) => (
        <BookCard 
          key={book.key} 
          book={book} 
          onClick={onBookSelect} 
        />
      ))}
    </ul>
  );
}
