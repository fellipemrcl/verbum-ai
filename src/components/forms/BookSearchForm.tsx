"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePopularSearches } from "@/hooks/usePopularSearches";

interface BookSearchFormProps {
  onSearch: (query: string) => void;
  onClear?: () => void;
  loading?: boolean;
}

export function BookSearchForm({ onSearch, onClear, loading = false }: BookSearchFormProps) {
  const [query, setQuery] = useState("");
  const { popularSearches, loading: popularLoading } = usePopularSearches();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    
    // Clear results when input is emptied
    if (newValue.trim() === "" && onClear) {
      onClear();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 z-10">
            <svg
              className="w-5 h-5 text-slate-400 dark:text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <Input
            type="text"
            className="flex-1 pl-12 pr-32 py-4 text-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200"
            placeholder="Search for any book, author, or genre..."
            value={query}
            onChange={handleInputChange}
            disabled={loading}
          />
          
          <motion.div
            className="absolute right-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Searching</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Search</span>
                </div>
              )}
            </Button>
          </motion.div>
        </div>
      </form>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-3 flex flex-wrap gap-2"
      >
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {popularLoading ? "Loading popular searches..." : "Popular searches:"}
        </span>
        {popularSearches.map((suggestion, index) => (
          <motion.button
            key={`${suggestion}-${index}`} // Include index to handle potential duplicates
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setQuery(suggestion);
              onSearch(suggestion);
            }}
            className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            disabled={loading || popularLoading}
          >
            {suggestion}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
