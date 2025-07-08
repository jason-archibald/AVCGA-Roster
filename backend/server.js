require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection test
(async () => {
    try {
        await pool.query('SELECT NOW()');
        console.log('✅ Database connection successful.');
    } catch (err) {
        console.error('❌ DATABASE CONNECTION FAILED:', err.message);
    }
})();

// Route registrations
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/organization', require('./routes/organizationRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/rosters', require('./routes/rosterRoutes'));
app.use('/api/permissions', require('./routes/permissionRoutes'));
app.use('/api/templates', require('./routes/templateRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'AVCGA CrewHub Backend',
        version: '2.0.0'
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AVCGA CrewHub Backend v2.0 running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Enhanced permissions and hierarchy system active`);
    console.log(`📋 Template and resource management system active`);
});
