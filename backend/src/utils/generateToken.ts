import jwt from 'jsonwebtoken';
import { Response } from 'express';

const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d', // Extended for development convenience
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || 'refreshsecret', {
    expiresIn: '7d',
  });

  // Set JWT as HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Set Refresh Token as HTTP-Only cookie (optional approach, or send in body)
  // For this implementation, let's send tokens in response body as well for flexibility if needed,
  // but cookies are safer. The prompt mentions return JWT.

  return { token, refreshToken };
};

export default generateToken;

