import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

// Create MySQL connection
export const db = mysql.createConnection({
  host: process.env.DB_HOST,      // e.g., "localhost"
  user: process.env.DB_USER,      // e.g., "root"
  password: process.env.DB_PASS,  // your MySQL password
  database: process.env.DB_NAME,  // e.g., "agency_db"
});

// Connect and check for errors
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err.message);
  } else {
    console.log("Connected to MySQL database:", process.env.DB_NAME);
  }
});
