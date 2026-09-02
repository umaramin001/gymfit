import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { sendResponse } from '../utils/helpers';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendResponse(res, 401, null, 'Access denied. No token provided.');
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return sendResponse(res, 401, null, 'Invalid or expired token.');
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendResponse(res, 401, null, 'Access denied.');
    }
    if (!roles.includes(req.user.role)) {
      return sendResponse(res, 403, null, 'Insufficient permissions.');
    }
    next();
  };
};
