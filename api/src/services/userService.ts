import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/environment';
import { User } from '../types';
import { AppError } from '../middleware/errorHandler';

// In-memory storage for demo (replace with database in production)
const users: User[] = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    username: 'demo',
    firstName: 'Demo',
    lastName: 'User',
    currency: 'NOK',
    timezone: 'Europe/Oslo',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Store hashed passwords separately for security
const userPasswords = new Map<string, string>();

// Initialize demo user password
(async () => {
  const hashedPassword = await bcrypt.hash('demo', config.security.bcryptRounds);
  userPasswords.set('user-1', hashedPassword);
})();

export const userService = {
  async findById(id: string): Promise<User | null> {
    return users.find(user => user.id === id) || null;
  },

  async findByEmail(email: string): Promise<User | null> {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findByUsername(username: string): Promise<User | null> {
    return users.find(user => user.username.toLowerCase() === username.toLowerCase()) || null;
  },

  async create(userData: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    currency?: string;
    timezone?: string;
  }): Promise<User> {
    // Check if user already exists
    const existingEmail = await this.findByEmail(userData.email);
    if (existingEmail) {
      throw new AppError('Email already registered', 400);
    }

    const existingUsername = await this.findByUsername(userData.username);
    if (existingUsername) {
      throw new AppError('Username already taken', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, config.security.bcryptRounds);

    // Create user
    const user: User = {
      id: uuidv4(),
      email: userData.email.toLowerCase(),
      username: userData.username.toLowerCase(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      currency: userData.currency || 'NOK',
      timezone: userData.timezone || 'Europe/Oslo',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(user);
    userPasswords.set(user.id, hashedPassword);

    return user;
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new AppError('User not found', 404);
    }

    const updatedUser: User = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date(),
    };

    users[userIndex] = updatedUser;
    return updatedUser;
  },

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const hashedPassword = userPasswords.get(userId);
    if (!hashedPassword) {
      return false;
    }
    return bcrypt.compare(password, hashedPassword);
  },

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, config.security.bcryptRounds);
    userPasswords.set(userId, hashedPassword);
  },

  async delete(id: string): Promise<void> {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new AppError('User not found', 404);
    }

    users.splice(userIndex, 1);
    userPasswords.delete(id);
  },
};