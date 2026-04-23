import { db } from "../../config/db.js";

// ✅ CREATE ONE OR MULTIPLE USERS
export async function createUser(req, res) {
  const users = Array.isArray(req.body) ? req.body : [req.body];

  try {
    const results = [];

    for (const user of users) {
      const { clerk_user_id, name, role, password } = user;

      const existing = await db.query(
        "SELECT * FROM users WHERE clerk_user_id=$1",
        [clerk_user_id]
      );

      if (existing.rows.length > 0) {
        results.push(existing.rows[0]);
        continue;
      }

      const result = await db.query(
        "INSERT INTO users (clerk_user_id, name, role, password) VALUES ($1,$2,$3,$4) RETURNING *",
        [clerk_user_id, name, role.toLowerCase().trim(), password]
      );

      results.push(result.rows[0]);
    }

    res.json(results);

  } catch (error) {
    console.error("USER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}

// ✅ GET ALL USERS
export async function getUsers(req, res) {
  try {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}

// ✅ GET CURRENT USER (FIXED — ADDED BACK)
export async function getMe(req, res) {
  try {
    const { clerk_user_id } = req.headers;

    const result = await db.query(
      "SELECT * FROM users WHERE clerk_user_id=$1",
      [clerk_user_id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error("GET ME ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}

// ✅ LOGIN USER (FINAL FIXED)
export async function loginUser(req, res) {
  try {
    let { clerk_user_id, password, role } = req.body;

    // ✅ CLEAN INPUT
    clerk_user_id = clerk_user_id.trim();
    password = password.trim();
    role = role.toLowerCase().trim();

    const result = await db.query(
      "SELECT * FROM users WHERE clerk_user_id=$1 AND LOWER(role)=LOWER($2)",
      [clerk_user_id, role]
    );

    const user = result.rows[0];

    console.log("LOGIN INPUT:", clerk_user_id, password, role);
    console.log("DB USER:", user);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({ error: "Password not set" });
    }

    if (String(user.password).trim() !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json(user);

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}