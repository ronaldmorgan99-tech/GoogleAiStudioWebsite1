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

// When running behind a proxy (dev containers / staging), trust the first proxy so
// express-rate-limit can correctly read `X-Forwarded-For`. Adjust in production
// if you have a different proxy topology.
app.set('trust proxy', 1);

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
// Ensure API responses are JSON: guard/rescue empty or non-JSON responses so the frontend
// never receives an empty body when JSON is expected. We override `res.json` and
// `res.send` for routes mounted under `/api`.
apiRouter.use((req, res, next) => {
  const _json = res.json.bind(res);
  const _send = res.send.bind(res);

  res.json = (body?: any) => {
    if (body === undefined || body === null) body = {};
    res.setHeader('Content-Type', 'application/json');
    return _json(body);
  };

  res.send = (body?: any) => {
    // If an empty response is sent, convert to an empty JSON object
    if (body === undefined || body === null || body === '') {
      res.setHeader('Content-Type', 'application/json');
      return _json({});
    }

    // If Content-Type isn't set, default to JSON for API routes
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json');
    }

    return _send(body);
  };

  next();
});

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
app.listen(env.PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${env.PORT}`);
});

export default app;
