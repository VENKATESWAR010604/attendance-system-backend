import { db } from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // 👉 get user id from header
    const clerkId = req.headers["user-id"];

    if (!clerkId) {
      return res.status(401).json({ error: "No user-id header" });
    }

    // 👉 fetch user from DB
    const result = await db.query(
      "SELECT * FROM users WHERE clerk_user_id = $1",
      [clerkId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = result.rows[0];

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};