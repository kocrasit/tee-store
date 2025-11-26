import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserRole, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

// Protect Middleware - Verify Token
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // Read from cookie first, then auth header
  token = req.cookies.jwt;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      console.time('protect-fetchUser');
      const user = await User.findById(decoded.userId).select('-password');
      console.timeEnd('protect-fetchUser');
      
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

// Admin Middleware
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === UserRole.ADMIN) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

// Role Based Access Middleware
export const checkRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log('CheckRole Middleware:');
    console.log('User Role:', req.user?.role);
    console.log('Required Roles:', roles);

    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403);
      throw new Error(`Not authorized. Required roles: ${roles.join(', ')}`);
    }
  }
}
