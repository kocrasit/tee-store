import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
    title: string;
    description?: string;
    image: string;
    link?: string;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const BannerSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    link: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IBanner>('Banner', BannerSchema);
