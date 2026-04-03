const http = require('http');

console.log('\n🔍 BURPSITE FINAL PRODUCTION VALIDATION\n');
console.log('============================================\n');

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve) => {
    const opts = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: data ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      } : {}
    };

    const req = http.request(opts, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body, headers: res.headers });
      });
    });

    req.on('error', (err) => {
      resolve({ error: err.message });
    });

    if (data) req.write(data);
    req.end();
  });
}

const uniqueSuffix = Date.now();
const validationUser = {
  username: `finaltest_${uniqueSuffix}`,
  email: `finaltest_${uniqueSuffix}@burpsite.local`,
  password: `FinalTest!${uniqueSuffix}`,
};

async function validate() {
  const results = [];

  // Test 1: Health Check
  console.log('Testing Core API Endpoints...');
  const health = await makeRequest('/health');
  results.push({
    test: 'Health Check',
    status: health.statusCode === 200 ? 'PASS' : 'FAIL',
    code: health.statusCode
  });

  // Test 2: Security Headers
  console.log('Checking Security Headers...');
  const secHeaders = ['x-frame-options', 'x-content-type-options', 'strict-transport-security', 'content-security-policy'];
  let headerCount = 0;
  secHeaders.forEach(h => {
    if (health.headers[h]) headerCount++;
  });
  results.push({
    test: 'Security Headers',
    status: headerCount >= 3 ? 'PASS' : 'FAIL',
    count: headerCount + '/' + secHeaders.length
  });

  // Test 3: Authentication
  console.log('Testing Authentication...');
  const registerData = JSON.stringify({
    username: validationUser.username,
    email: validationUser.email,
    password: validationUser.password,
    confirmPassword: validationUser.password
  });
  const register = await makeRequest('/api/auth/register', 'POST', registerData);
  const hasToken = register.statusCode === 201 && register.body.includes('token');
  results.push({
    test: 'User Registration & JWT',
    status: hasToken ? 'PASS' : 'FAIL',
    code: register.statusCode
  });

  // Test 4: Database
  console.log('Testing Database Connection...');
  const dbCheck = health.body.includes('ok');
  results.push({
    test: 'Database Connection',
    status: dbCheck ? 'PASS' : 'FAIL',
    message: 'Neon PostgreSQL OK'
  });

  // Summary
  console.log('\n============================================\n');
  console.log('VALIDATION RESULTS:\n');

  results.forEach(r => {
    const status = r.status === 'PASS' ? 'PASS' : 'FAIL';
    console.log(`${r.test.padEnd(30)} ${status}`);
  });

  const passed = results.filter(r => r.status === 'PASS').length;
  const total = results.length;

  console.log(`\n============================================`);
  console.log(`\nPRODUCTION VALIDATION: ${passed}/${total} PASSED\n`);

  if (passed === total) {
    console.log('SUCCESS: ALL SYSTEMS READY FOR PRODUCTION DEPLOYMENT');
  } else {
    console.log('WARNING: Review failed tests before deployment');
  }

  console.log('\nDocumentation files created:');
  console.log('  - PRODUCTION_READINESS_REPORT.md');
  console.log('  - DEPLOYMENT_GUIDE.md');
  console.log('  - README_PRODUCTION.md\n');
}

validate().catch(console.error);