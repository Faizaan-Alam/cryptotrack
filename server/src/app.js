import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { connectDB } from './config/db.js';
import { getFrontendUrl } from './utils/urls.js';
import authRoutes from './routes/auth.js';
import userDataRoutes from './routes/userData.js';

const app = express();

app.use(
  cors({
    origin: getFrontendUrl(),
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error.message);
    res.status(503).json({ error: 'Database unavailable. Check MongoDB Atlas settings.' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/user/data', userDataRoutes);

export default app;