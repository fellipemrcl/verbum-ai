"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getBookCoverUrl } from "@/lib/api/books";
import type { Book } from "@/types/BookTypes";

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
  index?: number;
}

export function BookCard({ book, onClick, index = 0 }: BookCardProps) {
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
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className="group flex gap-4 items-center bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-xl border border-slate-200/50 dark:border-slate-700/50 cursor-pointer transition-all duration-300"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${book.title}`}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className="relative flex-shrink-0"
      >
        {book.cover_i ? (
          <div className="relative overflow-hidden rounded-lg shadow-md">
            <Image
              src={getBookCoverUrl(book.cover_i, 'S')}
              alt={book.title}
              width={48}
              height={64}
              className="w-12 h-16 object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="w-12 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 rounded-lg shadow-md border border-slate-300 dark:border-slate-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )}
      </motion.div>
      
      <div className="flex-1 min-w-0">
        <motion.h3
          className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate"
          layout
        >
          {book.title}
        </motion.h3>
        {book.author_name && (
          <motion.p
            className="text-sm text-slate-600 dark:text-slate-400 mt-1 truncate"
            layout
          >
            by {book.author_name.join(", ")}
          </motion.p>
        )}
        {book.first_publish_year && (
          <motion.span
            className="inline-block text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full mt-2"
            layout
          >
            {book.first_publish_year}
          </motion.span>
        )}
      </div>
      
      <motion.div
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        whileHover={{ scale: 1.1 }}
      >
        <svg
          className="w-5 h-5 text-blue-500 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </motion.div>
    </motion.li>
  );
}
