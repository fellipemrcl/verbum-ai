// Validation schemas for the application
// Install zod for proper validation: npm install zod

export const BookSearchSchema = {
  query: (value: string): boolean => {
    return typeof value === 'string' && value.trim().length > 0;
  },
  
  limit: (value: number): boolean => {
    return Number.isInteger(value) && value > 0 && value <= 50;
  },
  
  offset: (value: number): boolean => {
    return Number.isInteger(value) && value >= 0;
  },
};

export const validateBookSearchParams = (params: {
  query: string;
  limit?: number;
  offset?: number;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!BookSearchSchema.query(params.query)) {
    errors.push('Query must be a non-empty string');
  }

  if (params.limit !== undefined && !BookSearchSchema.limit(params.limit)) {
    errors.push('Limit must be a positive integer not exceeding 50');
  }

  if (params.offset !== undefined && !BookSearchSchema.offset(params.offset)) {
    errors.push('Offset must be a non-negative integer');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
