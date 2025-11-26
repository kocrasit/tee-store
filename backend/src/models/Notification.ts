import mongoose, { Document, Schema } from 'mongoose';

export enum NotificationType {
    INFO = 'info',
    ORDER = 'order',
    COUPON = 'coupon',
}

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            default: NotificationType.INFO,
        },
        isRead: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
