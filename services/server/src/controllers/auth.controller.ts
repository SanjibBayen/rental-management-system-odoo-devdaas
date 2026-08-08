import { Request, Response } from "express";
import crypto from "crypto";

import { supabase } from "../config/database.js";
import * as emailService from "../services/email.service.js";

const sendVerificationOTP: any =
  (emailService as any).sendVerificationOTP ??
  (emailService as any).default?.sendVerificationOTP ??
  (emailService as any).default;


const generateOTP = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};


const hashOTP = (otp: string): string => {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
};

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const {
        email,
        password,
        full_name,
        phone,
        role,
      } = req.body;
      if (!email || !password || !full_name) {
        res.status(400).json({
          success: false,
          message: "Email, password and full name are required.",
        });
        return;
      }
      if (password.length < 6) {
        res.status(400).json({
          success: false,
          message: "Password must contain at least 6 characters.",
        });
        return;
      }

      // ----------------------------------------
      // Create Supabase Auth user
      // ----------------------------------------

      const { data, error } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name,
              phone: phone || null,
              role: role || "customer",
            },
          },
        });

      if (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (!data.user) {
        res.status(400).json({
          success: false,
          message: "Unable to create user.",
        });
        return;
      }

      // ----------------------------------------
      // Generate OTP
      // ----------------------------------------

      const otp = generateOTP();
      const otpHash = hashOTP(otp);

      const expiresAt = new Date(
        Date.now() + 10 * 60 * 1000
      ).toISOString();

      // ----------------------------------------
      // Remove previous OTP
      // ----------------------------------------

      const { error: deleteError } = await supabase
        .from("email_verification_otps")
        .delete()
        .eq("user_id", data.user.id);

      if (deleteError) {
        console.error(
          "Delete old OTP error:",
          deleteError.message
        );
      }


      const { error: otpError } = await supabase
        .from("email_verification_otps")
        .insert({
          user_id: data.user.id,
          email: email.toLowerCase().trim(),
          otp_hash: otpHash,
          expires_at: expiresAt,
          verified: false,
        });

      if (otpError) {
        console.error(
          "OTP storage error:",
          otpError.message
        );

        res.status(500).json({
          success: false,
          message:
            "Account created but verification code could not be generated.",
        });
        return;
      }

      // ----------------------------------------
      // Send verification email
      // ----------------------------------------

      try {
        await sendVerificationOTP(
          email,
          otp,
          full_name
        );
      } catch (emailError: unknown) {
        console.error(
          "Email sending error:",
          emailError instanceof Error
            ? emailError.message
            : emailError
        );

        res.status(500).json({
          success: false,
          message:
            "Account created, but verification email could not be sent.",
        });
        return;
      }

      res.status(201).json({
        success: true,
        message:
          "Registration successful. A 6-digit verification code has been sent to your email.",
        userId: data.user.id,
        email: data.user.email,
        requiresEmailVerification: true,
      });

    } catch (error: unknown) {
      console.error(
        "Registration error:",
        error instanceof Error
          ? error.message
          : error
      );

      res.status(500).json({
        success: false,
        message: "Registration failed.",
      });
    }
  }

  //login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const {
        email,
        password,
      } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: "Email and password are required.",
        });
        return;
      }

      // ----------------------------------------
      // Supabase login
      // ----------------------------------------

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password,
        });

      if (error) {
        res.status(401).json({
          success: false,
          message: error.message,
        });
        return;
      }

      if (!data.user || !data.session) {
        res.status(401).json({
          success: false,
          message: "Login failed.",
        });
        return;
      }

      // ----------------------------------------
      // Check email verification
      // ----------------------------------------

      if (!data.user.email_confirmed_at) {
        res.status(403).json({
          success: false,
          message:
            "Please verify your email before logging in.",
          requiresEmailVerification: true,
          userId: data.user.id,
        });
        return;
      }

      // ----------------------------------------
      // Return Supabase JWT
      // ----------------------------------------

      res.status(200).json({
        success: true,
        message: "Login successful.",
        user: data.user,
        token: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in,
        session: data.session,
      });

    } catch (error: unknown) {
      console.error(
        "Login error:",
        error instanceof Error
          ? error.message
          : error
      );

      res.status(500).json({
        success: false,
        message: "Login failed.",
      });
    }
  }



  //GET CURRENT USER

  async getMe(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const user = req.user_id;

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        user,
      });

    } catch (error: unknown) {
      console.error(
        "Get me error:",
        error instanceof Error
          ? error.message
          : error
      );

      res.status(500).json({
        success: false,
        message: "Unable to retrieve user.",
      });
    }
  }


  //logout
  async logout(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { error } =
        await supabase.auth.signOut();

      if (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Logged out successfully.",
      });

    } catch (error: unknown) {
      console.error(
        "Logout error:",
        error instanceof Error
          ? error.message
          : error
      );

      res.status(500).json({
        success: false,
        message: "Logout failed.",
      });
    }
  }
}
