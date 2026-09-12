const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Routes
const contributionRoutes = require('./routes/contribution.routes');
const moderatorRoutes = require('./routes/moderator.routes');
const adminRoutes = require('./routes/admin.routes'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route (Vercel backend testing ke liye)
app.get('/', (req, res) => {
  res.status(200).json({ message: "Bhasha Backend API is live & running!" });
});

// Main API Routes
app.use('/api/contributions', contributionRoutes);
app.use('/api/moderator', moderatorRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler (HTML error pages ko rokne aur clean JSON error bhejne ke liye)
app.use((err, req, res, next) => {
  console.error('Server Internal Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error: ' + err.message
  });
});

// Local machine par test karne ke liye condition
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// ⚠️ VERCEL SERVERLESS ENVIRONMENT KE LIYE COMPULSORY EXPORT:
module.exports = app;