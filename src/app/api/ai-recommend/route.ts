import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { AIRecommendationRequest, AIRecommendationResponse, RecommendedBook } from "@/types/AITypes";

// Configuration constants
const OPENAI_MODEL = "gpt-4o-mini"; // Using the requested GPT-4o-mini model
const MAX_TOKENS = 1200;
const TEMPERATURE = 0.7;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Parse request body
    const body: AIRecommendationRequest = await request.json();
    const { book, userPreferences } = body;

    // Validate required fields
    if (!book || !book.title) {
      return NextResponse.json(
        { error: "Book title is required" },
        { status: 400 }
      );
    }

    // Build the prompt for GPT-4
    const prompt = buildRecommendationPrompt(book, userPreferences);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable book recommendation AI assistant. Provide thoughtful, personalized book recommendations based on the given book and user preferences. 

IMPORTANT: You must respond with BOTH:
1. A readable text description of your recommendations
2. A valid JSON array of recommended books in this exact format:

{"recommendedBooks": [{"title": "Book Title", "author": "Author Name", "reason": "Brief explanation why it's similar", "description": "One sentence description", "genres": ["genre1", "genre2"], "year": 2020}]}

Make sure the JSON is valid and parseable. Include 4-6 book recommendations.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: "Failed to generate recommendations" },
        { status: 500 }
      );
    }

    // Try to extract JSON from the response
    let recommendedBooks: RecommendedBook[] = [];
    const recommendations = aiResponse;

    try {
      // Look for JSON in the response
      const jsonMatch = aiResponse.match(/\{[^}]*"recommendedBooks"[^}]*\[[\s\S]*?\]\s*\}/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        if (jsonData.recommendedBooks && Array.isArray(jsonData.recommendedBooks)) {
          recommendedBooks = jsonData.recommendedBooks;
        }
      }
    } catch (error) {
      console.warn("Failed to parse JSON from AI response:", error);
      // If JSON parsing fails, try to parse the text format
      recommendedBooks = parseTextRecommendations(aiResponse);
    }

    const response: AIRecommendationResponse = {
      recommendations,
      recommendedBooks,
      reasoning: "Recommendations generated based on book content, genre, writing style, and thematic elements."
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error generating AI recommendations:", error);

    // Handle OpenAI specific errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "Invalid OpenAI API key" },
          { status: 401 }
        );
      }
      
      if (error.message.includes("quota")) {
        return NextResponse.json(
          { error: "OpenAI API quota exceeded" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error while generating recommendations" },
      { status: 500 }
    );
  }
}

function parseTextRecommendations(text: string): RecommendedBook[] {
  const recommendations: RecommendedBook[] = [];
  
  // Try to parse numbered list format
  const lines = text.split('\n');
  let currentRec: Partial<RecommendedBook> = {};
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Look for numbered items (1., 2., etc.) or bullet points
    const titleMatch = trimmed.match(/^[\d\-•*]\s*(.+?)(?:\s+by\s+(.+?))?$/);
    if (titleMatch) {
      // Save previous recommendation if exists
      if (currentRec.title && currentRec.author) {
        recommendations.push({
          title: currentRec.title,
          author: currentRec.author,
          reason: currentRec.reason || "Similar themes and style",
          description: currentRec.description,
          genres: currentRec.genres || [],
          year: currentRec.year
        });
      }
      
      // Start new recommendation
      currentRec = {
        title: titleMatch[1].replace(/[""]/g, '').trim(),
        author: titleMatch[2]?.trim() || "Unknown",
        reason: "",
        description: ""
      };
    } else if (trimmed && currentRec.title && !currentRec.reason) {
      // This might be the description/reason
      currentRec.reason = trimmed;
    }
  }
  
  // Add the last recommendation
  if (currentRec.title && currentRec.author) {
    recommendations.push({
      title: currentRec.title,
      author: currentRec.author,
      reason: currentRec.reason || "Similar themes and style",
      description: currentRec.description,
      genres: currentRec.genres || [],
      year: currentRec.year
    });
  }
  
  return recommendations;
}

function buildRecommendationPrompt(
  book: { title: string; author_name?: string[]; subject?: string[] },
  userPreferences?: { genres?: string[]; authors?: string[] }
): string {
  let prompt = `Based on the book "${book.title}"`;

  // Add author information if available
  if (book.author_name && book.author_name.length > 0) {
    prompt += ` by ${book.author_name.join(", ")}`;
  }

  // Add genre/subject information if available
  if (book.subject && book.subject.length > 0) {
    const genres = book.subject.slice(0, 5).join(", ");
    prompt += ` (genres/subjects: ${genres})`;
  }

  // Add user preferences if provided
  if (userPreferences) {
    if (userPreferences.genres && userPreferences.genres.length > 0) {
      prompt += `\n\nUser prefers these genres: ${userPreferences.genres.join(", ")}`;
    }
    if (userPreferences.authors && userPreferences.authors.length > 0) {
      prompt += `\n\nUser enjoys books by: ${userPreferences.authors.join(", ")}`;
    }
  }

  prompt += `\n\nPlease recommend 4-6 similar books that readers would enjoy. For each recommendation, include:
1. Book title and author
2. A brief explanation of why it's similar or appealing
3. What specific elements connect it to the original book

After your text response, include a JSON object with the following format:
{"recommendedBooks": [{"title": "Book Title", "author": "Author Name", "reason": "Brief explanation why it's similar", "description": "One sentence description", "genres": ["genre1", "genre2"], "year": 2020}]}

Format your text response as a numbered list with clear, engaging descriptions.`;

  return prompt;
}
