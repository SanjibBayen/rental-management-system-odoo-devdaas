import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { generateToken } from '../utils/jwt';

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, password, full_name, phone, role } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          phone,
          role: role 
        }
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ user: data.user });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    const token = generateToken(data.user.id);

    res.json({
      user: data.user,
      token,
      session: data.session
    });
  }

  async getMe(req: Request, res: Response) {
    const user = (req as any).user;
    res.json({ user });
  }

  async logout(req: Request, res: Response) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ message: 'Logged out successfully' });
  }
}