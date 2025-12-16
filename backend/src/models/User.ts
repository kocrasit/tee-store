import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  CUSTOMER = 'customer',
  INFLUENCER = 'influencer',
  DESIGNER = 'designer',
  ADMIN = 'admin',
}

export interface IUser extends Document {
  _id: any;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phoneNumber?: string;
  verified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
  influencerProfile?: {
    bio?: string;
    socialLinks?: {
      twitter?: string;
      instagram?: string;
      tiktok?: string;
    };
    commissionRate: number;
    bankAccount?: string;
    totalEarnings: number;
    monthlySales: number;
  };
  designerProfile?: {
    companyName: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
  };
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    avatar: { type: String },
    phoneNumber: { type: String },
    verified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    refreshTokenHash: { type: String },
    influencerProfile: {
      bio: String,
      socialLinks: {
        twitter: String,
        instagram: String,
        tiktok: String,
      },
      commissionRate: { type: Number, default: 10 }, // Default 10%
      bankAccount: String,
      totalEarnings: { type: Number, default: 0 },
      monthlySales: { type: Number, default: 0 },
    },
    designerProfile: {
      companyName: String,
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);

