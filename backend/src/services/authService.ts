import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { sha256 } from '../utils/hash';
import { issueTokenPair, TokenPair } from '../utils/tokens';

export type AuthUserResponse = {
  _id: IUser['_id'];
  email: string;
  firstName: string;
  lastName?: string;
  role: string;
  influencerProfile?: any;
};

function toAuthUserResponse(user: IUser): AuthUserResponse {
  return {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    influencerProfile: user.influencerProfile,
  };
}

export async function registerUser(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}): Promise<{ user: AuthUserResponse; tokens: TokenPair }> {
  const email = input.email.toLowerCase();
  const userExists = await User.findOne({ email });
  if (userExists) throw new ApiError(400, 'User already exists', { code: 'USER_EXISTS' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(input.password, salt);

  const role = (input.role as UserRole) || UserRole.CUSTOMER;

  const user = await User.create({
    email,
    password: hashedPassword,
    firstName: input.firstName,
    lastName: input.lastName,
    role,
  });

  const tokens = issueTokenPair((user._id as unknown) as string);
  user.refreshTokenHash = sha256(tokens.refreshToken);
  await user.save();

  return { user: toAuthUserResponse(user), tokens };
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ user: AuthUserResponse; tokens: TokenPair }> {
  const email = input.email.toLowerCase();
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid email or password', { code: 'INVALID_CREDENTIALS' });

  const isMatch = await bcrypt.compare(input.password, user.password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password', { code: 'INVALID_CREDENTIALS' });

  const tokens = issueTokenPair((user._id as unknown) as string);
  user.refreshTokenHash = sha256(tokens.refreshToken);
  await user.save();

  return { user: toAuthUserResponse(user), tokens };
}

export async function refreshAuth(refreshToken: string): Promise<{ user: AuthUserResponse; tokens: TokenPair }> {
  if (!refreshToken) throw new ApiError(401, 'Missing refresh token', { code: 'NO_REFRESH_TOKEN' });

  let decoded: any;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshsecret');
  } catch {
    throw new ApiError(401, 'Invalid refresh token', { code: 'INVALID_REFRESH_TOKEN' });
  }

  const user = await User.findById(decoded.userId);
  if (!user) throw new ApiError(401, 'User not found', { code: 'USER_NOT_FOUND' });

  const expected = user.refreshTokenHash;
  if (!expected || expected !== sha256(refreshToken)) {
    throw new ApiError(401, 'Refresh token revoked', { code: 'REFRESH_REVOKED' });
  }

  // Rotation
  const tokens = issueTokenPair((user._id as unknown) as string);
  user.refreshTokenHash = sha256(tokens.refreshToken);
  await user.save();

  return { user: toAuthUserResponse(user), tokens };
}

export async function logoutByRefreshToken(refreshToken?: string) {
  if (!refreshToken) return;
  try {
    const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshsecret');
    await User.findByIdAndUpdate(decoded.userId, { $unset: { refreshTokenHash: 1 } });
  } catch {
    // ignore
  }
}


