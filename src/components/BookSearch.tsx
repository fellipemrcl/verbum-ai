// src/components/BookSearch.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "./ui/dialog";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
}

interface BookDetail extends Book {
  first_publish_year?: number;
  subject?: string[];
  // Add more fields as needed
}

export default function BookSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedBook, setSelectedBook] = useState<BookDetail | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string>("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=10`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setResults(data.docs || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleBookClick(book: BookDetail) {
    setSelectedBook(book);
    setDialogOpen(true);
    setAiRecommendation("");
  }

  async function handleAIRecommend() {
    if (!selectedBook) return;
    setAiLoading(true);
    setAiRecommendation("");
    try {
      // This should call your backend API route that uses OpenAI
      // For demo, we'll just fake a response
      // const res = await fetch("/api/ai-recommend", { method: "POST", body: JSON.stringify(selectedBook) });
      // const data = await res.json();
      // setAiRecommendation(data.recommendation);
      await new Promise(r => setTimeout(r, 1200));
      setAiRecommendation("Here are some AI-powered recommendations based on this book!");
    } catch {
      setAiRecommendation("Failed to get recommendations.");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Search for a book title..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="space-y-4">
        {results.map(book => (
          <li
            key={book.key}
            className="flex gap-4 items-center bg-gray-50 p-3 rounded shadow cursor-pointer hover:bg-blue-50 transition"
            onClick={() => handleBookClick(book)}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${book.title}`}
          >
            {book.cover_i ? (
              <Image
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
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
                <div className="text-sm text-gray-600">by {book.author_name.join(", ")}</div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedBook && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedBook.title}</DialogTitle>
              <DialogDescription>
                {selectedBook.author_name && (
                  <>by {selectedBook.author_name.join(", ")}<br /></>
                )}
                {selectedBook.first_publish_year && (
                  <>First published: {selectedBook.first_publish_year}<br /></>
                )}
                {selectedBook.subject && (
                  <>Subjects: {selectedBook.subject.slice(0, 3).join(", ")}<br /></>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-4 mb-4">
              {selectedBook.cover_i ? (
                <Image
                  src={`https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-M.jpg`}
                  alt={selectedBook.title}
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
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={handleAIRecommend}
                disabled={aiLoading}
              >
                {aiLoading ? "Getting AI Recommendations..." : "Get AI Recommendations"}
              </button>
              {aiRecommendation && (
                <div className="mt-4 p-3 bg-blue-50 rounded text-blue-900 border border-blue-200">
                  {aiRecommendation}
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">Close</button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
