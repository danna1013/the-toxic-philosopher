/**
 * 管理端 API 路由
 */

import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';
import {
  getCodes,
  getStats,
  createBatchCodes,
  addBatchCodes,
  updateCode,
  loadCodes
} from '../services/code-manager';
import { getApplications, getRecentApplications } from '../services/application-manager';
import { batchSendToWechat } from '../services/wechat-sender';
import { requireAdmin } from '../middleware/auth';
import { generateLink } from '../utils/code-generator';

const router = express.Router();

/**
 * POST /api/admin/login
 * 管理员登录
 */
router.post('/login', (req: Request, res: Response) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';
  
  console.log('Login attempt:');
  console.log('Received password:', password);
  console.log('Expected password:', ADMIN_PASSWORD);
  console.log('Match:', password === ADMIN_PASSWORD);
  
  if (password === ADMIN_PASSWORD) {
    res.json({
      success: true,
      token: password,
      message: '登录成功'
    });
  } else {
    res.status(401).json({
      success: false,
      message: '密码错误'
    });
  }
});

// 所有其他管理端 API 都需要管理员权限
router.use(requireAdmin);

// 配置文件上传（用于上传用户名单 Excel）
const upload = multer({
  dest: '/tmp/',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls')) {
      cb(null, true);
    } else {
      cb(new Error('只支持 Excel 文件（.xlsx 或 .xls）'));
    }
  }
});

/**
 * GET /api/admin/stats
 * 获取统计数据
 */
router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = getStats();
    const recentApplications = getRecentApplications(10);
    
    return res.json({
      stats,
      recentApplications
    });
  } catch (error: any) {
    console.error('获取统计数据错误:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/codes
 * 获取所有体验码（支持筛选和分页）
 */
router.get('/codes', (req: Request, res: Response) => {
  try {
    const { status, source, page, limit } = req.query;
    
    const result = getCodes({
      status: status as any,
      source: source as any,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    });
    
    return res.json(result);
  } catch (error: any) {
    console.error('获取体验码列表错误:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * GET /api/admin/applications
 * 获取所有申请记录
 */
router.get('/applications', (req: Request, res: Response) => {
  try {
    const { status, page, limit } = req.query;
    
    const result = getApplications({
      status: status as any,
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    });
    
    return res.json(result);
  } catch (error: any) {
    console.error('获取申请记录错误:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * POST /api/admin/generate-batch
 * 批量生成体验码
 */
router.post('/generate-batch', upload.single('file'), (req: Request, res: Response) => {
  try {
    const { users: usersJson, note } = req.body;
    const file = req.file;
    
    let users: Array<{ userName: string; userId: string }> = [];
    
    // 如果上传了 Excel 文件
    if (file) {
      try {
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        
        // 解析 Excel 数据
        users = data.map((row: any) => ({
          userName: row['英文名'] || row['userName'] || row['name'] || '',
          userId: row['企业微信ID'] || row['wechatId'] || row['userId'] || row['英文名'] || row['userName'] || row['name'] || ''
        })).filter(u => u.userName && u.userId);
        
        // 删除临时文件
        fs.unlinkSync(file.path);
      } catch (error) {
        // 删除临时文件
        if (file) {
          try {
            fs.unlinkSync(file.path);
          } catch (e) {
            // 忽略
          }
        }
        throw new Error('Excel 文件解析失败，请确保包含"英文名"和"企业微信ID"列');
      }
    }
    // 如果传入了 JSON 数据
    else if (usersJson) {
      try {
        users = JSON.parse(usersJson);
      } catch (error) {
        throw new Error('用户数据格式错误');
      }
    } else {
      return res.status(400).json({
        success: false,
        message: '请上传 Excel 文件或提供用户数据'
      });
    }
    
    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: '未找到有效的用户数据'
      });
    }
    
    // 批量生成体验码
    const codes = createBatchCodes(users, note);
    
    // 保存到数据库
    addBatchCodes(codes);
    
    // 生成专属链接
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const result = codes.map(code => ({
      id: code.id,
      userName: code.userName,
      userId: code.userId,
      code: code.code,
      link: generateLink(code.code, baseUrl)
    }));
    
    return res.json({
      success: true,
      count: codes.length,
      codes: result
    });
  } catch (error: any) {
    console.error('批量生成体验码错误:', error);
    
    // 删除临时文件
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // 忽略
      }
    }
    
    return res.status(500).json({
      success: false,
      message: error.message || '服务器错误'
    });
  }
});

/**
 * POST /api/admin/batch-send
 * 批量发送到企业微信（SSE 实时进度）
 */
router.post('/batch-send', async (req: Request, res: Response) => {
  try {
    const { codeIds, webhookUrl } = req.body;
    
    if (!codeIds || !Array.isArray(codeIds) || codeIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请选择要发送的体验码'
      });
    }
    
    if (!webhookUrl) {
      return res.status(400).json({
        success: false,
        message: '请提供企业微信 Webhook URL'
      });
    }
    
    // 获取要发送的体验码
    const data = loadCodes();
    const codesToSend = data.codes.filter(c => codeIds.includes(c.id));
    
    if (codesToSend.length === 0) {
      return res.status(400).json({
        success: false,
        message: '未找到要发送的体验码'
      });
    }
    
    // 设置 SSE 响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    
    // 批量发送
    const items = codesToSend.map(c => ({
      userName: c.userName,
      code: c.code
    }));
    
    await batchSendToWechat(
      webhookUrl,
      items,
      baseUrl,
      (current, total, userName, success, message) => {
        // 发送进度事件
        res.write(`data: ${JSON.stringify({
          type: 'progress',
          current,
          total,
          userName,
          status: success ? 'success' : 'failed',
          message
        })}\n\n`);
        
        // 更新体验码的发送状态
        const code = codesToSend.find(c => c.userName === userName);
        if (code) {
          updateCode(code.id, {
            sentAt: new Date().toISOString(),
            sentStatus: success ? 'success' : 'failed',
            sentError: success ? undefined : message
          });
        }
      }
    );
    
    // 发送完成事件
    res.write(`data: ${JSON.stringify({
      type: 'complete',
      success: codesToSend.filter(c => c.sentStatus === 'success').length,
      failed: codesToSend.filter(c => c.sentStatus === 'failed').length
    })}\n\n`);
    
    res.end();
  } catch (error: any) {
    console.error('批量发送错误:', error);
    
    // 如果还没有发送响应头，返回错误
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: error.message || '服务器错误'
      });
    } else {
      // 如果已经发送了响应头，发送错误事件
      res.write(`data: ${JSON.stringify({
        type: 'error',
        message: error.message || '服务器错误'
      })}\n\n`);
      res.end();
    }
  }
});

/**
 * PUT /api/admin/codes/:id
 * 更新体验码
 */
router.put('/codes/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const success = updateCode(id, updates);
    
    if (success) {
      return res.json({
        success: true,
        message: '更新成功'
      });
    } else {
      return res.status(404).json({
        success: false,
        message: '体验码不存在'
      });
    }
  } catch (error: any) {
    console.error('更新体验码错误:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '服务器错误'
    });
  }
});

/**
 * GET /api/admin/export
 * 导出数据为 Excel
 */
router.get('/export', (req: Request, res: Response) => {
  try {
    const { format = 'xlsx', status } = req.query;
    
    const result = getCodes({
      status: status as any,
      page: 1,
      limit: 10000 // 导出所有数据
    });
    
    // 转换为 Excel 格式
    const data = result.codes.map(code => ({
      '英文名': code.userName,
      '企业微信ID': code.userId,
      '体验码': code.code,
      '状态': code.status === 'active' ? '激活中' : code.status === 'used' ? '已使用' : '已过期',
      '来源': code.source === 'batch' ? '批量发放' : code.source === 'self_apply' ? '自助申请' : '手动创建',
      '创建时间': code.createdAt,
      '使用时间': code.usedAt || '-',
      '发送状态': code.sentStatus === 'success' ? '已发送' : code.sentStatus === 'failed' ? '发送失败' : '未发送',
      '备注': code.note || '-'
    }));
    
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, '体验码列表');
    
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    const filename = `codes_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    return res.send(buffer);
  } catch (error: any) {
    console.error('导出数据错误:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '服务器错误'
    });
  }
});

export default router;
