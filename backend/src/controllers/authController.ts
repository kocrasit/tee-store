import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { sendSuccess } from '../utils/apiResponse';
import { clearAuthCookies, setAuthCookies } from '../utils/tokens';
import {
  loginUser as loginUserService,
  logoutByRefreshToken,
  refreshAuth,
  registerUser as registerUserService,
} from '../services/authService';
import { updateAuthProfile } from '../services/userService';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await registerUserService(req.body);
  setAuthCookies(res, tokens);
  sendSuccess(res, {
    statusCode: 201,
    data: {
      ...user,
      token: tokens.accessToken, // backward compatibility
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
  });
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await loginUserService(req.body);
  setAuthCookies(res, tokens);
  sendSuccess(res, {
    data: {
      ...user,
      token: tokens.accessToken, // backward compatibility
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
  });
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  await logoutByRefreshToken(req.cookies?.refreshToken);
  clearAuthCookies(res);
  sendSuccess(res, { message: 'Logged out successfully' });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshTokenFromCookie = req.cookies?.refreshToken;
  const refreshTokenFromBody = req.body?.refreshToken;
  const { user, tokens } = await refreshAuth(refreshTokenFromBody || refreshTokenFromCookie);
  setAuthCookies(res, tokens);
  sendSuccess(res, {
    data: {
      ...user,
      token: tokens.accessToken,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req: any, res: Response) => {
  const updatedUser = await updateAuthProfile(req.user._id.toString(), req.body);
  sendSuccess(res, { data: updatedUser });
});

export { registerUser, loginUser, logoutUser, updateProfile, refreshToken };

