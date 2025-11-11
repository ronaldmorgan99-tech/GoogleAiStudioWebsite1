import { Request, Response, NextFunction } from 'express';
import { register, login } from './service';
import { env } from '../../env';
import { LoginInput, RegisterInput } from './auth.schema';
import { ApiError } from '../../middleware/errors';
import prisma from '../../prisma';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    // maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days - set by JWT expiry instead
};

export const registerHandler = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, token } = await register(req.body);
    res.cookie(env.COOKIE_NAME, token, COOKIE_OPTIONS);
    res.status(201).json({
      message: 'Registration successful',
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, token } = await login(req.body);
    res.cookie(env.COOKIE_NAME, token, COOKIE_OPTIONS);
    res.status(200).json({
        message: 'Login successful',
        user,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutHandler = (req: Request, res: Response) => {
    res.clearCookie(env.COOKIE_NAME, COOKIE_OPTIONS);
    res.status(200).json({ message: 'Logout successful' });
};

export const getMeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            // This case should be handled by isAuthenticated, but as a safeguard
            return next(new ApiError(401, 'Unauthorized', 'No user session found.'));
        }
        
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                avatarUrl: true,
                joinDate: true,
                totalPosts: true,
            }
        });

        if (!user) {
             return next(new ApiError(404, 'Not Found', 'User not found.'));
        }

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};