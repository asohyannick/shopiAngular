import 'dotenv/config'
import mongoose from 'mongoose';
const dbURL: string = process.env.MONGODB_URL as string;
const databaseConfiguration = async () => {
    try {
        await mongoose.connect(dbURL);
        console.log("Connected to the database...");
        process.exit(0);
    } catch (err) {
        console.error("Failed to connect to the database", err);
        process.exit(1);
    }
};
export default databaseConfiguration;
