import express from "express";
import cors from "cors";

import userRoutes from "./modules/users/user.routes.js";
import batchRoutes from "./modules/batches/batch.routes.js";
import sessionRoutes from "./modules/sessions/session.routes.js";
import attendanceRoutes from "./modules/attendance/attendance.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/batches", batchRoutes);
app.use("/sessions", sessionRoutes);
app.use("/attendance", attendanceRoutes);

export default app;