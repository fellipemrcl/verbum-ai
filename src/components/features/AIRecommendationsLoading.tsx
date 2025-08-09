"use client";

import { motion } from "framer-motion";

interface AIRecommendationsLoadingProps {
  className?: string;
}

export function AIRecommendationsLoading({ className = "" }: AIRecommendationsLoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/30 shadow-lg ${className}`}
    >
      {/* Elegant Spinner */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          delay: 0.2, 
          duration: 0.6, 
          type: "spring", 
          stiffness: 150,
          damping: 10
        }}
        className="relative mb-6"
      >
        <div className="w-32 h-32 flex items-center justify-center">
          {/* Main spinner */}
          <div className="relative">
            {/* Outer ring */}
            <motion.div
              className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Animated ring */}
            <motion.div
              className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-600 border-r-purple-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Inner ring */}
            <motion.div
              className="absolute inset-2 w-16 h-16 border-4 border-transparent border-b-purple-500 border-l-blue-500 rounded-full"
              animate={{ rotate: -360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Center icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Orbiting dots */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="absolute w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              marginTop: "-6px",
              marginLeft: "-6px",
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.8,
            }}
            transformTemplate={({ rotate }) => 
              `translateX(40px) rotate(${rotate}) translateX(-40px) rotate(-${rotate})`
            }
          />
        ))}
      </motion.div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center space-y-3"
      >
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI is Reading & Analyzing...
        </h3>
        
        <motion.p
          className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          Our AI is carefully analyzing this book&apos;s themes, style, and content to find you the perfect recommendations.
        </motion.p>
        
        {/* Animated dots */}
        <motion.div
          className="flex items-center justify-center gap-1 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Progress indicators */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "100%" }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-6 space-y-3 w-full max-w-xs"
      >
        {[
          "Reading book details...",
          "Analyzing themes & style...",
          "Finding similar books...",
          "Generating recommendations..."
        ].map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + index * 0.3, duration: 0.4 }}
            className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400"
          >
            <motion.div
              className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.5,
                ease: "easeInOut"
              }}
            />
            <span>{step}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Fun fact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        className="mt-8 p-4 bg-white/70 dark:bg-slate-800/70 rounded-xl border border-white/50 dark:border-slate-700/50 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            <span className="font-semibold">Did you know?</span> Our AI considers over 50 factors including genre, writing style, themes, and reader preferences to create personalized recommendations.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
