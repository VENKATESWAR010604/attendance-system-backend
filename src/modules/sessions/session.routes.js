import express from "express";
import { createSession, getSessions, getSessionAttendance } from "./session.controller.js";

const router = express.Router();

router.post("/", createSession);
router.get("/", getSessions);
router.get("/:id/attendance", getSessionAttendance);

export default router;