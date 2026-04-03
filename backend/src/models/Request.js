const pool = require('../config/database');

class Request {
  static async create(userId, method, url, headers, body, cookies) {
    const result = await pool.query(
      `INSERT INTO requests (user_id, method, url, headers, body, cookies)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, method, url, headers, body, cookies]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const { response_status, response_headers, response_body, response_time } = data;
    const result = await pool.query(
      `UPDATE requests SET response_status = $1, response_headers = $2, response_body = $3, response_time = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [response_status, response_headers, response_body, response_time, id]
    );
    return result.rows[0];
  }

  static async findByUserId(userId, limit = 100) {
    const result = await pool.query(
      'SELECT * FROM requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM requests WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM requests WHERE id = $1', [id]);
  }
}

module.exports = Request;
