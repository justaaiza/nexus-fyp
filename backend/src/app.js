const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const routes = require('./adapters/http/routes');
const errorHandler = require('./adapters/http/middlewares/error.middleware');

const app = express();

/* ── Core Middleware ── */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* ── Static file serving for uploads ── */
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

/* ── API Routes ── */
app.use('/api', routes);

/* ── Health Check ── */
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

/* ── 404 Handler ── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

/* ── Global Error Handler ── */
app.use(errorHandler);

module.exports = app;
