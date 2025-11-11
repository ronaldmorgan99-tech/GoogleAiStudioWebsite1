import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

// Problem Details for HTTP APIs (RFC 7807)
interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
    public readonly status: number;
    public readonly detail?: string;

    constructor(status: number, message: string, detail?: string) {
        super(message);
        this.status = status;
        this.detail = detail;
    }
}


export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err); // For logging

  let status = 500;
  let title = 'Internal Server Error';
  let detail = 'An unexpected error occurred.';
  let errors: Record<string, string[]> | undefined;

  if (err instanceof ApiError) {
    status = err.status;
    title = err.message;
    detail = err.detail || err.message;
  } else if (err instanceof ZodError) {
    status = 400;
    title = 'Validation Error';
    detail = 'One or more fields are invalid.';
    errors = err.flatten().fieldErrors;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    status = 400; // Bad Request for most common DB errors
    title = 'Database Error';
    detail = 'There was an issue processing your request.';
    // More specific error handling can be added here based on `err.code`
    if (err.code === 'P2002') { // Unique constraint violation
        status = 409; // Conflict
        title = 'Conflict';
        const target = err.meta?.target as string[];
        detail = `The value for '${target.join(', ')}' is already in use.`;
    }
  }

  const problem: ProblemDetail = {
    type: `https://example.com/probs/${title.toLowerCase().replace(/\s/g, '-')}`,
    title,
    status,
    detail,
    instance: req.originalUrl,
  };
  
  if (errors) {
    problem.errors = errors;
  }
  
  if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore
    problem.stack = err.stack;
  }

  res.status(status).json(problem);
};
