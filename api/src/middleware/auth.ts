import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../env';
import prisma from '../prisma';
import { ApiError } from './errors';

interface JwtPayload {
  userId: string;
}

// Augment the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        // Add other user properties you need
      };
    }
  }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies[env.COOKIE_NAME];

  if (!token) {
    return next(new ApiError(401, 'Unauthorized', 'No authentication token provided.'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        role: true,
        isBanned: true,
      }
    });

    if (!user || user.isBanned) {
      return next(new ApiError(401, 'Unauthorized', 'User not found or is banned.'));
    }
    
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Unauthorized', 'Invalid or expired token.'));
  }
};
