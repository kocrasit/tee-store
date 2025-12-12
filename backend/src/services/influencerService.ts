import Design from '../models/Design';

export async function getInfluencerStats(input: { userId: string; commissionRate: number }) {
  const stats = await Design.aggregate([
    { $match: { uploadedBy: input.userId as any } },
    {
      $group: {
        _id: null,
        totalDesigns: { $sum: 1 },
        totalSales: { $sum: '$sales' },
        totalRevenue: { $sum: '$revenue' },
        activeDesigns: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
      },
    },
  ]);

  const result = stats[0] || { totalDesigns: 0, totalSales: 0, totalRevenue: 0, activeDesigns: 0 };
  const totalEarnings = (result.totalRevenue * input.commissionRate) / 100;

  return {
    totalEarnings,
    activeDesigns: result.activeDesigns,
    totalDesigns: result.totalDesigns,
    totalSales: result.totalSales,
    monthlySales: result.totalSales,
  };
}

export async function getInfluencerDesigns(userId: string) {
  return await Design.find({ uploadedBy: userId }).sort({ createdAt: -1 });
}


