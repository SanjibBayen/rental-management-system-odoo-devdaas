import { Request, Response, NextFunction } from 'express';

export const supabaseAuth = (_req: Request, _res: Response, next: NextFunction) => {
  
  next();
};

export default supabaseAuth;
