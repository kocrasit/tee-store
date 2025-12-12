export class ApiError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: unknown;

  constructor(statusCode: number, message: string, opts?: { code?: string; details?: unknown }) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = opts?.code;
    this.details = opts?.details;
  }
}


