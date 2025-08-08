"use client";

import Image from "next/image";
import { getBookCoverUrl } from "@/lib/api/books";
import type { Book } from "@/types/BookTypes";

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

export function BookCard({ book, onClick }: BookCardProps) {
  const handleClick = () => {
    onClick(book);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(book);
    }
  };

  return (
    <li
      className="flex gap-4 items-center bg-gray-50 p-3 rounded shadow cursor-pointer hover:bg-blue-50 transition"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${book.title}`}
    >
      {book.cover_i ? (
        <Image
          src={getBookCoverUrl(book.cover_i, 'S')}
          alt={book.title}
          width={48}
          height={64}
          className="w-12 h-16 object-cover rounded"
        />
      ) : (
        <div className="w-12 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
          No Cover
        </div>
      )}
      <div>
        <div className="font-semibold">{book.title}</div>
        {book.author_name && (
          <div className="text-sm text-gray-600">
            by {book.author_name.join(", ")}
          </div>
        )}
      </div>
    </li>
  );
}
