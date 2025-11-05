/**
 * 频率限制中间件
 */

import { Request, Response, NextFunction } from 'express';

// 存储 IP 和请求时间的 Map
const requestMap = new Map<string, number[]>();

// 清理过期记录的间隔（每小时）
setInterval(() => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  for (const [ip, timestamps] of requestMap.entries()) {
    const validTimestamps = timestamps.filter(t => now - t < oneHour);
    if (validTimestamps.length === 0) {
      requestMap.delete(ip);
    } else {
      requestMap.set(ip, validTimestamps);
    }
  }
}, 60 * 60 * 1000);

/**
 * 频率限制中间件
 * @param maxRequests 最大请求次数
 * @param windowMs 时间窗口（毫秒）
 */
export function rateLimit(maxRequests: number = 3, windowMs: number = 60 * 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    
    // 获取该 IP 的请求记录
    let timestamps = requestMap.get(ip) || [];
    
    // 过滤掉时间窗口之外的请求
    timestamps = timestamps.filter(t => now - t < windowMs);
    
    // 检查是否超过限制
    if (timestamps.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `每小时最多申请 ${maxRequests} 次，请稍后再试`
      });
    }
    
    // 记录本次请求
    timestamps.push(now);
    requestMap.set(ip, timestamps);
    
    next();
  };
}
