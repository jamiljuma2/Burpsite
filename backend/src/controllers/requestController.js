const Request = require('../models/Request');
const Repeater = require('../utils/repeater');

const requestController = {
  async getRequests(req, res) {
    try {
      const requests = await Request.findByUserId(req.userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch requests' });
    }
  },

  async getRequest(req, res) {
    try {
      const request = await Request.findById(req.params.id);
      if (!request || request.user_id !== req.userId) {
        return res.status(404).json({ error: 'Request not found' });
      }

      res.json(request);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch request' });
    }
  },

  async createRequest(req, res) {
    try {
      const { method, url, headers, body, cookies } = req.body;

      if (!method || !url) {
        return res.status(400).json({ error: 'Method and URL required' });
      }

      const newRequest = await Request.create(
        req.userId,
        method,
        url,
        JSON.stringify(headers || {}),
        body,
        JSON.stringify(cookies || {})
      );

      res.status(201).json(newRequest);
    } catch (error) {
      console.error('Create request error:', error);
      res.status(500).json({ error: 'Failed to create request' });
    }
  },

  async repeatRequest(req, res) {
    try {
      const { id } = req.params;
      const request = await Request.findById(id);

      if (!request || request.user_id !== req.userId) {
        return res.status(404).json({ error: 'Request not found' });
      }

      const headers = typeof request.headers === 'string' ? JSON.parse(request.headers) : request.headers;
      const cookies = typeof request.cookies === 'string' ? JSON.parse(request.cookies) : request.cookies;

      const response = await Repeater.sendRequest(
        request.method,
        request.url,
        headers,
        request.body,
        cookies
      );

      // Update request with response
      await Request.update(id, {
        response_status: response.status,
        response_headers: JSON.stringify(response.headers),
        response_body: response.body,
        response_time: response.responseTime,
      });

      res.json(response);
    } catch (error) {
      console.error('Repeat request error:', error);
      res.status(500).json({ error: 'Failed to repeat request' });
    }
  },

  async deleteRequest(req, res) {
    try {
      const request = await Request.findById(req.params.id);
      if (!request || request.user_id !== req.userId) {
        return res.status(404).json({ error: 'Request not found' });
      }

      await Request.delete(req.params.id);
      res.json({ message: 'Request deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete request' });
    }
  },
};

module.exports = requestController;
