/**
 * 环境诊断 API
 * 用于检查 Vercel 环境变量和 KV 配置
 */

import { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      VERCEL: process.env.VERCEL || 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set',
      VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
    },
    kv: {
      KV_REST_API_URL: process.env.KV_REST_API_URL ? 'SET' : 'NOT SET',
      KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'SET' : 'NOT SET',
      KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN ? 'SET' : 'NOT SET',
      REDIS_URL: process.env.REDIS_URL ? 'SET' : 'NOT SET',
    },
    api: {
      API2D_API_KEY: process.env.API2D_API_KEY ? 'SET (length: ' + process.env.API2D_API_KEY.length + ')' : 'NOT SET',
      HAIHUB_API_KEY: process.env.HAIHUB_API_KEY ? 'SET (length: ' + process.env.HAIHUB_API_KEY.length + ')' : 'NOT SET',
      OPENAI_MODEL: process.env.OPENAI_MODEL || 'not set',
    },
    admin: {
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET',
    },
    storage: {
      isVercel: process.env.VERCEL === '1' || process.env.KV_REST_API_URL !== undefined,
      willUseKV: process.env.KV_REST_API_URL !== undefined,
      willUseJSON: process.env.KV_REST_API_URL === undefined,
    }
  };

  res.json(diagnostics);
}
