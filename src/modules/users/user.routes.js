import express from "express";
import { createUser, getUsers, getMe ,loginUser } from "./user.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/me", getMe);

// ✅ NEW LOGIN ROUTE
router.post("/login", loginUser)

export default router;