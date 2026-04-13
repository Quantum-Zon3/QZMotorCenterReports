const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const reportRoutes = require('./rutas/ReportRutas');

const app = express();

// Conectar a MongoDB Atlas
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/reports', reportRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'reports-service' });
});

module.exports = app;