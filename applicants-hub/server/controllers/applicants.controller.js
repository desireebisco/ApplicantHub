import { db } from "../db.js";

// Create applicant
export const addApplicant = (req, res) => {
  const { name, email, phone, position } = req.body;
  const resume = req.files?.resume ? req.files.resume[0].filename : null;
  const scan_id = req.files?.scan_id ? req.files.scan_id[0].filename : null;
  const passport = req.files?.passport ? req.files.passport[0].filename : null;

  const sql = "INSERT INTO applicants (name, email, phone, position, resume, scan_id, passport) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, email, phone, position, resume, scan_id, passport], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, name, email, phone, position, resume, scan_id, passport });
  });
};

// Get all applicants
export const getApplicants = (_, res) => {
  db.query("SELECT * FROM applicants", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

// Get single applicant
export const getApplicantById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM applicants WHERE id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (!rows.length) return res.status(404).json({ message: "Applicant not found" });
    res.json(rows[0]);
  });
};

// Update applicant
export const updateApplicant = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, position } = req.body;
  const resume = req.files?.resume ? req.files.resume[0].filename : null;
  const scan_id = req.files?.scan_id ? req.files.scan_id[0].filename : null;
  const passport = req.files?.passport ? req.files.passport[0].filename : null;

  const sql = `UPDATE applicants SET 
    name=?, email=?, phone=?, position=?,
    resume=COALESCE(?, resume),
    scan_id=COALESCE(?, scan_id),
    passport=COALESCE(?, passport)
    WHERE id=?`;

  db.query(sql, [name, email, phone, position, resume, scan_id, passport, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Applicant updated successfully" });
  });
};

// Delete applicant
export const deleteApplicant = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM applicants WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Applicant deleted successfully" });
  });
};
