"use client";

import Image from "next/image";
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
import type { Book } from "@/types/BookTypes";

interface BookDetailDialogProps {
  book: Book | null;
  open: boolean;
  onClose: () => void;
}

export function BookDetailDialog({ book, open, onClose }: BookDetailDialogProps) {
  const { recommendation, loading, error, getRecommendation, clearRecommendation } = useAIRecommendations();

  const handleGetRecommendations = () => {
    if (book) {
      getRecommendation(book);
    }
  };

  const handleClose = () => {
    clearRecommendation();
    onClose();
  };

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{book.title}</DialogTitle>
          <DialogDescription>
            {book.author_name && (
              <>by {book.author_name.join(", ")}<br /></>
            )}
            {book.first_publish_year && (
              <>First published: {book.first_publish_year}<br /></>
            )}
            {book.subject && (
              <>Subjects: {book.subject.slice(0, 3).join(", ")}<br /></>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-4 mb-4">
          {book.cover_i ? (
            <Image
              src={getBookCoverUrl(book.cover_i, 'M')}
              alt={book.title}
              width={80}
              height={110}
              className="w-20 h-28 object-cover rounded"
            />
          ) : (
            <div className="w-20 h-28 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
              No Cover
            </div>
          )}
        </div>
        
        <div>
          <Button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleGetRecommendations}
            disabled={loading}
          >
            {loading ? "Getting AI Recommendations..." : "Get AI Recommendations"}
          </Button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded text-red-900 border border-red-200">
              {error}
            </div>
          )}
          
          {recommendation && (
            <div className="mt-4 p-3 bg-blue-50 rounded text-blue-900 border border-blue-200 whitespace-pre-line">
              {recommendation}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
