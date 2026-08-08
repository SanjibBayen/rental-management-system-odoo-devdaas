// import { Request, Response, NextFunction } from 'express';
// // import { AuthRequest } from './auth.middleware';

// export const rbacMiddleware = (allowedRoles: ('admin' | 'customer' | 'delivery')[]) => {
//   return (req: AuthRequest, res: Response, next: NextFunction) => {
//     const user = req.user;

//     if (!user) {
//       return res.status(401).json({ error: 'User not authenticated' });
//     }

//     const userRole = user.user_metadata?.role || 'customer';

//     if (!allowedRoles.includes(userRole)) {
//       return res.status(403).json({ 
//         error: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
//       });
//     }

//     next();
//   };
// };