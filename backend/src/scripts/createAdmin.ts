import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { UserRole } from '../models/User';
import connectDB from '../config/db';
import bcrypt from 'bcryptjs';

dotenv.config();

const createAdmin = async () => {
    await connectDB();

    const email = 'admin@teestore.com';
    const password = 'password123';

    const userExists = await User.findOne({ email });

    if (userExists) {
        console.log('Admin user already exists');
        process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email,
        password: hashedPassword,
        role: UserRole.ADMIN,
        verified: true,
    });

    if (user) {
        console.log('Admin user created successfully');
        console.log('Email: admin@teestore.com');
        console.log('Password: password123');
    } else {
        console.log('Invalid user data');
    }

    process.exit();
};

createAdmin();
