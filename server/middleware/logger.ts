/**
 * Request Logger Middleware
 * Logs incoming requests for monitoring and debugging
 */

import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // Log request
  if (config.logLevel === 'debug') {
    console.log(`→ ${req.method} ${req.path}`, {
      query: req.query,
      ip: req.ip,
    });
  }

  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'error' : 'info';

    if (config.logLevel === 'debug' || level === 'error') {
      console.log(`← ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    }
  });

  next();
}
