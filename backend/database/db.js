import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",          // 🔥 hardcoded
    host: "localhost",
    database: "ecommerce",
    password: "123456789",
    port: 5432,
});

export const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log("Database connected successfully");
        client.release();
    } catch (error) {
        console.error("Error connecting to database:", error.message);
        process.exit(1);
    }
};

export default pool;