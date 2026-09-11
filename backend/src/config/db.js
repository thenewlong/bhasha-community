const { Pool } = require('pg');

// Direct Neon Connection String (No .env dependency issue)
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_jq3XNbWD2Avu@ep-holy-wave-b36wjawa-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Check Connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('CONNECTED TO NEON CLOUD DATABASE SUCCESSFULLY!');
    release();
  }
});

module.exports = pool;