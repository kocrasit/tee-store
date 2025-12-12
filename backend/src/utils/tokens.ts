import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { Response } from 'express';

export type TokenPair = { accessToken: string; refreshToken: string };

const ACCESS_TOKEN_COOKIE = 'jwt';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

export function signAccessToken(payload: { userId: string }) {
  const secret: Secret = process.env.JWT_SECRET || 'secret';
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? '15m') as SignOptions['expiresIn'];
  return jwt.sign(payload, secret, { expiresIn });
}

export function signRefreshToken(payload: { userId: string }) {
  const secret: Secret = process.env.JWT_REFRESH_SECRET || 'refreshsecret';
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'];
  return jwt.sign(payload, secret, { expiresIn });
}

export function issueTokenPair(userId: string): TokenPair {
  return {
    accessToken: signAccessToken({ userId }),
    refreshToken: signRefreshToken({ userId }),
  };
}

export function setAuthCookies(res: Response, tokens: TokenPair) {
  const isProd = process.env.NODE_ENV === 'production';

  // Access token cookie (short-lived)
  res.cookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh token cookie (long-lived)
  res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearAuthCookies(res: Response) {
  res.cookie(ACCESS_TOKEN_COOKIE, '', { httpOnly: true, expires: new Date(0) });
  res.cookie(REFRESH_TOKEN_COOKIE, '', { httpOnly: true, expires: new Date(0) });
}


