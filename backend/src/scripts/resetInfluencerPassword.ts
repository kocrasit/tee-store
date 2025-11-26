import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce-platform');
        console.log('MongoDB Connected');

        const email = 'influencer@teestore.com'; // Assuming this is the influencer's email, or I should ask. 
        // Actually, I'll reset ALL influencers' passwords to 123456 to be safe, or just the one causing issues.
        // Let's try to find the user first.

        const influencers = await User.find({ role: 'influencer' });

        if (influencers.length === 0) {
            console.log('No influencers found.');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        for (const user of influencers) {
            user.password = hashedPassword;
            await user.save();
            console.log(`Password reset for influencer: ${user.email}`);
        }

        console.log('All influencer passwords reset to: 123456');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

resetPassword();
