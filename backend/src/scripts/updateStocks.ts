import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Design from '../models/Design';

dotenv.config();

const updateStocks = async () => {
    try {
        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce-platform');
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const count = await Design.countDocuments({});
        console.log(`Found ${count} designs in the database.`);

        if (count > 0) {
            const result = await Design.updateMany(
                {},
                { $set: { stock: 100 } }
            );
            console.log(`Updated ${result.modifiedCount} designs with default stock (100).`);
        } else {
            console.log('No designs found to update.');
        }

        process.exit();
    } catch (error) {
        console.error('Error updating stocks:', error);
        process.exit(1);
    }
};

updateStocks();
