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
  findCodeByCode,
  createCode,
  addCode,
  createApplication,
  addApplication,
  findApplicationByComment,
  findApplicationByCommentContent
} from '../services/storage-adapter.js';
import { verifyScreenshot } from '../services/ai-verifier.js';
import { rateLimit } from '../middleware/rate-limit';
import { decodeToken } from '../utils/code-generator';
import { parseCommentTime, isCommentTimeValid, formatTimeDiff } from '../utils/time-parser';

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
    const { userName, extractedName, comment, commentTime } = req.body;
    const screenshot = req.file;
    
    // 验证必填字段
    if (!userName || !extractedName || !comment || !screenshot) {
      return res.status(400).json({
        success: false,
        message: '请填写完整信息并上传评论截图'
      });
    }
    
    // 验证评论时间（如果提供了时间）
    if (commentTime) {
      const parsedTime = parseCommentTime(commentTime);
      if (parsedTime) {
        const isValid = isCommentTimeValid(parsedTime, 2); // 2天内
        if (!isValid) {
          const timeDiff = formatTimeDiff(parsedTime);
          console.log(`${userName} 的评论时间过旧: ${commentTime} (${timeDiff})`);
          
          const failedApplication = createApplication({
            userName: userName,
            wechatId: userName,
            screenshot: screenshot.filename,
            status: 'rejected',
            rejectReason: `评论时间过旧（${timeDiff}），请使用2天内的评论`,
            aiVerification: {
              extractedName: extractedName,
              comment: comment,
              confidence: 1.0
            }
          });
          addApplication(failedApplication);
          
          return res.status(400).json({
            success: false,
            message: `评论时间过旧（${timeDiff}），请使用2天内的评论`
          });
        }
      }
    }
    
    // 检查是否有其他用户使用过相同评论（防止拿别人评论截图）
    const existingCommentApp = findApplicationByCommentContent(comment);
    if (existingCommentApp && existingCommentApp.userName !== userName) {
      console.log(`${userName} 尝试使用其他用户（${existingCommentApp.userName}）的评论`);
      
      const failedApplication = createApplication({
        userName: userName,
        wechatId: userName,
        screenshot: screenshot.filename,
        status: 'rejected',
        rejectReason: '该评论已被其他用户使用，请使用自己的评论',
        aiVerification: {
          extractedName: extractedName,
          comment: comment,
          confidence: 1.0
        }
      });
      addApplication(failedApplication);
      
      return res.status(409).json({
        success: false,
        message: '该评论已被其他用户使用，请使用自己的评论'
      });
    }
    
    // 检查是否重复使用同一条评论（相同用户名 + 相同评论内容）
    const existingApplication = findApplicationByComment(userName, comment);
    if (existingApplication && existingApplication.code) {
      // 通过申请记录中的体验码查找状态
      const codeValue = existingApplication.code;
      const existingCode = findCodeByCode(codeValue);
      
      if (existingCode) {
        // 如果体验码已使用，拒绝申请
        if (existingCode.status === 'used') {
          console.log(`${userName} 尝试重复使用同一条评论，但体验码已使用`);
          
          const failedApplication = createApplication({
            userName: userName,
            wechatId: userName,
            screenshot: screenshot.filename,
            status: 'rejected',
            rejectReason: '该评论已用于申请体验码，请使用新评论',
            aiVerification: {
              extractedName: extractedName,
              comment: comment,
              confidence: 1.0
            }
          });
          addApplication(failedApplication);
          
          return res.status(409).json({
            success: false,
            message: '该评论已用于申请体验码，请使用新评论'
          });
        }
        
        // 如果体验码未使用，返回现有体验码
        if (existingCode.status === 'active') {
          console.log(`${userName} 重复使用同一条评论，返回现有体验码:`, existingCode.code);
          
          const application = createApplication({
            userName: userName,
            wechatId: userName,
            screenshot: screenshot.filename,
            status: 'approved',
            code: existingCode.code,
            aiVerification: {
              extractedName: extractedName,
              comment: comment,
              confidence: 1.0
            }
          });
          addApplication(application);
          
          return res.json({
            success: true,
            code: existingCode.code,
            message: '体验码已生成，只能用一次，已自动保存。换设备或有问题请联系elisedai'
          });
        }
      }
    }
    
    // 检查评论字数
    if (comment.length < 10) {
      // 记录失败的申请
      const failedApplication = createApplication({
        userName: userName,
        wechatId: userName,
        screenshot: screenshot.filename,
        status: 'rejected',
        rejectReason: '评论内容不足10字',
        aiVerification: {
          extractedName: extractedName,
          comment: comment,
          confidence: 1.0
        }
      });
      addApplication(failedApplication);
      
      return res.status(400).json({
        success: false,
        message: '评论内容不足10字，请重新上传'
      });
    }
    
    // 检查用户名是否匹配
    const userNameLower = userName.toLowerCase();
    const extractedLower = extractedName.toLowerCase();
    
    if (!userNameLower.includes(extractedLower) && !extractedLower.includes(userNameLower)) {
      // 记录失败的申请
      const failedApplication = createApplication({
        userName: userName,
        wechatId: userName,
        screenshot: screenshot.filename,
        status: 'rejected',
        rejectReason: `用户名不匹配：输入${userName}，识别${extractedName}`,
        aiVerification: {
          extractedName: extractedName,
          comment: comment,
          confidence: 1.0
        }
      });
      addApplication(failedApplication);
      
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
      message: '体验码已生成，只能用一次，已自动保存。换设备或有问题请联系elisedai'
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
      
      // 记录激活行为到申请列表
      const activationRecord = createApplication({
        userName: result.data.userName || 'unknown',
        wechatId: result.data.userId || 'unknown',
        screenshot: '', // 激活时没有截图
        status: 'activated', // 新状态：已激活
        code: code
        // 激活记录不需要 aiVerification 字段
      });
      addApplication(activationRecord);
      console.log('激活记录已保存:', activationRecord.id, '用户:', result.data.userName, '体验码:', code);
      
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
    const result = verifyCode(code, false); // 权限检查，允许已使用的体验码
    
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
 * 解析截图（保存截图并记录解析结果）
 */
router.post('/analyze-screenshot', upload.single('screenshot'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传截图',
      });
    }

    console.log('\n========== AI 解析开始 ==========');
    console.log('图片大小:', req.file.size, 'bytes');
    console.log('图片类型:', req.file.mimetype);
    console.log('保存路径:', req.file.filename);
    
    // 调用 AI 审核服务（不验证姓名）
    const imageBuffer = fs.readFileSync(req.file.path);
    const result = await verifyScreenshot(imageBuffer);
    
    console.log('AI 解析结果:', JSON.stringify(result, null, 2));
    console.log('========== AI 解析结束 ==========\n');

    // 记录解析尝试（无论成功还是失败）
    const parseApplication = createApplication({
      userName: result.extractedName || 'unknown',
      wechatId: result.extractedName || 'unknown',
      screenshot: req.file.filename,
      status: result.success ? 'pending' : 'rejected',
      rejectReason: result.success ? undefined : result.message,
      aiVerification: {
        extractedName: result.extractedName || '',
        comment: result.comment || '',
        confidence: result.confidence || 0
      }
    });
    addApplication(parseApplication);
    console.log('解析记录已保存:', parseApplication.id);

    if (result.success) {
      return res.json({
        success: true,
        extractedName: result.extractedName,
        comment: result.comment,
        commentTime: result.commentTime,
        confidence: result.confidence,
      });
    } else {
      console.error('AI 解析失败:', result.message);
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
    
    // 即使出错也记录
    if (req.file) {
      const errorApplication = createApplication({
        userName: 'error',
        wechatId: 'error',
        screenshot: req.file.filename,
        status: 'rejected',
        rejectReason: `系统错误: ${error.message}`
      });
      addApplication(errorApplication);
    }
    
    return res.status(500).json({
      success: false,
      message: `AI 解析失败: ${error.message}`,
    });
  }
});

export default router;
