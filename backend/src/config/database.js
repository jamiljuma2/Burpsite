const { Pool } = require('pg');
require('dotenv').config();

// Support both DATABASE_URL (Neon connection string) and individual parameters
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false,
    });

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
