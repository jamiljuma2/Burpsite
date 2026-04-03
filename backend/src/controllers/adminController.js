const pool = require('../config/database');

const adminController = {
  async getOverview(req, res) {
    try {
      const [usersCount, requestsCount, scansCount, targetsCount, vulnCount] = await Promise.all([
        pool.query('SELECT COUNT(*)::int AS total FROM users'),
        pool.query('SELECT COUNT(*)::int AS total FROM requests'),
        pool.query('SELECT COUNT(*)::int AS total FROM scans'),
        pool.query('SELECT COUNT(*)::int AS total FROM targets'),
        pool.query(
          `SELECT COALESCE(SUM(jsonb_array_length(vulnerabilities)), 0)::int AS total
           FROM scans`
        ),
      ]);

      return res.json({
        users: usersCount.rows[0].total,
        requests: requestsCount.rows[0].total,
        scans: scansCount.rows[0].total,
        targets: targetsCount.rows[0].total,
        vulnerabilities: vulnCount.rows[0].total,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to load admin overview' });
    }
  },

  async getUsers(req, res) {
    try {
      const result = await pool.query(
        `SELECT id, username, email, role, created_at, updated_at
         FROM users
         ORDER BY created_at DESC`
      );
      return res.json(result.rows);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to load users' });
    }
  },

  async getActivity(req, res) {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

      const scansQuery = pool.query(
        `SELECT
          s.id,
          s.user_id,
          u.username,
          s.target_url,
          s.status,
          s.progress,
          s.created_at,
          s.updated_at
         FROM scans s
         JOIN users u ON u.id = s.user_id
         ORDER BY s.created_at DESC
         LIMIT $1`,
        [limit]
      );

      const requestsQuery = pool.query(
        `SELECT
          r.id,
          r.user_id,
          u.username,
          r.method,
          r.url,
          r.response_status,
          r.created_at,
          r.updated_at
         FROM requests r
         JOIN users u ON u.id = r.user_id
         ORDER BY r.created_at DESC
         LIMIT $1`,
        [limit]
      );

      const [scansResult, requestsResult] = await Promise.all([scansQuery, requestsQuery]);

      const scanEvents = scansResult.rows.map((scan) => ({
        id: `scan-${scan.id}`,
        type: 'scan',
        entityId: scan.id,
        timestamp: scan.created_at,
        user: {
          id: scan.user_id,
          username: scan.username,
        },
        summary: `Scan ${scan.status} for ${scan.target_url}`,
        metadata: {
          targetUrl: scan.target_url,
          status: scan.status,
          progress: scan.progress,
          updatedAt: scan.updated_at,
        },
      }));

      const requestEvents = requestsResult.rows.map((request) => ({
        id: `request-${request.id}`,
        type: 'request',
        entityId: request.id,
        timestamp: request.created_at,
        user: {
          id: request.user_id,
          username: request.username,
        },
        summary: `${request.method} ${request.url}`,
        metadata: {
          method: request.method,
          url: request.url,
          responseStatus: request.response_status,
          updatedAt: request.updated_at,
        },
      }));

      const activity = [...scanEvents, ...requestEvents]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);

      return res.json({
        limit,
        total: activity.length,
        activity,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to load activity log' });
    }
  },

  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['admin', 'user'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Allowed roles: admin, user' });
      }

      const userResult = await pool.query('SELECT id, role FROM users WHERE id = $1', [id]);
      const targetUser = userResult.rows[0];

      if (!targetUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (targetUser.id === req.userId && role !== 'admin') {
        return res.status(400).json({ error: 'You cannot remove your own admin role' });
      }

      const updateResult = await pool.query(
        `UPDATE users
         SET role = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id, username, email, role, created_at, updated_at`,
        [role, id]
      );

      return res.json(updateResult.rows[0]);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update user role' });
    }
  },
};

module.exports = adminController;