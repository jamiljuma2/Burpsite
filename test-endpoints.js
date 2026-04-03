const http = require('http');

const tests = [
  {
    name: 'Health Check',
    method: 'GET',
    path: '/health',
    data: null,
  },
  {
    name: 'Register New User',
    method: 'POST',
    path: '/api/auth/register',
    data: {
      username: 'prodtest',
      email: 'prodtest@burpsite.com',
      password: 'ProdTest123',
      confirmPassword: 'ProdTest123',
    },
  },
];

let completed = 0;
const results = [];

function runTest(test) {
  return new Promise((resolve) => {
    const data = test.data ? JSON.stringify(test.data) : null;
    const opts = {
      hostname: 'localhost',
      port: 5000,
      path: test.path,
      method: test.method,
      headers: test.data ? {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      } : {},
    };

    const req = http.request(opts, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          const success = res.statusCode >= 200 && res.statusCode < 300;
          results.push({
            test: test.name,
            status: success ? '✓ PASS' : '✗ FAIL',
            code: res.statusCode,
            message: success ? (response.message || response.status || 'Success') : (response.error || 'Unknown error'),
          });
        } catch (e) {
          results.push({
            test: test.name,
            status: '✗ ERROR',
            code: res.statusCode,
            message: 'Failed to parse response',
          });
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      results.push({
        test: test.name,
        status: '✗ ERROR',
        code: 0,
        message: e.message,
      });
      resolve();
    });

    if (data) req.write(data);
    req.end();
  });
}

async function runAllTests() {
  console.log('Running Production Readiness Tests...\n');
  
  for (const test of tests) {
    await runTest(test);
  }

  console.log('Test Results:');
  console.log('============================================');
  results.forEach((r) => {
    console.log(`${r.status} | ${r.test.padEnd(25)} | Code: ${r.code}`);
    console.log(`        Message: ${r.message}`);
  });
  console.log('============================================');
  
  const passed = results.filter(r => r.status.includes('PASS')).length;
  console.log(`\nSummary: ${passed}/${results.length} tests passed`);
  
  process.exit(passed === results.length ? 0 : 1);
}

runAllTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
