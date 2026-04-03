# 🛡️ Burpsite - Web Security Testing Tool

A full-stack web application inspired by Burp Suite, designed for comprehensive web application security testing. Built with React, Node.js/Express, and PostgreSQL.

## ⚠️ Legal Disclaimer

**This tool is designed for authorized security testing only.** Unauthorized access to computer systems is illegal. You must:
- Only test systems you own or have explicit written permission to test
- Comply with all applicable laws and regulations
- Use this tool ethically and responsibly
- Obtain proper authorization before testing any third-party systems

## 🌟 Features

### 1. **Proxy Interceptor**
- Intercept HTTP/HTTPS requests between browser and server
- View, edit, forward, or drop requests
- Display headers, body, cookies, and parameters
- Real-time request/response analysis

### 2. **Request Repeater**
- Resend and modify HTTP requests manually
- Save request history
- Compare responses (status, headers, body, response time)
- Support for different HTTP methods (GET, POST, PUT, DELETE, PATCH)

### 3. **Scanner Module**
- Automatically scan URLs for common vulnerabilities:
  - SQL Injection
  - Cross-Site Scripting (XSS)
  - Cross-Site Request Forgery (CSRF)
  - Open Redirects
- Severity level indicators (High, Medium, Low)
- Detailed vulnerability descriptions and payloads

### 4. **Intruder (Attack Tool)**
- Perform brute-force and fuzzing attacks on inputs
- Multiple payload types:
  - SQL Injection payloads
  - XSS payloads
  - Common passwords
  - Path traversal payloads
- Flexible payload injection (query, headers, body)
- Structured results table (status codes, response length, timing)

### 5. **Target Mapping & Crawling**
- Crawl and map website structure
- Discover endpoints automatically
- Display endpoints in list view
- Scope limiting to prevent crawling external sites

### 6. **Dashboard**
- Clean, modern dark theme interface
- Real-time statistics
- Quick-start access to all modules
- Navigation tabs for easy module switching

## 🏗️ Architecture

### Backend
- **Framework**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **HTTP Client**: Axios
- **DOM Parsing**: jsdom

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Zustand
- **Icons**: Lucide React
- **Routing**: React Router v6

## 📋 Prerequisites

- **Node.js**: v16+ 
- **npm**: v8+
- **Neon PostgreSQL**: Free account at https://console.neon.tech
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge

## 🚀 Installation & Setup

### Step 1: Clone or Extract the Project

```bash
cd Burpsite
```

### Step 2: Database Setup (Neon PostgreSQL)

1. **Create a Neon Project**
   - Go to https://console.neon.tech
   - Sign up (free tier available with generous quotas)
   - Click "Create Project"
   - Database name: `burpsite`
   - Select region close to you
   - Click "Create Project"

2. **Get Connection String**
   - In Neon console, copy the connection string
   - Format: `postgresql://[username]:[password]@[host]/[database]`
   - Example: `postgresql://neondb_owner:AbCdEf123@ep-cool-wave-12345.us-east-1.neon.tech/burpsite`

3. **Configure Burpsite**
   Edit `backend/.env`:
   ```env
   # Option A: Use connection string directly (recommended)
   DATABASE_URL=postgresql://username:password@ep-xxxxx.region.neon.tech/burpsite
   
   # Option B: Use individual parameters
   DB_HOST=ep-xxxxx.region.neon.tech
   DB_PORT=5432
   DB_NAME=burpsite
   DB_USER=neondb_owner
   DB_PASSWORD=your_password
   DB_SSL=true
   ```

### Step 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables from Neon
cp .env.example .env

# Edit .env with your Neon database credentials:
# - DATABASE_URL: postgresql://user:password@host/database (from Neon)
# - DB_SSL: true
```

### Step 4: Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# .env is already configured for local development
```

### Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Application will open on http://localhost:3000
```

## 📖 Usage Guide

### Creating an Account

1. Go to http://localhost:3000
2. Click "Register here"
3. Enter username, email, and password
4. Click "Register"

### Using the Dashboard

The dashboard provides quick access to all modules:
- **Quick Start Cards**: One-click navigation to each module
- **Statistics**: View your testing activity
- **Features**: Overview of available tools

### Proxy Interceptor

1. Navigate to **Proxy** tab
2. Configure your browser to use the proxy (optional - future enhancement)
3. Make requests from your browser
4. View captured requests in the list
5. Click a request to see headers, body, cookies, and response
6. Delete requests to clean up history

### Request Repeater

1. Go to **Repeater** tab
2. Choose existing request or create new one:
   - Select method (GET, POST, PUT, DELETE, PATCH, HEAD)
   - Enter target URL
   - Add headers as JSON
   - Add request body (for POST/PUT)
3. Click "Create & Send" to execute
4. View response headers, body, and timing

### Scanner

1. Go to **Scanner** tab
2. Enter target URL in the "Start Scan" field
3. Click "Start Scan" button
4. Monitor scan progress
5. View discovered vulnerabilities:
   - SQL Injection
   - XSS
   - CSRF
   - Open Redirects
6. Click on scan to see detailed vulnerability information

### Intruder

1. Go to **Intruder** tab
2. Configure attack:
   - **Target URL**: Full URL to test
   - **Parameter Name**: Input parameter name
   - **Payload Type**: 
     - SQL Injection
     - XSS Payloads
     - Brute Force
     - Path Traversal
   - **Position**: Query parameter, Header, or Body
3. Click "Start Attack"
4. View results table showing:
   - Payload used
   - HTTP status code
   - Response length
   - Response time

### Target Mapping

1. Go to **Target Map** tab
2. Enter base URL (e.g., https://example.com)
3. Click "Start Crawl"
4. Wait for crawling to complete
5. View discovered endpoints in right panel
6. Endpoints are limited to the target domain (safe crawling)

## 🗄️ Database Schema

### Tables

- **users**: User accounts and authentication
- **requests**: Captured HTTP requests and responses
- **scans**: Vulnerability scan records
- **attack_results**: Intruder attack results
- **targets**: Target websites for crawling
- **payloads**: Custom payload lists (for future enhancement)
- **reports**: Generated vulnerability reports

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Helmet security headers
- Rate limiting (100 requests per 15 minutes)
- Input validation
- Scope limiting for web crawling
- No sensitive data in logs

## ⚙️ Configuration

### Backend Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database (Neon)
DATABASE_URL=postgresql://neondb_owner:password@ep-xxxxx.region.neon.tech/burpsite
DB_SSL=true

# Or use individual connection parameters (for fallback):
# DB_HOST=ep-xxxxx.region.neon.tech
# DB_PORT=5432
# DB_NAME=burpsite
# DB_USER=neondb_owner
# DB_PASSWORD=your_password
# DB_SSL=true

# Security
JWT_SECRET=your_super_secret_key_change_in_production

# Ports
PROXY_PORT=8888

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📝 Sample Test Cases

### Test Case 1: Scan a Vulnerable URL

1. Use a public vulnerable app (e.g., OWASP WebGoat, DVWA)
2. Go to Scanner
3. Enter the URL
4. Observe detected vulnerabilities

### Test Case 2: Repeat a Request with Modifications

1. Go to Repeater
2. Create request to example.com/api/users
3. Modify headers (add Authorization token)
4. Send and compare responses

### Test Case 3: Intruder Attack

1. Go to Intruder
2. Target: http://localhost:3000/api/users
3. Parameter: id
4. Payload Type: Brute Force
5. Start attack and analyze response codes

### Test Case 4: Map a Website

1. Go to Target Map
2. Enter https://example.com
3. Wait for crawl completion
4. Review discovered endpoints

## 🛠️ Troubleshooting

### Database Connection Error (Neon)

```
Error: unable to connect / ENOTFOUND / SSL Error
```

**Solution:**
- Verify DATABASE_URL is set in .env (format: `postgresql://[user]:[password]@[host]/[database]`)
- Check Neon project dashboard for correct connection string
- Verify credentials are URL-encoded (special characters must be encoded)
- Test connection with psql:
  ```bash
  psql "postgresql://user:password@host/database"
  ```
- Ensure SSL is enabled: set `DB_SSL=true` in .env
- Check Neon project is not suspended
- Review Neon documentation at https://neon.tech/docs/connect/connection-details

### Frontend can't connect to backend

```
Failed to fetch
```

**Solution:**
- Verify backend is running on :5000
- Check REACT_APP_API_URL in .env
- Check CORS settings in backend

### Port already in use

```
EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find and kill process
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

### Database initialization error

**Solution:**
```bash
# Manually initialize database:
cd backend
node src/scripts/migrate.js
```

## 🚀 Deployment

### Production Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Use PostgreSQL credentials with strong passwords
- [ ] Enable HTTPS for frontend and backend
- [ ] Configure proper CORS origins
- [ ] Set NODE_ENV=production
- [ ] Use environment-specific .env files
- [ ] Set up proper logging
- [ ] Configure rate limiting appropriately
- [ ] Use a reverse proxy (nginx) for frontend
- [ ] Set up automated backups

### Docker Deployment (Optional)

See `Dockerfile` for containerization setup.

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register
  Body: { username, email, password, confirmPassword }
  Response: { user, token }

POST /api/auth/login
  Body: { email, password }
  Response: { user, token }

GET /api/auth/profile
  Headers: Authorization: Bearer <token>
  Response: { id, username, email, role }
```

### Request Endpoints

```
GET /api/requests
  Get all requests

POST /api/requests
  Create new request

GET /api/requests/:id
  Get specific request

POST /api/requests/:id/repeat
  Repeat request execution

DELETE /api/requests/:id
  Delete request
```

### Scanner Endpoints

```
POST /api/scans/start
  Body: { targetUrl }
  Start vulnerability scan

GET /api/scans
  Get all scans

GET /api/scans/:id
  Get specific scan

DELETE /api/scans/:id
  Delete scan
```

### Intruder Endpoints

```
POST /api/intruder/start
  Body: { method, url, paramName, payloadType, position }
  Start attack

GET /api/intruder/attack/:attackId
  Get attack results

GET /api/intruder/payloads
  Query: type
  Get payload list
```

### Target Endpoints

```
POST /api/targets/crawl
  Body: { baseUrl }
  Start crawling

GET /api/targets
  Get all targets

GET /api/targets/:id
  Get specific target

DELETE /api/targets/:id
  Delete target
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 🙋 Support & Questions

For issues, questions, or suggestions:
- Check existing issues in the repository
- Create a new issue with detailed information
- Include steps to reproduce bugs

## 🎯 Future Enhancements

- [ ] Proxy server implementation with MITM capability
- [ ] WebSocket support for real-time updates
- [ ] PDF/JSON report generation
- [ ] Custom payload list management
- [ ] API endpoint discovery
- [ ] Session management and replay
- [ ] Plugin system for custom modules
- [ ] Collaborative testing features
- [ ] Integration with vulnerability databases
- [ ] Automated scheduling for scans

## 📞 Contact

For security vulnerabilities, please report privately rather than using the issue tracker.

---

**Remember**: Use this tool responsibly and ethically. Always get permission before testing systems you don't own.

Happy testing! 🛡️
