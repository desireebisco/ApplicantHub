import express from "express";
import multer from "multer";
import path from "path";
import { addApplicant, getApplicants, getApplicantById, updateApplicant, deleteApplicant } from "../controllers/applicants.controller.js";

const router = express.Router();

// Storage for multiple files
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// Define multiple file fields
const uploadFields = upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "scan_id", maxCount: 1 },
  { name: "passport", maxCount: 1 }
]);

// CRUD routes
router.post("/", uploadFields, addApplicant);
router.get("/", getApplicants);
router.get("/:id", getApplicantById);
router.put("/:id", uploadFields, updateApplicant);
router.delete("/:id", deleteApplicant);

export default router;
