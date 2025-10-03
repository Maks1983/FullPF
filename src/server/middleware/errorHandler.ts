/**
 * Global Error Handler
 * Centralized error handling middleware
 */

import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Default to 500 Internal Server Error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Send error response
  res.status(statusCode).json({
    error: err.name || 'Error',
    message,
    code: err.code,
    timestamp: new Date().toISOString(),
    path: req.path,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
}

/**
 * Create an API error with status code
 */
export function createError(message: string, statusCode: number = 500, code?: string): ApiError {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
}
