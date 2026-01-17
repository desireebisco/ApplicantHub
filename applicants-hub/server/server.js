import express from "express";
import cors from "cors";
import applicantRoutes from "./routes/applicants.route.js";
import authRoutes from "./routes/auth.route.js";

const app = express();

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173", // React frontend URL
  methods: ["GET","POST","PUT","DELETE"]
}));

app.use(express.json());

// Existing applicant routes
app.use("/api/applicants", applicantRoutes);

// New authentication routes
app.use("/api/auth", authRoutes);

app.listen(5050, () => {
  console.log("Server running on port 5050");
});
