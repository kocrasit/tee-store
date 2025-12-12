import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const isProd = process.env.NODE_ENV === 'production';

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      code: 'VALIDATION_ERROR',
      errors: err.flatten(),
      ...(isProd ? {} : { stack: err.stack }),
    });
  }

  // Mongoose common errors
  if (err?.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid id',
      code: 'INVALID_ID',
      ...(isProd ? {} : { stack: err.stack }),
    });
  }

  const statusCode =
    err instanceof ApiError
      ? err.statusCode
      : res.statusCode && res.statusCode !== 200
        ? res.statusCode
        : 500;

  return res.status(statusCode).json({
    success: false,
    message: err?.message || 'Internal Server Error',
    ...(err instanceof ApiError && err.code ? { code: err.code } : {}),
    ...(err instanceof ApiError && err.details !== undefined ? { errors: err.details } : {}),
    ...(isProd ? {} : { stack: err?.stack }),
  });
}


