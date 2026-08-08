import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, queryOne } from '../config/database';
import { redis } from '../config/redis';
import { config } from '../config/env';
import * as emailService from '../services/email.service';

// Handle email service import safely
const sendVerificationOTP: any =
  (emailService as any).sendVerificationOTP ??
  (emailService as any).default?.sendVerificationOTP ??
  (emailService as any).default;

const generateOTP = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

const hashOTP = (otp: string): string => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

export class AuthController {
  // ============================================================
  // 1. REGISTER
  // ============================================================
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, full_name, phone, role } = req.body;

      // 1. Validate input
      if (!email || !password || !full_name) {
        res.status(400).json({
          success: false,
          message: 'Email, password and full name are required.',
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'Password must contain at least 6 characters.',
        });
        return;
      }

      // 2. Check if email already exists
      const existingUser = await queryOne(
        'SELECT id FROM user_profiles WHERE email = $1',
        [email.toLowerCase().trim()]
      );

      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'Email is already registered.',
        });
        return;
      }

      // 3. Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // 4. Generate OTP
      const otp = generateOTP();
      const otpHash = hashOTP(otp);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // 5. Insert user into database
      const user = await queryOne(
        `INSERT INTO user_profiles (email, password_hash, full_name, phone, role, email_verified)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, email, full_name, phone, role, email_verified, created_at`,
        [
          email.toLowerCase().trim(),
          passwordHash,
          full_name,
          phone || null,
          role || 'customer',
          false,
        ]
      );

      if (!user) {
        res.status(500).json({
          success: false,
          message: 'Unable to create user.',
        });
        return;
      }

      // 6. Store OTP in database
      await query(
        `INSERT INTO email_verification_otps (user_id, email, otp_hash, expires_at, verified)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, email.toLowerCase().trim(), otpHash, expiresAt, false]
      );

      // 7. Send verification email
      try {
        await sendVerificationOTP(email, otp, full_name);
      } catch (emailError: unknown) {
        console.error(
          'Email sending error:',
          emailError instanceof Error ? emailError.message : emailError
        );
        // Do not rollback user creation; just warn
      }

      res.status(201).json({
        success: true,
        message:
          'Registration successful. A 6-digit verification code has been sent to your email.',
        userId: user.id,
        email: user.email,
        requiresEmailVerification: true,
      });
    } catch (error: unknown) {
      console.error(
        'Registration error:',
        error instanceof Error ? error.message : error
      );
      res.status(500).json({
        success: false,
        message: 'Registration failed.',
      });
    }
  }

  // ============================================================
  // 2. LOGIN
  // ============================================================
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required.',
        });
        return;
      }

      // 1. Get user from database
      const user = await queryOne(
        `SELECT id, email, password_hash, full_name, phone, role, email_verified
         FROM user_profiles
         WHERE email = $1`,
        [email.toLowerCase().trim()]
      );

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
        return;
      }

      // 2. Check email verification
      if (!user.email_verified) {
        res.status(403).json({
          success: false,
          message: 'Please verify your email before logging in.',
          requiresEmailVerification: true,
          userId: user.id,
        });
        return;
      }

      // 3. Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
        return;
      }

      // 4. Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.app.jwtSecret,
        { expiresIn: '7d' }
      );

      // 5. Store session in Redis
      await redis.setex(`session:${user.id}`, 604800, token); // 7 days

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          role: user.role,
          email_verified: user.email_verified,
        },
        token,
      });
    } catch (error: unknown) {
      console.error(
        'Login error:',
        error instanceof Error ? error.message : error
      );
      res.status(500).json({
        success: false,
        message: 'Login failed.',
      });
    }
  }

  // ============================================================
  // 3. GET CURRENT USER
  // ============================================================
  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
        return;
      }

      const user = await queryOne(
        `SELECT id, email, full_name, phone, role, email_verified, created_at
         FROM user_profiles
         WHERE id = $1`,
        [userId]
      );

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: unknown) {
      console.error(
        'Get me error:',
        error instanceof Error ? error.message : error
      );
      res.status(500).json({
        success: false,
        message: 'Unable to retrieve user.',
      });
    }
  }

  // ============================================================
  // 4. LOGOUT
  // ============================================================
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (userId) {
        // Remove session from Redis
        await redis.del(`session:${userId}`);
      }

      res.status(200).json({
        success: true,
        message: 'Logged out successfully.',
      });
    } catch (error: unknown) {
      console.error(
        'Logout error:',
        error instanceof Error ? error.message : error
      );
      res.status(500).json({
        success: false,
        message: 'Logout failed.',
      });
    }
  }

  // ============================================================
  // 5. VERIFY OTP
  // ============================================================
  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { userId, otp } = req.body;

      if (!userId || !otp) {
        res.status(400).json({
          success: false,
          message: 'userId and otp are required.',
        });
        return;
      }

      // 1. Fetch the latest unverified OTP for this user
      const record = await queryOne(
        `SELECT otp_hash, expires_at, verified
         FROM email_verification_otps
         WHERE user_id = $1 AND verified = false
         ORDER BY created_at DESC
         LIMIT 1`,
        [userId]
      );

      if (!record) {
        res.status(400).json({
          success: false,
          message: 'No pending OTP found. Please request a new one.',
        });
        return;
      }

      // 2. Check if OTP has expired
      if (new Date() > new Date(record.expires_at)) {
        res.status(400).json({
          success: false,
          message: 'OTP has expired. Please request a new one.',
        });
        return;
      }

      // 3. Hash the input OTP and compare with stored hash
      const otpHash = hashOTP(otp);
      if (otpHash !== record.otp_hash) {
        res.status(400).json({
          success: false,
          message: 'Invalid OTP.',
        });
        return;
      }

      // 4. Mark user as email_verified
      await query(
        `UPDATE user_profiles SET email_verified = true WHERE id = $1`,
        [userId]
      );

      // 5. Mark OTP as used (verified)
      await query(
        `UPDATE email_verification_otps SET verified = true WHERE user_id = $1`,
        [userId]
      );

      res.status(200).json({
        success: true,
        message: 'Email verified successfully. You can now log in.',
      });
    } catch (error: unknown) {
      console.error(
        'OTP verification error:',
        error instanceof Error ? error.message : error
      );
      res.status(500).json({
        success: false,
        message: 'Verification failed.',
      });
    }
  }

  // ============================================================
  // 6. RESEND OTP (Optional)
  // ============================================================
  async resendOTP(req: Request, res: Response): Promise<void> {
    try {
      const { userId, email } = req.body;

      if (!userId || !email) {
        res.status(400).json({
          success: false,
          message: 'userId and email are required.',
        });
        return;
      }

      // Generate new OTP
      const otp = generateOTP();
      const otpHash = hashOTP(otp);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // Delete old OTPs
      await query(
        `DELETE FROM email_verification_otps WHERE user_id = $1`,
        [userId]
      );

      // Insert new OTP
      await query(
        `INSERT INTO email_verification_otps (user_id, email, otp_hash, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [userId, email, otpHash, expiresAt]
      );

      // Send email
      await sendVerificationOTP(email, otp);

      res.json({
        success: true,
        message: 'New OTP sent successfully. Please check your email.',
      });
    } catch (error: unknown) {
      console.error('Resend OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to resend OTP.',
      });
    }
  }
}