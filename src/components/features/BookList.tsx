"use client";

import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 flex items-center justify-between"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Found {books.length} book{books.length !== 1 ? 's' : ''}
        </h3>
        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Search results
        </div>
      </motion.div>
      
      <motion.ul 
        className="space-y-3"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        {books.map((book, index) => (
          <BookCard 
            key={book.key} 
            book={book} 
            onClick={onBookSelect}
            index={index}
          />
        ))}
      </motion.ul>
    </motion.div>
  );
}
