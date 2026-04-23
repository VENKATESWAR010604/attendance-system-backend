import { db } from "../../config/db.js";

// ✅ CREATE SESSION (REAL DATA)
export const createSession = async (req, res) => {
  const { batch_id, trainer_id, title, date, start_time, end_time } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO sessions 
      (batch_id, trainer_id, title, date, start_time, end_time)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [batch_id, trainer_id, title, date, start_time, end_time]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("SESSION ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET SESSIONS
export const getSessions = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM sessions");
    res.json(result.rows);
  } catch (error) {
    console.error("GET SESSIONS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET SESSION ATTENDANCE (ADDED)
export const getSessionAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT 
        a.student_id,
        u.name,
        a.status
       FROM attendance a
       JOIN users u ON u.id = a.student_id
       WHERE a.session_id = $1`,
      [id]
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("SESSION ATTENDANCE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};