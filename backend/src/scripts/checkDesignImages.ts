import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Design from '../models/Design';

dotenv.config();

const checkImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce-platform');
        console.log('MongoDB Connected');

        const designs = await Design.find({});

        console.log(`Found ${designs.length} designs.`);

        designs.forEach(d => {
            console.log(`Design: ${d.title}`);
            console.log(`  ID: ${d._id}`);
            console.log(`  Image Original: ${d.images.original}`);
            console.log(`  Image Thumbnail: ${d.images.thumbnail}`);
            console.log('---');
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkImages();
