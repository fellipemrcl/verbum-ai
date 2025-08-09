"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { RecommendedBook } from "@/types/AITypes";
import { RecommendedBookCard } from "./RecommendedBookCard";

interface RecommendedBooksListProps {
  books: RecommendedBook[];
  onBookSelect: (book: RecommendedBook) => void;
}

export function RecommendedBooksList({ books, onBookSelect }: RecommendedBooksListProps) {
  if (books.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-6 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                AI Recommendations
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {books.length} personalized book{books.length !== 1 ? 's' : ''} for you
              </p>
            </div>
          </div>
          
          <motion.div
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Powered by AI
          </motion.div>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {books.map((book, index) => (
            <RecommendedBookCard 
              key={`${book.title}-${book.author}-${index}`}
              book={book} 
              onClick={onBookSelect}
              index={index}
            />
          ))}
        </motion.div>

        {/* Additional tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <span className="font-semibold">Tip:</span> Click on any recommended book to learn more about it and see additional details.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
