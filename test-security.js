const http = require('http');

const opts = { hostname: 'localhost', port: 5000, path: '/health', method: 'GET' };
const req = http.request(opts, (res) => {
  console.log('✓ Backend is running and responding');
  console.log('\nSecurity Headers Check:');
  const securityHeaders = ['x-frame-options', 'x-content-type-options', 'strict-transport-security', 'content-security-policy'];
  securityHeaders.forEach(h => {
    const value = res.headers[h];
    if (value) {
      console.log(`  ✓ ${h}: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
    } else {
      console.log(`  ✗ ${h}: NOT SET`);
    }
  });
  process.exit(0);
});

req.on('error', (e) => {
  console.error('✗ Backend error:', e.message);
  process.exit(1);
});

req.end();
