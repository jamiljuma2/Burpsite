const Scan = require('../models/Scan');
const { scanURL } = require('../utils/scanner');

const scanController = {
  async startScan(req, res) {
    try {
      const { targetUrl } = req.body;

      if (!targetUrl) {
        return res.status(400).json({ error: 'Target URL required' });
      }

      const scan = await Scan.create(req.userId, targetUrl);

      // Run scan asynchronously
      setImmediate(async () => {
        try {
          await Scan.update(scan.id, {
            status: 'running',
            progress: 0,
            vulnerabilities: JSON.stringify([]),
          });

          const vulnerabilities = await scanURL(targetUrl);

          await Scan.update(scan.id, {
            status: 'completed',
            progress: 100,
            vulnerabilities: JSON.stringify(vulnerabilities),
          });
        } catch (error) {
          console.error('Scan error:', error);
          await Scan.update(scan.id, {
            status: 'failed',
            vulnerabilities: JSON.stringify({ error: error.message }),
          });
        }
      });

      res.status(201).json(scan);
    } catch (error) {
      console.error('Start scan error:', error);
      res.status(500).json({ error: 'Failed to start scan' });
    }
  },

  async getScans(req, res) {
    try {
      const scans = await Scan.findByUserId(req.userId);
      const parsedScans = scans.map(scan => ({
        ...scan,
        vulnerabilities: typeof scan.vulnerabilities === 'string' ? JSON.parse(scan.vulnerabilities) : scan.vulnerabilities,
      }));

      res.json(parsedScans);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch scans' });
    }
  },

  async getScan(req, res) {
    try {
      const scan = await Scan.findById(req.params.id);
      if (!scan || scan.user_id !== req.userId) {
        return res.status(404).json({ error: 'Scan not found' });
      }

      scan.vulnerabilities = typeof scan.vulnerabilities === 'string' ? JSON.parse(scan.vulnerabilities) : scan.vulnerabilities;

      res.json(scan);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch scan' });
    }
  },

  async deleteScan(req, res) {
    try {
      const scan = await Scan.findById(req.params.id);
      if (!scan || scan.user_id !== req.userId) {
        return res.status(404).json({ error: 'Scan not found' });
      }

      await Scan.delete(req.params.id);
      res.json({ message: 'Scan deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete scan' });
    }
  },
};

module.exports = scanController;
