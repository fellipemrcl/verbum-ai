"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { RecommendedBook } from "@/types/AITypes";
import type { Book } from "@/types/BookTypes";

interface RecommendedBookDialogProps {
  book: RecommendedBook | null;
  open: boolean;
  onClose: () => void;
  onViewFullDetails?: () => void;
}

export function RecommendedBookDialog({ 
  book, 
  open, 
  onClose, 
  onViewFullDetails 
}: RecommendedBookDialogProps) {

  const handleSearchForBook = async () => {
    if (book) {
      try {
        // Since search doesn't return results directly, we'll use the search API
        const { searchBooks } = await import("@/lib/api/books");
        const searchResults = await searchBooks({
          query: `${book.title} ${book.author}`,
          limit: 10
        });
        
        // Try to find the best match
        const exactMatch = searchResults.find(
          (result: Book) => 
            result.title.toLowerCase().includes(book.title.toLowerCase()) &&
            result.author_name?.some((author: string) => 
              author.toLowerCase().includes(book.author.toLowerCase())
            )
        );
        
        if (exactMatch && onViewFullDetails) {
          // For now, just close the dialog and show a message
          // In a real implementation, you'd want to pass the book back to the parent
          onViewFullDetails();
          onClose();
        } else {
          // If no exact match, show a message or open first result
          alert("Could not find exact match in our database. Try searching manually.");
        }
      } catch (error) {
        console.error("Error searching for recommended book:", error);
        alert("Error searching for book details. Please try again.");
      }
    }
  };

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-slate-900/80 backdrop-blur-md border border-blue-100 dark:border-slate-800/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="text-left space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  {book.title}
                </DialogTitle>
                <DialogDescription className="text-slate-600 dark:text-slate-400 mt-1">
                  AI Recommended Book
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="my-6 space-y-5">
            {/* Author */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Author</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{book.author}</p>
              </div>
            </motion.div>

            {/* Year */}
            {book.year && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Publication Year</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{book.year}</p>
                </div>
              </motion.div>
            )}

            {/* Genres */}
            {book.genres && book.genres.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Genres</p>
                </div>
                <div className="flex flex-wrap gap-2 ml-11">
                  {book.genres.map((genre, index) => (
                    <motion.span
                      key={genre}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.2 }}
                      className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full border border-blue-200 dark:border-blue-800 font-medium"
                    >
                      {genre}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recommendation reason */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800/30"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Why this book was recommended
                  </h4>
                  <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                    {book.reason}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            {book.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {book.description}
                </p>
              </motion.div>
            )}
          </div>
          
          <DialogFooter className="flex gap-3">
            <Button
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-200"
              onClick={handleSearchForBook}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Find Full Details</span>
              </div>
            </Button>
            <DialogClose asChild>
              <Button 
                variant="outline" 
                className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
