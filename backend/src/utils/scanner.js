const axios = require('axios');
const { JSDOM } = require('jsdom');

const vulnerabilityPatterns = {
  sqlInjection: [
    { pattern: /SQL syntax|mysql_fetch|mysqli_|ORA-\d+/, severity: 'high' },
    { pattern: /Database error|ODBC|SQL Server/, severity: 'high' },
  ],
  xss: [
    { pattern: /<script|onerror|onclick|onload|javascript:/i, severity: 'high' },
    { pattern: /alert\(|document\.location|img src/i, severity: 'medium' },
  ],
  csrf: [
    { pattern: /form.*method.*post/i, severity: 'medium' },
  ],
  openRedirect: [
    { pattern: /redirect|location|url/i, severity: 'medium' },
  ],
};

const testSQLInjection = async (url) => {
  const payloads = ["' OR '1'='1", "1' UNION SELECT NULL--", "' OR 1=1 --"];
  const vulnerabilities = [];

  for (const payload of payloads) {
    try {
      const testUrl = `${url}${url.includes('?') ? '&' : '?'}test=${encodeURIComponent(payload)}`;
      const response = await axios.get(testUrl, { timeout: 5000 });

      if (vulnerabilityPatterns.sqlInjection.some(p => p.pattern.test(response.data))) {
        vulnerabilities.push({
          type: 'SQL Injection',
          severity: 'high',
          payload: payload,
          description: 'Potential SQL injection vulnerability detected',
        });
        break;
      }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        const errorText = error.response?.data || '';
        if (vulnerabilityPatterns.sqlInjection.some(p => p.pattern.test(errorText))) {
          vulnerabilities.push({
            type: 'SQL Injection',
            severity: 'high',
            payload: payload,
            description: 'Error-based SQL injection detected',
          });
          break;
        }
      }
    }
  }

  return vulnerabilities;
};

const testXSS = async (url) => {
  const payload = '<img src=x onerror="alert(1)">';
  const vulnerabilities = [];

  try {
    const testUrl = `${url}${url.includes('?') ? '&' : '?'}search=${encodeURIComponent(payload)}`;
    const response = await axios.get(testUrl, { timeout: 5000 });

    if (response.data.includes(payload) || response.data.includes('onerror')) {
      vulnerabilities.push({
        type: 'Cross-Site Scripting (XSS)',
        severity: 'high',
        description: 'Potential XSS vulnerability detected - user input reflected in response',
      });
    }
  } catch (error) {
    // Continue testing
  }

  return vulnerabilities;
};

const testCSRF = async (url) => {
  const vulnerabilities = [];

  try {
    const response = await axios.get(url, { timeout: 5000 });
    const dom = new JSDOM(response.data);
    const forms = dom.window.document.querySelectorAll('form');

    forms.forEach(form => {
      const method = form.getAttribute('method')?.toUpperCase() || 'GET';
      const hasCSRFToken = form.querySelector('[name*="csrf"], [name*="token"], [name*="nonce"]');

      if ((method === 'POST' || method === 'PUT') && !hasCSRFToken) {
        vulnerabilities.push({
          type: 'Cross-Site Request Forgery (CSRF)',
          severity: 'medium',
          description: 'Form missing CSRF token protection',
        });
      }
    });
  } catch (error) {
    // Continue testing
  }

  return vulnerabilities;
};

const testOpenRedirect = async (url) => {
  const payloads = ['http://evil.com', 'https://attacker.com', '//evil.com'];
  const vulnerabilities = [];

  for (const payload of payloads) {
    try {
      const testUrl = `${url}${url.includes('?') ? '&' : '?'}redirect=${encodeURIComponent(payload)}`;
      const response = await axios.get(testUrl, { timeout: 5000, maxRedirects: 0, validateStatus: () => true });

      if (response.status >= 300 && response.status <= 308) {
        const location = response.headers.location;
        if (location && location.includes(payload)) {
          vulnerabilities.push({
            type: 'Open Redirect',
            severity: 'medium',
            payload: payload,
            description: 'Open redirect vulnerability detected',
          });
          break;
        }
      }
    } catch (error) {
      // Continue testing
    }
  }

  return vulnerabilities;
};

const scanURL = async (url) => {
  let allVulnerabilities = [];

  try {
    const sqlVulns = await testSQLInjection(url);
    allVulnerabilities.push(...sqlVulns);

    const xssVulns = await testXSS(url);
    allVulnerabilities.push(...xssVulns);

    const csrfVulns = await testCSRF(url);
    allVulnerabilities.push(...csrfVulns);

    const redirectVulns = await testOpenRedirect(url);
    allVulnerabilities.push(...redirectVulns);
  } catch (error) {
    console.error('Scan error:', error.message);
  }

  return allVulnerabilities;
};

module.exports = {
  scanURL,
  testSQLInjection,
  testXSS,
  testCSRF,
  testOpenRedirect,
};
