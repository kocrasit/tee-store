import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Design from '../models/Design';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

// @desc    Get Influencer Dashboard Stats
// @route   GET /api/influencer/dashboard
// @access  Private/Influencer
const getInfluencerStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.time('getInfluencerStats');
  console.log('getInfluencerStats called for user:', req.user?._id);
  const userId = req.user?._id;

  // Aggregate stats from Designs
  console.time('aggregation');
  const stats = await Design.aggregate([
    { $match: { uploadedBy: userId } },
    {
      $group: {
        _id: null,
        totalDesigns: { $sum: 1 },
        totalSales: { $sum: '$sales' },
        totalRevenue: { $sum: '$revenue' },
        activeDesigns: {
          $sum: {
            $cond: [{ $eq: ['$status', 'published'] }, 1, 0]
          }
        }
      }
    }
  ]);
  console.timeEnd('aggregation');

  const result = stats[0] || {
    totalDesigns: 0,
    totalSales: 0,
    totalRevenue: 0,
    activeDesigns: 0
  };

  // Calculate earnings based on commission rate (default 10%)
  const commissionRate = req.user?.influencerProfile?.commissionRate || 10;
  const totalEarnings = (result.totalRevenue * commissionRate) / 100;

  res.json({
    totalEarnings,
    activeDesigns: result.activeDesigns,
    totalDesigns: result.totalDesigns,
    totalSales: result.totalSales,
    monthlySales: result.totalSales // For now, just showing total as monthly or we can implement date filtering later
  });
  console.timeEnd('getInfluencerStats');
});

// @desc    Get Influencer Designs
// @route   GET /api/influencer/designs
// @access  Private/Influencer
const getInfluencerDesigns = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.time('getInfluencerDesigns');
  console.log('getInfluencerDesigns called for user:', req.user?._id);
  const designs = await Design.find({ uploadedBy: req.user?._id }).sort({ createdAt: -1 });
  res.json(designs);
  console.timeEnd('getInfluencerDesigns');
});

export { getInfluencerStats, getInfluencerDesigns };

