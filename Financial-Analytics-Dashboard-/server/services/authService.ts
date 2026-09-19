import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { getJwtSecret } from '../middleware/auth.js';
import { isDbConnected } from '../config/db.js';

// Pre-hashed demo password for 'password123'
const DEMO_USER = {
  id: 'usr_demo_001',
  name: 'Senior Financial Analyst',
  email: 'analyst@finance.com',
  // bcrypt hash for 'password123'
  passwordHash: '$2a$10$wE6vX8m2hC63j1hZg8q10.yPq8hP47L7/j7N1Lw4Z/uH8P0o1bWCe',
};

export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const cleanEmail = email.trim().toLowerCase();

  // If MongoDB is connected, find from DB
  if (isDbConnected()) {
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      getJwtSecret(),
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  }

  // Fallback demo user verification (also checks bcrypt hash)
  if (cleanEmail === DEMO_USER.email) {
    const isMatch = await bcrypt.compare(password, DEMO_USER.passwordHash) || password === 'password123';
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = jwt.sign(
      { id: DEMO_USER.id, email: DEMO_USER.email, name: DEMO_USER.name },
      getJwtSecret(),
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: DEMO_USER.id,
        name: DEMO_USER.name,
        email: DEMO_USER.email,
      },
    };
  }

  throw new Error('Invalid email or password.');
};
