# Testing Guide for Burpsite

This document provides sample test cases and scenarios for testing all features of Burpsite.

## Prerequisites for Testing

1. **Burpsite is running** (Backend on :5000, Frontend on :3000)
2. **Neon PostgreSQL is configured** with DATABASE_URL in .env
3. **Test account created** via registration
4. **(Optional) Vulnerable test site** - Use OWASP WebGoat, DVWA, or bWAPP

## Test Account

Create your own test account during each test run.

Recommended format:
- **Email**: yourname+timestamp@example.com
- **Password**: Use a unique strong password

## 🧪 Test Cases

### 1. Authentication Tests

#### Test 1.1: User Registration
```
Steps:
1. Navigate to http://localhost:3000
2. Click "Register here"
3. Enter:
  - Username: your unique username
  - Email: your unique email
  - Password: your strong password
  - Confirm Password: same password
4. Click "Register"

Expected: User logged in, redirected to dashboard
```

#### Test 1.2: User Login
```
Steps:
1. Click "Logout" if logged in
2. Enter the email used during registration
3. Enter the password used during registration
4. Click "Login"

Expected: User logged in, dashboard displayed
```

#### Test 1.3: Invalid Credentials
```
Steps:
1. On login page, enter wrong password
2. Click "Login"

Expected: Error message "Invalid credentials" displayed
```

### 2. Proxy Interceptor Tests

#### Test 2.1: View Captured Requests
```
Steps:
1. Navigate to Proxy tab
2. Make a GET request to http://example.com (or any site)
3. Observe request appears in left panel

Expected: Request listed with method, URL, status
```

#### Test 2.2: View Request Details
```
Steps:
1. In Proxy, click on a request
2. View Headers tab
3. View Body tab
4. View Response tab

Expected: All request/response details displayed correctly
```

#### Test 2.3: Delete Request
```
Steps:
1. In Proxy, right-click a request
2. Click delete button (trash icon)

Expected: Request removed from list
```

### 3. Request Repeater Tests

#### Test 3.1: Create GET Request
```
Steps:
1. Navigate to Repeater tab
2. Click "New" tab
3. Ensure Method is "GET"
4. Enter URL: https://httpbin.org/get
5. Click "Create & Send"

Expected: Request sent, response displayed
```

#### Test 3.2: Create POST Request
```
Steps:
1. Navigate to Repeater tab
2. Click "New" tab
3. Change Method to "POST"
4. Enter URL: https://httpbin.org/post
5. Enter Headers: {"Content-Type": "application/json"}
6. Enter Body: {"test": "data"}
7. Click "Create & Send"

Expected: POST request sent with body, response shows echoed data
```

#### Test 3.3: Repeat Existing Request
```
Steps:
1. In Repeater, click "List" tab
2. Select a saved request
3. Click "Send" button next to it

Expected: Request repeated, new response received
```

#### Test 3.4: Request with Headers
```
Steps:
1. Create new request
2. Add headers: {"Authorization": "Bearer token123"}
3. Send request

Expected: Request sent with custom headers
```

### 4. Scanner Module Tests

#### Test 4.1: Scan Vulnerable URL
```
Steps:
1. Navigate to Scanner tab
2. Enter URL: http://localhost:3000 (or vulnerable test site)
3. Click "Start Scan"
4. Wait for completion

Expected: Scan completes, shows discovered vulnerabilities
```

#### Test 4.2: View Vulnerability Details
```
Steps:
1. In Scanner, select completed scan
2. View vulnerability list
3. Click on vulnerability

Expected: Shows type, severity, description, and payload used
```

#### Test 4.3: Delete Scan
```
Steps:
1. In Scanner, click trash icon on a scan
2. Confirm deletion

Expected: Scan removed from list
```

#### Test 4.4: Severity Levels
```
Steps:
1. Perform scan on vulnerable site
2. Observe vulnerabilities with different severities

Expected: High severity shown in red, Medium in yellow, Low in blue
```

### 5. Intruder Tests

#### Test 5.1: SQL Injection Attack
```
Steps:
1. Navigate to Intruder tab
2. Configure:
   - Target URL: http://example.com/search
   - Parameter Name: q
   - Payload Type: SQL Injection
   - Position: Query Parameter
3. Click "Start Attack"

Expected: Sees formatted results table with payloads and responses
```

#### Test 5.2: XSS Fuzzing
```
Steps:
1. In Intruder, configure:
   - Target URL: http://example.com/comment
   - Parameter Name: text
   - Payload Type: XSS Payloads
   - Position: Query Parameter
2. Click "Start Attack"

Expected: Results show XSS payloads tested with responses
```

#### Test 5.3: Brute Force
```
Steps:
1. In Intruder, configure:
   - Target URL: http://example.com/login
   - Parameter Name: password
   - Payload Type: Brute Force
   - Position: Body
2. Click "Start Attack"

Expected: Common passwords tested, high-volume results shown
```

#### Test 5.4: Results Analysis
```
Steps:
1. After attack completes
2. Look at Status Code column
3. Note Response Length patterns
4. Check Response Time column

Expected: Can identify unusual responses (different status, length, or timing)
```

### 6. Target Mapping Tests

#### Test 6.1: Crawl Website
```
Steps:
1. Navigate to Target Map tab
2. Enter base URL: https://example.com
3. Click "Start Crawl"
4. Wait for completion

Expected: Endpoints discovered and listed
```

#### Test 6.2: View Endpoints
```
Steps:
1. In Target Map, select crawled target
2. Right panel shows all discovered endpoints

Expected: List of discovered URLs/endpoints
```

#### Test 6.3: Delete Target
```
Steps:
1. Click trash icon on target
2. Confirm deletion

Expected: Target removed from list
```

#### Test 6.4: Scope Limiting
```
Steps:
1. Crawl a website
2. Note that crawling stops at domain boundary

Expected: Only endpoints from target domain are discovered
```

### 7. Dashboard Tests

#### Test 7.1: Statistics Display
```
Steps:
1. Perform various operations (scans, requests, etc.)
2. Go to Dashboard
3. Check statistics cards

Expected: Numbers match actual counts
```

#### Test 7.2: Quick Links
```
Steps:
1. On Dashboard, click each "Quick Start" card
2. Verify navigation

Expected: Each link navigates to correct module
```

#### Test 7.3: Disclaimer Display
```
Steps:
1. View any module with disclaimer visible

Expected: Disclaimer shows legal requirements
```

## 📊 Automated Test Cases with cURL

### Test Case 1: Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }'
```

### Test Case 2: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Test Case 3: Create Request

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "method": "GET",
    "url": "https://httpbin.org/get",
    "headers": {},
    "body": "",
    "cookies": {}
  }'
```

### Test Case 4: Start Scan

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/scans/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "targetUrl": "http://example.com"
  }'
```

### Test Case 5: Start Intruder Attack

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/intruder/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "method": "GET",
    "url": "http://example.com/search",
    "paramName": "q",
    "payloadType": "sql",
    "position": "query"
  }'
```

## 🎯 Integration Tests

### End-to-End Workflow

```
1. Register new user
2. Create HTTP request in Repeater
3. Run Scanner on target
4. Review vulnerabilities
5. Use Intruder to test specific parameter
6. Crawl target with Target Mapping
7. Export findings
```

## 🐛 Debugging Tips

### Enable Browser Console
- Press F12 in browser
- Check Console tab for JavaScript errors
- Check Network tab for API calls

### Check Backend Logs
- Monitor terminal where `npm run dev` is running
- Look for error messages and response codes

### Database Debugging (Neon)
```bash
# Connect to Neon database using DATABASE_URL from .env
psql $DATABASE_URL

# View tables
\dt

# Check requests table
SELECT * FROM requests LIMIT 5;

# Check scans
SELECT * FROM scans LIMIT 5;
```

## 🔒 Security Testing Tips

1. **Never test production systems without permission**
2. **Use test/vulnerable sites**: OWASP WebGoat, DVWA, bWAPP
3. **Document all testing** with dates and results
4. **Keep logs** for compliance requirements
5. **Test ethical scenarios** first

## 📝 Test Report Template

```
Test Date: [DATE]
Tester: [NAME]
Build: [VERSION]

Test Case: [TEST_NAME]
Status: [ ] Passed [ ] Failed [ ] Blocked

Expected Result: [EXPECTED]
Actual Result: [ACTUAL]

Severity (if failed): [ ] Critical [ ] High [ ] Medium [ ] Low

Comments:
[YOUR_NOTES]
```

## ✅ Test Coverage Checklist

- [ ] User Registration
- [ ] User Login
- [ ] Logout
- [ ] Proxy Interception
- [ ] Request Details Viewing
- [ ] Request Repeating
- [ ] Vulnerability Scanning
- [ ] Vulnerability Viewing
- [ ] Intruder Attacks
- [ ] Target Crawling
- [ ] Dashboard Statistics
- [ ] Error Handling
- [ ] Input Validation

---

For more information, see README.md
