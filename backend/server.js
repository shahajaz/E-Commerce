import dotenv from "dotenv";

// ✅ Load environment variables FIRST
dotenv.config(); 

import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import { createTables } from "./utils/createTables.js";
import { connectDB } from "./database/db.js";

// 🔍 Debug (remove after testing)
console.log("ENV CHECK:", {
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
});

// ✅ Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// ✅ Robust startup flow
const startServer = async () => {
    try {
        // 1. Connect Database
        await connectDB();
        console.log("Database connected successfully");

        // 2. Create Tables
        await createTables();
        console.log("Tables created (or already exist)");

        // 3. Start Server
        const PORT = process.env.PORT || 4000;

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();