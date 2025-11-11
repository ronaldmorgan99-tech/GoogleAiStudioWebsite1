import { Router } from 'express';
import { processRequestBody } from 'zod-express-middleware';
import { registerSchema, loginSchema } from './auth.schema';
import { registerHandler, loginHandler, logoutHandler, getMeHandler } from './controller';
import { isAuthenticated } from '../../middleware/auth';

const router = Router();

router.post('/register', processRequestBody(registerSchema.body), registerHandler);
router.post('/login', processRequestBody(loginSchema.body), loginHandler);
router.post('/logout', logoutHandler);
router.get('/me', isAuthenticated, getMeHandler);

// Discord OAuth routes would be added here
// router.get('/discord', ...)
// router.get('/discord/callback', ...)

export default router;
