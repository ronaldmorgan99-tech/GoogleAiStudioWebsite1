import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import 'dotenv/config';

import { env } from './env';
import { rateLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errors';

// Import routers
import authRoutes from './modules/auth/routes';
import forumRoutes from './modules/forums/routes';
// ... other routes will be added here

const app = express();

// --- Core Middleware ---
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter);

// --- API Routes ---
const apiRouter = express.Router();
apiRouter.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

apiRouter.use('/auth', authRoutes);
apiRouter.use('/forums', forumRoutes);
// apiRouter.use('/threads', threadRoutes);
// apiRouter.use('/users', userRoutes);
// ... etc.

app.use('/api', apiRouter);

// --- Error Handling ---
// Handle 404 for API routes
app.use('/api/*', (req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});
app.use(errorHandler);


// --- Server Start ---
app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});

export default app;
