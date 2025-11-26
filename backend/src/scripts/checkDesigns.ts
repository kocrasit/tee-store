import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Design from '../models/Design';
import connectDB from '../config/db';

dotenv.config();

const checkDesigns = async () => {
    await connectDB();

    const designs = await Design.find({}).sort({ createdAt: -1 }).limit(5);

    console.log(`Found ${designs.length} designs.`);
    designs.forEach(d => {
        console.log(`- ${d.title} (${d.category}) - Status: ${d.status}`);
    });

    process.exit();
};

checkDesigns();
