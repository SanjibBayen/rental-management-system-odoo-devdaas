import { Request, Response } from 'express';
import { supabase } from '../config/database';

export class UserController {
  async getProfile(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({ data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const data = req.body;

      const { data: updated, error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({ data: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateAvatar(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { avatar_url } = req.body;

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ avatar_url })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({ data });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}