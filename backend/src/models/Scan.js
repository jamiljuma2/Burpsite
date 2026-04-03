const pool = require('../config/database');

class Scan {
  static async create(userId, targetUrl) {
    const result = await pool.query(
      `INSERT INTO scans (user_id, target_url, status, vulnerabilities)
       VALUES ($1, $2, 'pending', '[]') RETURNING *`,
      [userId, targetUrl]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const { status, vulnerabilities, progress } = data;
    const result = await pool.query(
      `UPDATE scans SET status = $1, vulnerabilities = $2, progress = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 RETURNING *`,
      [status, vulnerabilities, progress, id]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM scans WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM scans WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM scans WHERE id = $1', [id]);
  }
}

module.exports = Scan;
