import { Router } from 'express';
import { getForumsHomepageHandler } from './controller';

const router = Router();

// This single endpoint provides all the data for the main /forums page
router.get('/', getForumsHomepageHandler);

// GET /api/forums/:forumId/threads?cursor=&limit=
// This route will likely live in a separate threads module
// router.get('/:forumId/threads', ...)

export default router;
