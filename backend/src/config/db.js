const { Pool } = require('pg');
require('dotenv').config();

// Cleaned Neon connection string (channel_binding removed for Node pg compatibility)
const neonConnectionString = 'postgresql://neondb_owner:npg_jq3XNbWD2Avu@ep-holy-wave-b36wjawa-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

// Priority: process.env.DATABASE_URL -> Fallback to neonConnectionString
const connectionString = (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres'))
  ? process.env.DATABASE_URL 
  : neonConnectionString;

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle Neon DB client:', err.message);
});

module.exports = pool;