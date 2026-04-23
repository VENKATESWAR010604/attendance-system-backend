
import "dotenv/config";
import express from "express";
import cors from "cors";

import userRoutes from "./modules/users/user.routes.js";
import batchRoutes from "./modules/batches/batch.routes.js";
import sessionRoutes from "./modules/sessions/session.routes.js";
import attendanceRoutes from "./modules/attendance/attendance.routes.js";

const app = express();
app.use(express.json());
app.use(cors()); // ✅ THIS FIXES YOUR ISSUE

// ROUTES
app.use("/users", userRoutes);
app.use("/batches", batchRoutes);
app.use("/sessions", sessionRoutes);
app.use("/attendance", attendanceRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});