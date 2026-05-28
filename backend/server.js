import dotenv from "dotenv";
dotenv.config({
    path: "./config/config.env",
});


import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import { createTables } from "./utils/createTables.js";
import { connectDB } from "./database/db.js";

// Debug
console.log("ENV CHECK:", {
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    STRIPE: process.env.STRIPE_SECRET_KEY,
});

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

const startServer = async () => {
    try {
        await connectDB();
        console.log("Database connected successfully");

        await createTables();
        console.log("Tables created");

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