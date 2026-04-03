const Intruder = require('../utils/intruder');
const pool = require('../config/database');

const intruderController = {
  async startAttack(req, res) {
    try {
      const { method, url, paramName, payloadType, position } = req.body;

      if (!method || !url || !paramName || !payloadType) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const payloads = Intruder.generatePayloads(payloadType);

      // Run attack asynchronously
      const attackId = `attack-${Date.now()}`;
      const results = [];

      setImmediate(async () => {
        try {
          const attackResults = await Intruder.runAttack(method, url, paramName, payloads, position);

          for (const result of attackResults) {
            await pool.query(
              `INSERT INTO attack_results (user_id, attack_id, target_url, payload, status_code, response_length, response_time)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [req.userId, attackId, url, result.payload, result.statusCode, result.responseLength, result.responseTime]
            );
          }
        } catch (error) {
          console.error('Attack error:', error);
        }
      });

      res.status(201).json({ attackId, message: 'Attack started' });
    } catch (error) {
      console.error('Start attack error:', error);
      res.status(500).json({ error: 'Failed to start attack' });
    }
  },

  async getAttackResults(req, res) {
    try {
      const { attackId } = req.params;
      const result = await pool.query(
        'SELECT * FROM attack_results WHERE user_id = $1 AND attack_id = $2 ORDER BY created_at ASC',
        [req.userId, attackId]
      );

      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch attack results' });
    }
  },

  async getPayloads(req, res) {
    try {
      const { type } = req.query;

      if (!type) {
        return res.status(400).json({ error: 'Payload type required' });
      }

      const payloads = Intruder.generatePayloads(type);
      res.json({ type, count: payloads.length, payloads });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch payloads' });
    }
  },
};

module.exports = intruderController;
