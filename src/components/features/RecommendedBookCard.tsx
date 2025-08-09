"use client";

import { motion } from "framer-motion";
import type { RecommendedBook } from "@/types/AITypes";

interface RecommendedBookCardProps {
  book: RecommendedBook;
  onClick: (book: RecommendedBook) => void;
  index?: number;
}

export function RecommendedBookCard({ book, onClick, index = 0 }: RecommendedBookCardProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.03,
        y: -6,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.97 }}
      className="group relative bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-blue-100 dark:border-slate-700/50 cursor-pointer transition-all duration-300 overflow-hidden"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for recommended book ${book.title}`}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* AI recommendation badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
        className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </motion.div>

      <div className="relative z-10">
        {/* Book title */}
        <motion.h3
          className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 mb-2 pr-10 leading-tight"
          layout
        >
          {book.title}
        </motion.h3>

        {/* Author */}
        <motion.p
          className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3"
          layout
        >
          by {book.author}
        </motion.p>

        {/* Genres */}
        {book.genres && book.genres.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-1.5 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
          >
            {book.genres.slice(0, 3).map((genre, genreIndex) => (
              <motion.span
                key={genre}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 + genreIndex * 0.05, duration: 0.2 }}
                className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full border border-blue-200 dark:border-blue-800 font-medium"
              >
                {genre}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Year */}
        {book.year && (
          <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{book.year}</span>
          </motion.div>
        )}

        {/* Recommendation reason */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">
                Why it&apos;s recommended
              </h4>
              <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                {book.reason}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Description if available */}
        {book.description && (
          <motion.p
            className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
          >
            {book.description}
          </motion.p>
        )}
      </div>

      {/* Click indicator */}
      <motion.div
        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        whileHover={{ scale: 1.1 }}
      >
        <div className="w-8 h-8 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="w-4 h-4 text-white"
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
        </div>
      </motion.div>
    </motion.div>
  );
}
