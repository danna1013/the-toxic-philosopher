/**
 * 用户端 API 路由
 */

import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import {
  verifyCode,
  markCodeAsUsed,
  findCodeByUserName,
  findCodeByUserId,
  createCode,
  addCode
} from '../services/code-manager';
import { verifyScreenshot } from '../services/ai-verifier';
import { createApplication, addApplication } from '../services/application-manager';
import { rateLimit } from '../middleware/rate-limit';
import { decodeToken } from '../utils/code-generator';

const router = express.Router();

// 配置文件上传
const UPLOAD_DIR = path.join(__dirname, '../data/uploads');

// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `screenshot_${uniqueSuffix}${ext}`);
  }
});

// 用于临时解析的内存存储
const memoryUpload = multer({ storage: multer.memoryStorage() });

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('只支持 JPG、PNG、GIF、WEBP 格式的图片'));
    }
  }
});

/**
 * POST /api/apply-code
 * 申请体验码（带 AI 审核）
 */
router.post('/apply-code', rateLimit(3, 60 * 60 * 1000), upload.single('screenshot'), async (req: Request, res: Response) => {
  try {
    const { userName, extractedName, comment } = req.body;
    const screenshot = req.file;
    
    // 验证必填字段
    if (!userName || !extractedName || !comment || !screenshot) {
      return res.status(400).json({
        success: false,
        message: '请填写完整信息并上传评论截图'
      });
    }
    
    // 检查英文名是否已申请
    const existingByName = findCodeByUserName(userName);
    if (existingByName) {
      return res.status(409).json({
        success: false,
        message: `${userName} 已申请过体验码`
      });
    }
    
    // 检查评论字数
    if (comment.length < 10) {
      return res.status(400).json({
        success: false,
        message: '评论内容不足10字，请重新上传'
      });
    }
    
    // 检查用户名是否匹配
    const userNameLower = userName.toLowerCase();
    const extractedLower = extractedName.toLowerCase();
    
    if (!userNameLower.includes(extractedLower) && !extractedLower.includes(userNameLower)) {
      return res.status(400).json({
        success: false,
        message: `输入的用户名（${userName}）与截图中识别到的用户名（${extractedName}）不匹配`
      });
    }
    
    // 验证通过，直接生成体验码（不再调用 AI 审核）
    console.log('用户申请体验码:', userName);
    
    // 生成体验码
    const code = createCode({
      userName: userName,
      userId: userName, // 使用 userName 作为 userId
      source: 'self_apply',
      note: '自助申请'
    });
    
    // 保存体验码
    addCode(code);
    
    // 记录成功的申请
    const application = createApplication({
      userName: userName,
      wechatId: userName,
      screenshot: screenshot.filename,
      status: 'approved',
      code: code.code,
      aiVerification: {
        extractedName: extractedName,
        comment: comment,
        confidence: 1.0
      }
    });
    addApplication(application);
    
    console.log('体验码生成成功:', code.code);
    
    return res.json({
      success: true,
      code: code.code,
      message: '申请成功！体验码已生成'
    });
  } catch (error: any) {
    console.error('申请体验码错误:', error);
    
    // 删除已上传的文件
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // 忽略删除错误
      }
    }
    
    return res.status(500).json({
      success: false,
      message: error.message || '服务器错误，请稍后重试'
    });
  }
});

/**
 * POST /api/verify-code
 * 验证体验码
 */
router.post('/verify-code', (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        valid: false,
        message: '请输入体验码'
      });
    }
    
    const result = verifyCode(code);
    
    if (result.valid && result.data) {
      // 标记为已使用
      markCodeAsUsed(code);
      
      return res.json({
        valid: true,
        message: result.message,
        data: {
          userName: result.data.userName,
          userId: result.data.userId,
          expiresAt: result.data.expiresAt
        }
      });
    } else {
      return res.json({
        valid: false,
        message: result.message
      });
    }
  } catch (error: any) {
    console.error('验证体验码错误:', error);
    return res.status(500).json({
      valid: false,
      message: '服务器错误，请稍后重试'
    });
  }
});

/**
 * GET /api/check-access
 * 检查访问权限
 */
router.get('/check-access', (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    
    if (!auth) {
      return res.json({
        hasAccess: false
      });
    }
    
    const code = auth.replace('Bearer ', '');
    const result = verifyCode(code);
    
    if (result.valid && result.data) {
      return res.json({
        hasAccess: true,
        code: result.data.code,
        userName: result.data.userName
      });
    } else {
      return res.json({
        hasAccess: false
      });
    }
  } catch (error) {
    console.error('检查访问权限错误:', error);
    return res.json({
      hasAccess: false
    });
  }
});

/**
 * POST /api/verify-token
 * 验证专属链接 token
 */
router.post('/verify-token', (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        valid: false,
        message: '无效的链接'
      });
    }
    
    // 解码 token
    const decoded = decodeToken(token);
    
    if (!decoded || !decoded.code) {
      return res.json({
        valid: false,
        message: '无效的链接'
      });
    }
    
    // 验证体验码
    const result = verifyCode(decoded.code);
    
    if (result.valid && result.data) {
      // 标记为已使用
      markCodeAsUsed(decoded.code);
      
      return res.json({
        valid: true,
        code: decoded.code,
        message: '体验码已激活',
        data: {
          userName: result.data.userName,
          userId: result.data.userId
        }
      });
    } else {
      return res.json({
        valid: false,
        message: result.message
      });
    }
  } catch (error: any) {
    console.error('验证 token 错误:', error);
    return res.status(500).json({
      valid: false,
      message: '服务器错误，请稍后重试'
    });
  }
});

/**
 * POST /api/analyze-screenshot
 * 解析截图（不保存，只用于预览）
 */
router.post('/analyze-screenshot', memoryUpload.single('screenshot'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传截图',
      });
    }

    // 调用 AI 审核服务（不验证姓名）
    const result = await verifyScreenshot(req.file.buffer);

    if (result.success) {
      return res.json({
        success: true,
        extractedName: result.extractedName,
        comment: result.comment,
        confidence: result.confidence,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error: any) {
    console.error('Screenshot analysis error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    return res.status(500).json({
      success: false,
      message: `AI 解析失败: ${error.message}`,
    });
  }
});

export default router;
