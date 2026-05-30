import database from "../database/db.js"; 

export async function createUserTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(100) NOT NULL CHECK (char_length(name) >= 5),
            email VARCHAR(100) UNIQUE NOT NULL,
            password TEXT NOT NULL CHECK (char_length(password) >= 8),
            role VARCHAR(10) NOT NULL CHECK (role IN ('User', 'Admin')),
            avatar JSONB DEFAULT NULL,
            reset_password_token TEXT DEFAULT NULL,
            reset_password_expires TIMESTAMP DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;

        await database.query(query);
        console.log("Users table created successfully");

    } catch (error) {
        console.error("Failed To Create Users Table.", error);
        process.exit(1);
    }
}