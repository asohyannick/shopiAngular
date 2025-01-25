import 'dotenv/config'
import mongoose from 'mongoose';
const dbURL: string = process.env.MONGODB_URL as string;
const connectToDatabase = async () => {
    try {
        await mongoose.connect(dbURL);
        console.log("Connected to the database...");
    } catch (err) {
        console.error("Failed to connect to the database", err);
    }
};
export default connectToDatabase;
