import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import applicantsRoute from "./routes/applicants.route.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded files

// Routes
app.use("/api/applicants", applicantsRoute);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);