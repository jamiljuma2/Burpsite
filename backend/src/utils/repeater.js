const axios = require('axios');

class Repeater {
  static async sendRequest(method, url, headers, body, cookies) {
    const startTime = Date.now();

    try {
      const config = {
        method,
        url,
        headers: {
          ...headers,
          Cookie: Object.entries(cookies || {})
            .map(([key, value]) => `${key}=${value}`)
            .join('; '),
        },
        timeout: 30000,
        validateStatus: () => true,
      };

      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.data = body;
      }

      const response = await axios(config);
      const responseTime = Date.now() - startTime;

      return {
        status: response.status,
        headers: response.headers,
        body: response.data,
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      return {
        status: 0,
        headers: {},
        body: error.message,
        responseTime,
        error: error.message,
      };
    }
  }

  static async compareRequests(request1Response, request2Response) {
    return {
      statusMatch: request1Response.status === request2Response.status,
      bodyMatch: request1Response.body === request2Response.body,
      headersMatch: JSON.stringify(request1Response.headers) === JSON.stringify(request2Response.headers),
      timeDiff: Math.abs(request1Response.responseTime - request2Response.responseTime),
      request1: request1Response,
      request2: request2Response,
    };
  }
}

module.exports = Repeater;
