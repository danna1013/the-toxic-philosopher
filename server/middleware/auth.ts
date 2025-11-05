/**
 * 管理员认证中间件
 */

import { Request, Response, NextFunction } from 'express';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';

/**
 * 管理员认证中间件
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized', message: '需要管理员权限' });
  }
  
  const token = auth.replace('Bearer ', '');
  
  if (token === ADMIN_PASSWORD) {
    next();
  } else {
    return res.status(401).json({ error: 'Unauthorized', message: '管理员密码错误' });
  }
}
