const { Pool } = require('pg');
require('dotenv').config();

// Environment variable se URL lega (fallback ke sath taaki crash na ho)
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_jq3XNbWD2Avu@ep-holy-wave-b36wjawa-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false // Neon Database ke SSL connection ke liye compulsory hai
  },
  // Vercel Serverless execution ke liye optimization
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Idle connections par aane wale unexpected errors ko handle karne ke liye
pool.on('error', (err) => {
  console.error('Unexpected error on idle Neon DB client:', err.message);
});

// Database connection check
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Neon Database connection error:', err.stack);
  } else {
    console.log('✅ CONNECTED TO NEON CLOUD DATABASE SUCCESSFULLY!');
    release(); // Connection check ke baad client ko turant release karna zaroori hai
  }
});

module.exports = pool;