/**
 * 管理端 API 路由
 */

import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import xlsx from 'xlsx';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import {
  getCodes,
  getStats,
  createBatchCodes,
  addBatchCodes,
  updateCode,
  loadCodes,
  findCodeByUserName,
  createCode,
  addCode,
  getApplications
} from '../services/storage-adapter.js';
import { batchSendToWechat } from '../services/wechat-sender';
import { requireAdmin } from '../middleware/auth';
import { generateLink, generateCode } from '../utils/code-generator';

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
      limit: limit ? parseInt(limit as string) : 1000  // 默认返回1000个
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
        
        // 解析 Excel 数据（只需要英文名）
        users = data.map((row: any) => {
          const userName = row['英文名'] || row['userName'] || row['name'] || row['用户名'] || '';
          return {
            userName,
            userId: userName // userId 与 userName 相同
          };
        }).filter(u => u.userName);
        
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
        throw new Error('Excel 文件解析失败，请确保包含“英文名”列');
      }
    }
    // 如果传入了 JSON 数据
    else if (usersJson) {
      try {
        const parsed = JSON.parse(usersJson);
        // 支持两种格式：
        // 1. 字符串数组：["alice", "bob"]
        // 2. 对象数组：[{userName: "alice"}, {userName: "bob"}]
        if (Array.isArray(parsed)) {
          users = parsed.map(item => {
            if (typeof item === 'string') {
              return { userName: item, userId: item };
            } else if (item.userName) {
              return { userName: item.userName, userId: item.userName };
            }
            return null;
          }).filter(u => u !== null) as Array<{ userName: string; userId: string }>;
        } else {
          throw new Error('数据格式错误');
        }
      } catch (error) {
        throw new Error('用户数据格式错误，请使用 JSON 数组格式');
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
 * POST /api/admin/generate-single
 * 单个生成体验码（只需英文名）
 */
router.post('/generate-single', (req: Request, res: Response) => {
  try {
    const { userName, note } = req.body;
    
    if (!userName) {
      return res.status(400).json({
        success: false,
        message: '请输入英文名'
      });
    }
    
    // 检查是否已存在
    const existing = findCodeByUserName(userName);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `${userName} 已存在体验码`,
        code: existing
      });
    }
    
    // 创建体验码
    const code = createCode({
      userName,
      userId: userName, // userId 与 userName 相同
      source: 'manual',
      note: note || '手动生成'
    });
    
    // 保存到数据库
    addCode(code);
    
    // 生成专属链接
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    
    return res.json({
      success: true,
      code: {
        id: code.id,
        userName: code.userName,
        code: code.code,
        link: generateLink(code.code, baseUrl)
      }
    });
  } catch (error: any) {
    console.error('生成体验码错误:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '服务器错误'
    });
  }
});

/**
 * PUT /api/admin/codes/:id/reset
 * 重置体验码（生成新码，旧码失效）
 */
router.put('/codes/:id/reset', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // 查找旧体验码
    const codes = getCodes({ limit: 10000 });
    const oldCode = codes.codes.find(c => c.id === id);
    
    if (!oldCode) {
      return res.status(404).json({
        success: false,
        message: '体验码不存在'
      });
    }
    
    // 生成新体验码
    const newCode = createCode({
      userName: oldCode.userName,
      userId: oldCode.userId,
      source: oldCode.source,
      note: `重置生成（原码: ${oldCode.code}）`
    });
    
    // 旧码设为失效
    updateCode(id, {
      status: 'expired',
      note: `已重置，新码: ${newCode.code}`
    });
    
    // 添加新码
    addCode(newCode);
    
    return res.json({
      success: true,
      message: '体验码已重置',
      oldCode: oldCode.code,
      newCode: newCode.code
    });
  } catch (error: any) {
    console.error('重置体验码错误:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '服务器错误'
    });
  }
});

/**
 * PUT /api/admin/codes/:id/adjust-uses
 * 调整体验码的最大使用次数
 */
router.put('/codes/:id/adjust-uses', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { maxUses } = req.body;
    
    if (!maxUses || maxUses < 1) {
      return res.status(400).json({
        success: false,
        message: '请输入有效的使用次数（≥1）'
      });
    }
    
    const success = updateCode(id, {
      maxUses: parseInt(maxUses)
    });
    
    if (success) {
      return res.json({
        success: true,
        message: '使用次数已调整'
      });
    } else {
      return res.status(404).json({
        success: false,
        message: '体验码不存在'
      });
    }
  } catch (error: any) {
    console.error('调整使用次数错误:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '服务器错误'
    });
  }
});

/**
 * POST /api/admin/codes/:id/regenerate
 * 重新生成体验码（保留用户信息，生成新的 code）
 */
router.post('/codes/:id/regenerate', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // 查找现有体验码
    const data = loadCodes();
    const existingCode = data.codes.find(c => c.id === id);
    
    if (!existingCode) {
      return res.status(404).json({
        success: false,
        message: '体验码不存在'
      });
    }
    
    // 生成新的 code
    const newCodeValue = generateCode();
    
    // 更新体验码
    const success = updateCode(id, {
      code: newCodeValue,
      status: 'active',
      currentUses: 0,
      usedAt: null,
      createdAt: new Date().toISOString()
    });
    
    if (success) {
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      return res.json({
        success: true,
        message: '体验码已重新生成',
        code: {
          id,
          userName: existingCode.userName,
          code: newCodeValue,
          link: generateLink(newCodeValue, baseUrl)
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        message: '重新生成失败'
      });
    }
  } catch (error: any) {
    console.error('重新生成体验码错误:', error);
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

/**
 * GET /api/admin/screenshots/:filename
 * 查看申请截图
 */
router.get('/screenshots/:filename', requireAdmin, (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const uploadsDir = path.join(__dirname, '../data/uploads');
    const filePath = path.join(uploadsDir, filename);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: '截图不存在'
      });
    }
    
    // 返回图片文件
    return res.sendFile(filePath);
  } catch (error: any) {
    console.error('查看截图错误:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '服务器错误'
    });
  }
});

/**
 * POST /api/admin/generate-code
 * 通过姓名生成体验码
 */
router.post('/generate-code', requireAdmin, (req: Request, res: Response) => {
  try {
    const { userName, note } = req.body;
    
    if (!userName || !userName.trim()) {
      return res.status(400).json({
        success: false,
        message: '请输入用户姓名'
      });
    }
    
    // 生成体验码
    const code = createCode({
      userName: userName.trim(),
      userId: userName.trim(),
      source: 'manual',
      note: note || '管理员手动生成'
    });
    
    addCode(code);
    
    return res.json({
      success: true,
      code: code.code,
      message: '体验码生成成功'
    });
  } catch (error: any) {
    console.error('生成体验码错误:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '服务器错误'
    });
  }
});

export default router;
