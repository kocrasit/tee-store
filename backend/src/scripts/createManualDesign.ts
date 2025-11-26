import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Design from '../models/Design';
import User from '../models/User';
import connectDB from '../config/db';

dotenv.config();

const createManualDesign = async () => {
    await connectDB();

    // Find the admin user to assign as uploader
    const adminUser = await User.findOne({ email: 'admin@teestore.com' });

    if (!adminUser) {
        console.log('Admin user not found! Please run createAdmin script first.');
        process.exit(1);
    }

    const design = new Design({
        title: 'Manual Test Design',
        description: 'This is a design added manually via script to verify the database.',
        price: 199.99,
        category: 'Şirket Tasarımları',
        tags: ['test', 'manual', 'admin'],
        images: {
            original: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3',
            thumbnail: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3',
            preview: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3'
        },
        uploadedBy: adminUser._id,
        userRole: 'designer', // Admin acts as a designer here
        status: 'published',
    });

    const createdDesign = await design.save();
    console.log('Design created successfully!');
    console.log('ID:', createdDesign._id);
    console.log('Title:', createdDesign.title);

    process.exit();
};

createManualDesign();
