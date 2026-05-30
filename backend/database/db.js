import pkg from "pg";
const { Client } = pkg;

const database = new Client({
    user: "postgres",
    password: "12345",
    host: "localhost",
    database: "ecommerce",
    port: 5432,
});

export const connectDB = async () => {
    try {
        await database.connect();
        console.log("Connected to the database Successfully");
    } catch (error) {
        console.error(error);
    }
};

export default database;