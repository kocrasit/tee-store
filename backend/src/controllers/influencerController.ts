import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { IUser } from '../models/User';
import { sendSuccess } from '../utils/apiResponse';
import { ApiError } from '../utils/ApiError';
import {
  getInfluencerDesigns as getInfluencerDesignsService,
  getInfluencerStats as getInfluencerStatsService,
} from '../services/influencerService';

interface AuthRequest extends Request {
  user?: IUser;
}

// @desc    Get Influencer Dashboard Stats
// @route   GET /api/influencer/dashboard
// @access  Private/Influencer
const getInfluencerStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  if (!userId) throw new ApiError(401, 'Not authorized', { code: 'NOT_AUTHORIZED' });

  const commissionRate = req.user?.influencerProfile?.commissionRate || 10;
  const stats = await getInfluencerStatsService({ userId, commissionRate });
  sendSuccess(res, { data: stats });
});

// @desc    Get Influencer Designs
// @route   GET /api/influencer/designs
// @access  Private/Influencer
const getInfluencerDesigns = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id?.toString();
  if (!userId) throw new ApiError(401, 'Not authorized', { code: 'NOT_AUTHORIZED' });

  const designs = await getInfluencerDesignsService(userId);
  sendSuccess(res, { data: designs });
});

export { getInfluencerStats, getInfluencerDesigns };

