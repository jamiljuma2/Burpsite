const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { initializeDatabase } = require('./config/init');
const authMiddleware = require('./middleware/auth');
const adminMiddleware = require('./middleware/admin');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const scanRoutes = require('./routes/scans');
const intruderRoutes = require('./routes/intruder');
const targetRoutes = require('./routes/targets');
const adminRoutes = require('./routes/admin');

const app = express();

const defaultOrigins = [
  'http://localhost:3000',
  'https://burpsite.vercel.app',
  'https://burpsite-t3o3.vercel.app',
];

const envOrigins = `${process.env.FRONTEND_URLS || ''},${process.env.FRONTEND_URL || ''}`
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'ws://localhost:*', 'ws://127.0.0.1:*'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  xPoweredBy: false,
  xContentTypeOptions: true,
  xFrameOptions: { action: 'deny' },
  xXssProtection: true,
}));
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser clients and same-origin requests without Origin header.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
});

app.use(limiter);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Burpsite API is running' });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/requests', authMiddleware, requestRoutes);
app.use('/api/scans', authMiddleware, scanRoutes);
app.use('/api/intruder', authMiddleware, intruderRoutes);
app.use('/api/targets', authMiddleware, targetRoutes);
app.use('/api/admin', authMiddleware, adminMiddleware, adminRoutes);

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
const initServer = async () => {
  try {
    await initializeDatabase();
    console.log('✓ Database initialized');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✓ Burpsite API running on port ${PORT}`);
      console.log(`✓ Allowed frontend origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error('✗ Failed to initialize server:', error);
    process.exit(1);
  }
};

initServer();

module.exports = app;
