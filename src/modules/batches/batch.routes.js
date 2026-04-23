import express from "express";
import { createBatch, getBatches, joinBatch } from "./batch.controller.js";

const router = express.Router();

// ✅ create batch
router.post("/", createBatch);

// ✅ get all batches
router.get("/", getBatches);

// ✅ join batch (student joins)
router.post("/:id/join", joinBatch);

export default router;