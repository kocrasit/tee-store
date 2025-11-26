import mongoose, { Document, Schema } from 'mongoose';

export interface IDesign extends Document {
  title: string;
  description: string;
  images: {
    original: string;
    thumbnail: string;
    preview: string;
  };
  price: number;
  category: 'tshirt' | 'hoodie' | 'sweatshirt' | 'mug' | 'poster' | 'sticker';
  tags: string[];
  uploadedBy: mongoose.Types.ObjectId;
  userRole: 'influencer' | 'designer';
  status: 'draft' | 'published' | 'rejected' | 'archived';
  sales: number;
  revenue: number;
  stock: number;
  rating: number;
  reviewsCount?: number;
  reviews: {
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  commissionRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

const DesignSchema: Schema = new Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    images: {
      original: { type: String, required: true },
      thumbnail: { type: String, required: true },
      preview: { type: String, required: true },
    },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ['tshirt', 'hoodie', 'sweatshirt', 'mug', 'poster', 'sticker'],
      required: true,
    },
    tags: [{ type: String }],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userRole: { type: String, enum: ['influencer', 'designer'], required: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'rejected', 'archived'],
      default: 'published', // Auto-publish for now as per spec
    },
    sales: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    commissionRate: { type: Number }, // Specific override if needed
  },
  {
    timestamps: true,
  }
);

// Text index for search
DesignSchema.index({ title: 'text', tags: 'text', description: 'text' });
DesignSchema.index({ uploadedBy: 1 }); // Index for influencer dashboard queries

export default mongoose.model<IDesign>('Design', DesignSchema);

