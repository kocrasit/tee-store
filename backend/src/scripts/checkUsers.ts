import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import connectDB from '../config/db';

dotenv.config();

const checkUsers = async () => {
    await connectDB();

    const users = await User.find({}).select('firstName lastName email role');

    console.log(`Found ${users.length} users:`);
    users.forEach(u => {
        console.log(`- ${u.firstName} ${u.lastName} (${u.email}) - Role: ${u.role}`);
    });

    process.exit();
};

checkUsers();
