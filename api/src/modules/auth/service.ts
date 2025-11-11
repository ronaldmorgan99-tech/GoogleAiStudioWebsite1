import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma';
import { env } from '../../env';
import { LoginInput, RegisterInput } from './auth.schema';
import { ApiError } from '../../middleware/errors';
import { Role } from '@prisma/client';

export const register = async (input: RegisterInput) => {
  const { username, email, password } = input;

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existingUser) {
    throw new ApiError(409, 'Conflict', 'User with this email or username already exists.');
  }

  const passwordHash = await argon2.hash(password);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      role: Role.USER, // Default role
    },
    select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatarUrl: true
    }
  });

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  return { user, token };
};


export const login = async (input: LoginInput) => {
  const { email, password } = input;
  
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash) {
    throw new ApiError(401, 'Unauthorized', 'Invalid email or password.');
  }

  const isPasswordValid = await argon2.verify(user.passwordHash, password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Unauthorized', 'Invalid email or password.');
  }

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
  
  const { passwordHash, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};
