const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Relative paths fixed (kyunki server.js khud 'src' folder ke andar hai)
const contributionRoutes = require('./routes/contribution.routes');
const moderatorRoutes = require('./routes/moderator.routes');
const adminRoutes = require('./routes/export.routes'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contributions', contributionRoutes);
app.use('/api/moderator', moderatorRoutes);
app.use('/api/admin', adminRoutes);

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});