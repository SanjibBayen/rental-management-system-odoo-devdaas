import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export const generateToken = (userId: string, role: string) => {
  return jwt.sign(
    { user_id: userId, role },
    config.app.jwtSecret,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.app.jwtSecret);
  } catch (error) {
    return null;
  }
};