"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { getBookCoverUrl } from "@/lib/api/books";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { RecommendedBooksList } from "./RecommendedBooksList";
import { RecommendedBookDialog } from "./RecommendedBookDialog";
import { AIRecommendationsLoading } from "./AIRecommendationsLoading";
import type { Book } from "@/types/BookTypes";
import type { RecommendedBook } from "@/types/AITypes";

interface BookDetailDialogProps {
  book: Book | null;
  open: boolean;
  onClose: () => void;
}

export function BookDetailDialog({ book, open, onClose }: BookDetailDialogProps) {
  const { recommendedBooks, loading, error, getRecommendation, clearRecommendation } = useAIRecommendations();
  const [selectedRecommendedBook, setSelectedRecommendedBook] = useState<RecommendedBook | null>(null);
  const [recommendedBookDialogOpen, setRecommendedBookDialogOpen] = useState(false);

  const handleGetRecommendations = () => {
    if (book) {
      getRecommendation(book);
    }
  };

  const handleRecommendedBookSelect = (recommendedBook: RecommendedBook) => {
    setSelectedRecommendedBook(recommendedBook);
    setRecommendedBookDialogOpen(true);
  };

  const handleRecommendedBookDialogClose = () => {
    setRecommendedBookDialogOpen(false);
    setSelectedRecommendedBook(null);
  };

  const handleViewFullBookDetails = () => {
    // This will replace the current book in the dialog
    handleRecommendedBookDialogClose();
    clearRecommendation();
    // We need to update the main dialog with the new book
    // This requires lifting state up to the parent component
  };

  const handleClose = () => {
    clearRecommendation();
    onClose();
  };

  if (!book) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/20 dark:border-slate-800/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <DialogHeader className="text-left space-y-3">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {book.title}
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Book details and AI recommendations
              </DialogDescription>
              <div className="text-slate-600 dark:text-slate-400 space-y-1">
                {book.author_name && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>by {book.author_name.join(", ")}</span>
                  </div>
                )}
                {book.first_publish_year && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>First published: {book.first_publish_year}</span>
                  </div>
                )}
              </div>
            </DialogHeader>
            
            <div className="flex gap-6 my-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex-shrink-0"
              >
                {book.cover_i ? (
                  <div className="relative group">
                    <Image
                      src={getBookCoverUrl(book.cover_i, 'M')}
                      alt={book.title}
                      width={120}
                      height={160}
                      className="w-30 h-40 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  </div>
                ) : (
                  <div className="w-30 h-40 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 rounded-lg shadow-lg">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-xs">No Cover</span>
                  </div>
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex-1 space-y-4"
              >
                {book.subject && book.subject.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Genres & Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {book.subject.slice(0, 6).map((subject, index) => (
                        <motion.span
                          key={subject}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.2 }}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full border border-blue-200 dark:border-blue-800"
                        >
                          {subject}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg disabled:opacity-50 transition-all duration-200"
                    onClick={handleGetRecommendations}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Getting AI Recommendations...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span>Get AI Recommendations</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/50">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                          Recommendation Error
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Recommendations Loading State */}
            <AnimatePresence>
              {loading && (
                <AIRecommendationsLoading className="mt-6" />
              )}
            </AnimatePresence>

            {/* Beautiful Recommended Books Display */}
            {!loading && (
              <RecommendedBooksList 
                books={recommendedBooks} 
                onBookSelect={handleRecommendedBookSelect} 
              />
            )}
            
            <DialogFooter className="mt-6">
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

      {/* Recommended Book Detail Dialog */}
      <RecommendedBookDialog
        book={selectedRecommendedBook}
        open={recommendedBookDialogOpen}
        onClose={handleRecommendedBookDialogClose}
        onViewFullDetails={handleViewFullBookDetails}
      />
    </>
  );
}
