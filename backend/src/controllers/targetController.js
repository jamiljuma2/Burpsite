const Crawler = require('../utils/crawler');
const pool = require('../config/database');

const targetController = {
  async crawlTarget(req, res) {
    try {
      const { baseUrl } = req.body;

      if (!baseUrl) {
        return res.status(400).json({ error: 'Base URL required' });
      }

      const targetId = `target-${Date.now()}`;

      // Insert target record
      const result = await pool.query(
        'INSERT INTO targets (user_id, base_url) VALUES ($1, $2) RETURNING *',
        [req.userId, baseUrl]
      );

      const target = result.rows[0];

      // Run crawler asynchronously
      setImmediate(async () => {
        try {
          const crawler = new Crawler(baseUrl, 3);
          await crawler.crawl();

          const endpoints = crawler.getEndpoints();
          const tree = crawler.buildTree();

          await pool.query(
            'UPDATE targets SET endpoints = $1, crawled_at = CURRENT_TIMESTAMP WHERE id = $2',
            [JSON.stringify({ endpoints, tree }), target.id]
          );
        } catch (error) {
          console.error('Crawl error:', error);
        }
      });

      res.status(201).json(target);
    } catch (error) {
      console.error('Crawl target error:', error);
      res.status(500).json({ error: 'Failed to crawl target' });
    }
  },

  async getTargets(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM targets WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
        [req.userId]
      );

      const targets = result.rows.map(target => ({
        ...target,
        endpoints: typeof target.endpoints === 'string' ? JSON.parse(target.endpoints) : target.endpoints,
      }));

      res.json(targets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch targets' });
    }
  },

  async getTarget(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM targets WHERE id = $1 AND user_id = $2',
        [req.params.id, req.userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Target not found' });
      }

      const target = result.rows[0];
      target.endpoints = typeof target.endpoints === 'string' ? JSON.parse(target.endpoints) : target.endpoints;

      res.json(target);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch target' });
    }
  },

  async deleteTarget(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM targets WHERE id = $1 AND user_id = $2',
        [req.params.id, req.userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Target not found' });
      }

      await pool.query('DELETE FROM targets WHERE id = $1', [req.params.id]);
      res.json({ message: 'Target deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete target' });
    }
  },
};

module.exports = targetController;
