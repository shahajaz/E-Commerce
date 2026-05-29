import pkg from "pg";
const { Client } = pkg;

const database = new Client({
    user: process.env.DB_USER,
    // Convert the password explicitly to a String here 👇
    password: String(process.env.DB_PASSWORD), 
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
});

export const connectDB = async () => {
    try {
        await database.connect();
        console.log("Connected to the database Successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

export default database;