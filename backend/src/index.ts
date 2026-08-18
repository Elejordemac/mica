import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { pool } from './db';
import guestRoutes from './routes/guests';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
app.use(cors({
  origin: frontendUrl,
  credentials: true,
}));

app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/guests', guestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down...');
  await pool.end();
  process.exit(0);
});

export default app;
