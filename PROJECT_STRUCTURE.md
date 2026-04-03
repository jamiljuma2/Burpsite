# Project Structure

Burpsite/
│
├── 📄 README.md                          # Complete documentation
├── 📄 QUICKSTART.md                      # Quick start guide (5 min setup)
├── 📄 TESTING.md                         # Test cases and scenarios
├── 📄 API.md                             # API documentation
├── 📄 docker-compose.yml                 # Docker orchestration
├── 📄 .gitignore                         # Git ignore file
│
├── 📁 backend/                           # Node.js/Express backend
│   ├── 📄 package.json                   # Dependencies & scripts
│   ├── 📄 .env.example                   # Environment variables template
│   ├── 📄 Dockerfile                     # Docker configuration
│   │
│   └── 📁 src/
│       ├── 📄 server.js                  # Main server file
│       │
│       ├── 📁 config/
│       │   ├── 📄 database.js            # PostgreSQL connection
│       │   └── 📄 init.js                # Database initialization
│       │
│       ├── 📁 models/
│       │   ├── 📄 User.js                # User model
│       │   ├── 📄 Request.js             # HTTP Request model
│       │   └── 📄 Scan.js                # Scan model
│       │
│       ├── 📁 controllers/
│       │   ├── 📄 authController.js      # Auth logic
│       │   ├── 📄 requestController.js   # Request/Repeater logic
│       │   ├── 📄 scanController.js      # Scanner logic
│       │   ├── 📄 intruderController.js  # Intruder logic
│       │   └── 📄 targetController.js    # Target mapping logic
│       │
│       ├── 📁 routes/
│       │   ├── 📄 auth.js                # Auth endpoints
│       │   ├── 📄 requests.js            # Request endpoints
│       │   ├── 📄 scans.js               # Scan endpoints
│       │   ├── 📄 intruder.js            # Intruder endpoints
│       │   └── 📄 targets.js             # Target endpoints
│       │
│       ├── 📁 middleware/
│       │   ├── 📄 auth.js                # JWT verification
│       │   └── 📄 errorHandler.js        # Error handling
│       │
│       └── 📁 utils/
│           ├── 📄 scanner.js             # Vulnerability scanner
│           ├── 📄 proxy.js               # Proxy utilities
│           ├── 📄 repeater.js            # Request repeater logic
│           ├── 📄 intruder.js            # Attack/fuzzing logic
│           └── 📄 crawler.js             # Website crawler
│
├── 📁 frontend/                          # React frontend
│   ├── 📄 package.json                   # Dependencies & scripts
│   ├── 📄 .env                           # Environment variables
│   ├── 📄 .env.example                   # Environment template
│   ├── 📄 tailwind.config.js             # Tailwind configuration
│   ├── 📄 postcss.config.js              # PostCSS configuration
│   ├── 📄 nginx.conf                     # Nginx configuration
│   ├── 📄 .gitignore                     # Git ignore file
│   ├── 📄 Dockerfile                     # Docker configuration
│   │
│   └── 📁 src/
│       ├── 📄 index.jsx                  # React entry point
│       ├── 📄 App.jsx                    # Main App component
│       ├── 📄 index.css                  # Global styles
│       │
│       ├── 📁 pages/
│       │   ├── 📄 LoginPage.jsx          # Login page
│       │   ├── 📄 RegisterPage.jsx       # Registration page
│       │   ├── 📄 DashboardPage.jsx      # Dashboard/home
│       │   ├── 📄 ProxyPage.jsx          # Proxy interceptor
│       │   ├── 📄 RepeaterPage.jsx       # Request repeater
│       │   ├── 📄 ScannerPage.jsx        # Vulnerability scanner
│       │   ├── 📄 IntruderPage.jsx       # Intruder/attack tool
│       │   └── 📄 TargetsPage.jsx        # Target mapping
│       │
│       ├── 📁 components/
│       │   ├── 📄 Header.jsx             # App header
│       │   ├── 📄 Sidebar.jsx            # Navigation sidebar
│       │   ├── 📄 Common.jsx             # Shared components
│       │   │   └── LoadingSpinner, Alert, Tabs, Modal
│       │   └── 📄 RequestDetailsPanel.jsx # Request details viewer
│       │
│       ├── 📁 context/
│       │   ├── 📄 authStore.js           # Auth state (Zustand)
│       │   └── 📄 requestStore.js        # Request state (Zustand)
│       │
│       ├── 📁 utils/
│       │   └── 📄 api.js                 # Axios API client
│       │
│       ├── 📁 hooks/
│       │   └── (Custom React hooks)
│       │
│       └── 📁 public/
│           └── 📄 index.html             # HTML template
│
└── 📁 setup/ (scripts)
    ├── 📄 setup-backend.sh
    └── 📄 setup-frontend.sh
