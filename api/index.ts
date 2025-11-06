/**
 * Vercel Serverless Function Entry Point
 * 
 * 这个文件是 Vercel 部署的入口点
 * 将 Express 应用转换为 Serverless 函数
 */

import express, { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import accessCodeRoutes from './routes/access-code.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use("/api", accessCodeRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Export for Vercel
// Vercel 需要一个默认导出的函数
export default app;
