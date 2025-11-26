import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import connectDB from '../config/db';
import bcrypt from 'bcryptjs';

dotenv.config();

const checkUser = async () => {
    await connectDB();

    const email = 'admin@teestore.com';
    const password = '123456';

    console.log(`Checking user: ${email}`);

    const user = await User.findOne({ email });

    if (!user) {
        console.log('User NOT found in database!');
    } else {
        console.log('User found:', user.email);
        console.log('Role:', user.role);
        console.log('Stored Hash:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password '${password}' match result:`, isMatch);

        if (!isMatch) {
            console.log('Password does NOT match. Updating password...');
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            console.log('Password updated to:', password);

            // Verify again
            const isMatchNew = await bcrypt.compare(password, user.password);
            console.log('New password match result:', isMatchNew);
        }
    }

    process.exit();
};

checkUser();
