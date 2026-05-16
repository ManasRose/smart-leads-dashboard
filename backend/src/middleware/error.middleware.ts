import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Error:', err);
  }

  sendError(res, statusCode, message);
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  sendError(res, 404, 'Route not found.');
};
