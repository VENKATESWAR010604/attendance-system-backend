import { db } from "../../config/db.js";

// ✅ CREATE BATCH (WITH TRAINER LINK)
export async function createBatch(req, res) {
  const { name, institution_id, trainer_id } = req.body;

  try {
    await db.query("BEGIN");

    // ✅ insert batch
    const result = await db.query(
      "INSERT INTO batches (name, institution_id) VALUES ($1,$2) RETURNING *",
      [name, institution_id]
    );

    const batch = result.rows[0];

    // ✅ link trainer to batch
    if (trainer_id) {
      await db.query(
        "INSERT INTO batch_trainers (batch_id, trainer_id) VALUES ($1,$2)",
        [batch.id, trainer_id]
      );
    }

    await db.query("COMMIT");

    res.status(201).json({
      success: true,
      data: batch
    });

  } catch (error) {
    await db.query("ROLLBACK");

    console.error("BATCH ERROR:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// ✅ GET ALL BATCHES
export async function getBatches(req, res) {
  try {
    const result = await db.query(`
      SELECT 
        b.*,
        bt.trainer_id
      FROM batches b
      LEFT JOIN batch_trainers bt
      ON b.id = bt.batch_id
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("GET BATCH ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// ✅ JOIN BATCH (STUDENT)
export async function joinBatch(req, res) {
  const { id } = req.params; // batch_id
  const { student_id } = req.body;

  try {
    await db.query(
      "INSERT INTO batch_students (batch_id, student_id) VALUES ($1,$2)",
      [id, student_id]
    );

    res.json({
      success: true,
      message: "Student joined batch"
    });

  } catch (error) {
    console.error("JOIN BATCH ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// ✅ OPTIONAL: GET STUDENTS IN A BATCH
export async function getBatchStudents(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query(`
      SELECT u.id, u.name, u.clerk_user_id
      FROM batch_students bs
      JOIN users u ON bs.student_id = u.id
      WHERE bs.batch_id = $1
    `, [id]);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("GET BATCH STUDENTS ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}