import { rateLimit } from 'express-rate-limit';

export const rateLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes).
	standardHeaders: 'draft-7',
	legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 10 minutes.' }
});
