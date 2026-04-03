# 🚀 Quick Start Guide for Burpsite

Get Burpsite running in 5 minutes!

## Option 1: Quick Start (Recommended for Development)

### Prerequisites
- Node.js v16+
- Neon PostgreSQL account (free at https://console.neon.tech)

### Steps

1. **Setup Neon Database** (2 minutes)
   - Go to https://console.neon.tech
   - Create a free account
   - Click "Create Project"
   - Copy your connection string

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env - paste your Neon connection string to DATABASE_URL
   npm run dev
   ```

3. **Setup Frontend** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/health

5. **Create Account**
   - Click "Register"
   - Fill in your details
   - Click "Register"
   - Start testing!

## Option 2: Docker (Recommended for Production)

### Prerequisites
- Docker
- Docker Compose
- Neon PostgreSQL account

### Steps

1. **Setup Neon**
   - Get your connection string from https://console.neon.tech

2. **Clone/Extract Project**
   ```bash
   cd Burpsite
   ```

3. **Configure Environment**
   ```bash
   # Create .env file with your Neon credentials
   cat > .env << EOF
   DATABASE_URL=postgresql://user:password@ep-xxxxx.region.neon.tech/burpsite
   REACT_APP_API_URL=http://localhost:5000/api
   EOF
   ```

4. **Start Services**
   ```bash
   docker-compose up --build
   ```

5. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Database: Managed by Neon (no local database)

6. **Create Account**
   - Same as above

### Stopping Services
```bash
docker-compose down
```

### Viewing Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🏃 First Test Run

### 1. Create Account
- Email: your unique email address
- Password: your own strong password

### 2. Try Scanner
- Go to Scanner tab
- Enter: https://httpbin.org
- Click "Start Scan"
- Wait for results

### 3. Try Repeater
- Go to Repeater
- Click "New" tab
- URL: https://httpbin.org/get
- Click "Create & Send"
- View response

### 4. Try Intruder
- Go to Intruder
- URL: https://httpbin.org/get
- Parameter: test
- Payload Type: SQL Injection
- Click "Start Attack"
- View results

## 🔧 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED or getaddrinfo ENOTFOUND
```
Solution: 
- Verify Neon connection string in .env
- Check DATABASE_URL format: `postgresql://user:password@host/database`
- Ensure DB_SSL=true for Neon connections
- Test connection manually with psql:
  ```bash
  psql "postgresql://user:password@host/database"
  ```

### SSL Certificate Error
```
Error: self signed certificate
```
Solution: Already handled in code - `rejectUnauthorized: false` is set for Neon

### Port Already in Use
```bash
# Find process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

### Frontend can't connect to backend
```
Failed to fetch
```
Solution:
- Verify backend is running on :5000
- Check REACT_APP_API_URL in .env
- Check CORS settings in backend

## 📚 Next Steps

1. Read the full [README.md](README.md)
2. Check [TESTING.md](TESTING.md) for test cases
3. Review API Documentation in README.md
4. Configure for production use

## 🆘 Need Help?

- Check [README.md](README.md) for detailed docs
- Review [TESTING.md](TESTING.md) for test examples
- Check backend logs: `cd backend && npm run dev`
- Check browser console: F12 → Console tab

## ✅ Verification Checklist

- [ ] Backend running on :5000
- [ ] Frontend running on :3000
- [ ] Can access http://localhost:3000
- [ ] Can create account
- [ ] Can login
- [ ] Can access dashboard
- [ ] Can navigate tabs
- [ ] Backend/DB connected (no errors)

---

**You're all set!** Happy security testing! 🛡️
