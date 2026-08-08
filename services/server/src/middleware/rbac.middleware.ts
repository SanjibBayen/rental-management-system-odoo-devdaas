import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt.js';
import { queryOne } from '../config/database.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    role: 'admin' | 'customer' | 'delivery';
    email_verified: boolean;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        full_name: string;
        phone?: string;
        role: 'admin' | 'customer' | 'delivery';
        email_verified: boolean;
      };
    }
  }
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please login first.',
      });
      return;
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      res.status(401).json({
        success: false,
        message: 'Invalid authorization format.',
      });
      return;
    }

    const decoded = verifyToken(token) as string | JwtPayload;

    if (!decoded || typeof decoded === 'string') {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token.',
      });
      return;
    }

    if (!decoded.user_id) {
      res.status(401).json({
        success: false,
        message: 'Invalid authentication token.',
      });
      return;
    }

    const user = await queryOne(
      `SELECT id, email, full_name, phone, role, email_verified, created_at
             FROM user_profiles
             WHERE id = $1`,
      [decoded.user_id]
    );

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      email_verified: user.email_verified,
    };

    next();
  } catch (error: unknown) {
    console.error('Authentication error:', error instanceof Error ? error.message : error);

    res.status(401).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
};

export const rbacMiddleware = (allowedRoles: Array<'admin' | 'customer' | 'delivery'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role || !allowedRoles.includes(role)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: insufficient permissions.',
      });
      return;
    }

    next();
  };
};
