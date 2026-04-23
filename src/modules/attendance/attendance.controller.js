import { db } from "../../config/db.js";

// ✅ MARK ATTENDANCE
export const markAttendance = async (req, res) => {
  const { session_id, student_id, status } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO attendance (session_id, student_id, status)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [session_id, student_id, status]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("ATTENDANCE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET ONLY LOGGED-IN STUDENT ATTENDANCE (for Student Dashboard)
export const getAttendance = async (req, res) => {
  const studentId = req.params.id;

  try {
    const result = await db.query(
      "SELECT status FROM attendance WHERE student_id = $1",
      [studentId]
    );

    const records = result.rows;

    const totalDays = records.length;

    const present = records.filter(
      r => r.status === "present"
    ).length;

    const absent = records.filter(
      r => r.status === "absent"
    ).length;

    const history = records.map(
      r => r.status === "present"
    );

    res.json({
      totalDays,
      present,
      absent,
      history
    });

  } catch (error) {
    console.error("GET ATTENDANCE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ NEW: GET ALL ATTENDANCE (for Trainer Dashboard)
export const getAllAttendance = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT student_id, status FROM attendance"
    );

    res.json(result.rows);

  } catch (error) {
    console.error("GET ALL ATTENDANCE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};