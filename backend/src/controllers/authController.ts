import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import bcrypt from 'bcryptjs';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    role: role || 'customer', // Default to customer if not specified
  });

  if (user) {
    const tokens = generateToken(res, (user._id as unknown) as string);
    res.status(201).json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      role: user.role,
      token: tokens.token
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log('Login attempt:', email);

  const user = await User.findOne({ email });

  if (!user) {
    console.log('User not found:', email);
    res.status(401);
    throw new Error('Invalid email or password');
  }

  console.log('User found:', user.email);
  console.log('Stored hash:', user.password);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', isMatch);

  if (isMatch) {
    const tokens = generateToken(res, (user._id as unknown) as string);
    res.json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      role: user.role,
      token: tokens.token
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // Update Influencer Profile if exists or create
    if (user.role === 'influencer') {
      const currentProfile: any = user.influencerProfile || {};
      user.influencerProfile = {
        ...currentProfile,
        bio: req.body.bio || currentProfile.bio,
        socialLinks: {
          instagram: req.body.instagram || currentProfile.socialLinks?.instagram,
          twitter: req.body.twitter || currentProfile.socialLinks?.twitter,
          tiktok: req.body.tiktok || currentProfile.socialLinks?.tiktok,
        },
        commissionRate: currentProfile.commissionRate || 10,
        totalEarnings: currentProfile.totalEarnings || 0,
        monthlySales: currentProfile.monthlySales || 0,
        bankAccount: currentProfile.bankAccount
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      role: updatedUser.role,
      influencerProfile: updatedUser.influencerProfile,
      token: req.cookies.jwt
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { registerUser, loginUser, logoutUser, updateProfile };

