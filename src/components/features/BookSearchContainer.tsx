"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookSearch } from "@/hooks/useBookSearch";
import { BookSearchForm } from "@/components/forms/BookSearchForm";
import { BookList } from "@/components/features/BookList";
import { BookDetailDialog } from "@/components/features/BookDetailDialog";
import type { Book } from "@/types/BookTypes";

export function BookSearchContainer() {
  const { books, loading, error, search, clearResults } = useBookSearch();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearch = (query: string) => {
    search(query);
  };

  const handleClear = () => {
    clearResults();
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-800/50 p-8"
      >
        <BookSearchForm onSearch={handleSearch} onClear={handleClear} loading={loading} />
        
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Search Error
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 flex items-center justify-center py-8"
            >
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
                />
                <span className="text-sm font-medium">Searching for books...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <BookList books={books} onBookSelect={handleBookSelect} />
        
        {!loading && books.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                className="w-8 h-8 text-slate-400 dark:text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </motion.div>
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
              Start Your Book Discovery Journey
            </h3>
            <p className="text-slate-500 dark:text-slate-500 max-w-md mx-auto">
              Search for any book title, author, or genre to get personalized AI recommendations.
            </p>
          </motion.div>
        )}
      </motion.div>
      
      <BookDetailDialog
        book={selectedBook}
        open={dialogOpen}
        onClose={handleDialogClose}
      />
    </motion.div>
  );
}
