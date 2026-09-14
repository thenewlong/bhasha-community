const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 📁 Route Modules Import
const contributionRoutes = require('./routes/contribution.routes');
const moderatorRoutes = require('./routes/moderator.routes');
const adminRoutes = require('./routes/admin.routes'); 

const app = express();

// 🌐 CORS Configuration (Frontend - Vercel & Localhost access guarantee)
const corsOptions = {
  origin: '*', // Production mein specific domain bhi set kar sakte hain (e.g. 'https://your-app.vercel.app')
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// ⚙️ Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🟢 Health Check Route (Backend Connectivity Testing)
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: "online",
    message: "Bhasha Backend API is live & running!",
    timestamp: new Date().toISOString()
  });
});

// 🛣️ Main API Routes Registration
app.use('/api/contributions', contributionRoutes);
app.use('/api/moderator', moderatorRoutes);
app.use('/api/admin', adminRoutes);

// 🔍 Route Fallback Aliases (Admin & Moderator Smooth Sync)
// Direct `/api/admin/contributions` handling mapped to admin router if needed
app.use('/api/admin/contributions', adminRoutes);

// 🚫 404 Route Not Found Handler (Prevents HTML 404 Pages)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route Not Found: [${req.method}] ${req.originalUrl}`
  });
});

// ⚠️ Global Error Handler (Clean JSON Error Output)
app.use((err, req, res, next) => {
  console.error('🔥 Server Internal Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 💻 Local Development Server Listener
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}

// 📦 Vercel Serverless Deployment Export
module.exports = app;