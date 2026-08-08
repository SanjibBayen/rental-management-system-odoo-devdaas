
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { query } from "../config/database.js";

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    organization_id?: string | null;
    role?: string;
  };
};


export class UserController {
  async getProfile(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result: any = await query(
        `
        SELECT id,organization_id,email,full_name,phone,role,email_verified,is_active,created_at,updated_at FROM user_profiles
        WHERE id = $1
        LIMIT 1
        `,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User profile not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Get profile error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch user profile",
      });
    }
  }


  async updateProfile(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { full_name, phone } = req.body;

      if (full_name === undefined && phone === undefined) {
        return res.status(400).json({
          success: false,
          message: "No profile information provided",
        });
      }

      const result: any = await query(
        `
        UPDATE user_profiles
        SET
          full_name = COALESCE($1, full_name),
          phone = COALESCE($2, phone),
          updated_at = NOW()
        WHERE id = $3
        RETURNING
          id,
          organization_id,
          email,
          full_name,
          phone,
          role,
          email_verified,
          is_active,
          created_at,
          updated_at
        `,
        [
          full_name !== undefined ? full_name : null,
          phone !== undefined ? phone : null,
          userId,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User profile not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Update profile error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  }


  async updateEmail(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { email } = req.body;

      if (!email || typeof email !== "string") {
        return res.status(400).json({
          success: false,
          message: "Valid email is required",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = (await query(
        `
        SELECT id
        FROM user_profiles
        WHERE email = $1
          AND id != $2
        LIMIT 1
        `,
        [normalizedEmail, userId]
      )) as { rows?: Array<Record<string, unknown>> };

      if ((existingUser.rows?.length ?? 0) > 0) {
        return res.status(409).json({
          success: false,
          message: "Email address is already in use",
        });
      }

      const result = (await query(
        `
        UPDATE user_profiles
        SET
          email = $1,
          email_verified = FALSE,
          updated_at = NOW()
        WHERE id = $2
        RETURNING
          id,
          organization_id,
          email,
          full_name,
          phone,
          role,
          email_verified,
          is_active,
          created_at,
          updated_at
        `,
        [normalizedEmail, userId]
      )) as { rows?: Array<Record<string, unknown>> };

      if ((result.rows?.length ?? 0) === 0) {
        return res.status(404).json({
          success: false,
          message: "User profile not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Email updated. Please verify your new email address.",
        data: result.rows?.[0],
      });
    } catch (error: any) {
      console.error("Update email error:", error);

      if (error.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "Email address is already in use",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to update email",
      });
    }
  }


  async updatePassword(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "New password must contain at least 8 characters",
        });
      }

      const userResult = (await query(
        `SELECT password_hash
        FROM user_profiles
        WHERE id = $1
        LIMIT 1
        `,
        [userId]
      )) as unknown as { rows: Array<{ password_hash: string }> };

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const passwordMatch = await bcrypt.compare(
        currentPassword,
        userResult.rows[0].password_hash
      );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      await query(
        `
        UPDATE user_profiles
        SET
          password_hash = $1,
          updated_at = NOW()
        WHERE id = $2
        `,
        [newPasswordHash, userId]
      );

      return res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Update password error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update password",
      });
    }
  }

  async updateUserStatus(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const adminUser = req.user;

      if (!adminUser?.id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (adminUser.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }

      const { userId, is_active } = req.body;

      if (!userId || typeof is_active !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "userId and is_active are required",
        });
      }

      const result = (await query(
        `
        UPDATE user_profiles
        SET
          is_active = $1,
          updated_at = NOW()
        WHERE id = $2
        RETURNING
          id,
          organization_id,
          email,
          full_name,
          phone,
          role,
          email_verified,
          is_active,
          created_at,
          updated_at
        `,
        [is_active, userId]
      )) as unknown as { rows: Array<any> };

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: is_active
          ? "User activated successfully"
          : "User deactivated successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Update user status error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update user status",
      });
    }
  }

  /// GET /api/users
  async getUsers(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const adminUser = req.user;

      if (!adminUser?.id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (adminUser.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }

      const organizationId = adminUser.organization_id;

      const result = await query(
        `
        SELECT
          id,
          organization_id,
          email,
          full_name,
          phone,
          role,
          email_verified,
          is_active,
          created_at,
          updated_at
        FROM user_profiles
        WHERE
          (
            organization_id = $1
            OR $1 IS NULL
          )
        ORDER BY created_at DESC
        `,
        [organizationId ?? null]
      ) as unknown as { rows: any[] };

      return res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows,
      });
    } catch (error) {
      console.error("Get users error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  }


  //  * GET /api/users/:id

  async getUserById(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const adminUser = req.user;

      if (!adminUser?.id) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (adminUser.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }

      const { id } = req.params;

      const result = (await query(
        `
        SELECT
          id,
          organization_id,
          email,
          full_name,
          phone,
          role,
          email_verified,
          is_active,
          created_at,
          updated_at
        FROM user_profiles
        WHERE id = $1
        LIMIT 1
        `,
        [id]
      )) as unknown as { rows: Array<Record<string, unknown>> };

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Get user error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch user",
      });
    }
  }

  //  DELETE /api/users/me
  async deactivateAccount(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = (await query(
        `
        UPDATE user_profiles
        SET
          is_active = FALSE,
          updated_at = NOW()
        WHERE id = $1
        RETURNING id, email, is_active
        `,
        [userId]
      )) as unknown as { rows: Array<Record<string, unknown>> };

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Account deactivated successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Deactivate account error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to deactivate account",
      });
    }
  }
}

export default new UserController();
