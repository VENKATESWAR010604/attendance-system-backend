import express from "express";
import { markAttendance, getAttendance, getAllAttendance } from "./attendance.controller.js";

const router = express.Router();

// ✅ Add attendance
router.post("/mark", markAttendance);

// ✅ NEW (for trainer list)
router.get("/", getAllAttendance);

// ✅ Student-specific
router.get("/:id", getAttendance);

export default router;