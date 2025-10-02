import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { config } from '../config/environment';
import { userService } from '../services/userService';
import { validate } from '../middleware/validation';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { ApiResponse, AuthTokens } from '../types';

const router = Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(1).max(50).required(),
  lastName: Joi.string().min(1).max(50).required(),
  currency: Joi.string().length(3).optional(),
  timezone: Joi.string().optional(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// Store refresh tokens (use Redis in production)
const refreshTokens = new Set<string>();

const generateTokens = (userId: string): AuthTokens => {
  const accessToken = jwt.sign(
    { userId },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  refreshTokens.add(refreshToken);

  return { accessToken, refreshToken };
};

// Register new user
router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const userData = req.body;
  
  const user = await userService.create(userData);
  const tokens = generateTokens(user.id);

  const response: ApiResponse<{ user: any; tokens: AuthTokens }> = {
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        currency: user.currency,
        timezone: user.timezone,
      },
      tokens,
    },
    message: 'User registered successfully',
  };

  res.status(201).json(response);
}));

// Login user
router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Find user by username or email
  let user = await userService.findByUsername(username);
  if (!user) {
    user = await userService.findByEmail(username);
  }

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Verify password
  const isValidPassword = await userService.verifyPassword(user.id, password);
  if (!isValidPassword) {
    throw new AppError('Invalid credentials', 401);
  }

  const tokens = generateTokens(user.id);

  const response: ApiResponse<{ user: any; tokens: AuthTokens }> = {
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        currency: user.currency,
        timezone: user.timezone,
      },
      tokens,
    },
    message: 'Login successful',
  };

  res.json(response);
}));

// Refresh access token
router.post('/refresh', validate(refreshSchema), asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshTokens.has(refreshToken)) {
    throw new AppError('Invalid refresh token', 401);
  }

  try {
    const decoded = jwt.verify(refreshToken, config.jwt.secret) as any;
    
    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid token type', 401);
    }

    const user = await userService.findById(decoded.userId);
    if (!user) {
      throw new AppError('User not found', 401);
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user.id },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const response: ApiResponse<{ accessToken: string }> = {
      success: true,
      data: { accessToken },
      message: 'Token refreshed successfully',
    };

    res.json(response);
  } catch (error) {
    refreshTokens.delete(refreshToken);
    throw new AppError('Invalid refresh token', 401);
  }
}));

// Logout user
router.post('/logout', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Logout successful',
  };

  res.json(response);
}));

export default router;