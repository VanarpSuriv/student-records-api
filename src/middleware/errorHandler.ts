import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Validation failed', details: ['Malformed JSON'] });
  }

  const statusCode = err.statusCode || 500;
  
  if (statusCode === 500) {
    console.error('Unhandled Error:', err);
  }

  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(err.details && { details: err.details }),
    statusCode
  });
};
