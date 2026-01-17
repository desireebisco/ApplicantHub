import express from "express";
import cors from "cors";
import applicantRoutes from "./routes/applicants.route.js";

const app = express();

// Enable CORS
app.use(cors({
  origin: "http://localhost:5173", // <-- your React frontend URL
  methods: ["GET","POST","PUT","DELETE"]
}));

app.use(express.json());
app.use("/api/applicants", applicantRoutes);

app.listen(5050, () => {
  console.log("Server running on port 5050");
});