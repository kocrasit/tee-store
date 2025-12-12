import { Response } from 'express';

export type ApiSuccessResponse<T> = {
  success: true;
  message?: string;
  data?: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  code?: string;
  errors?: unknown;
  stack?: unknown;
};

export function sendSuccess<T>(
  res: Response,
  opts: { statusCode?: number; message?: string; data?: T } = {}
) {
  const { statusCode = 200, message, data } = opts;
  const payload: ApiSuccessResponse<T> = {
    success: true,
    ...(message ? { message } : {}),
    ...(data !== undefined ? { data } : {}),
  };
  return res.status(statusCode).json(payload);
}


