import { Router } from 'express';
import multer from 'multer';
import { aiVerifier } from '../services/ai-verifier';

const router = Router();

// 配置文件上传（内存存储，用于临时解析）
const upload = multer({ storage: multer.memoryStorage() });

/**
 * 解析截图
 * POST /api/access-code/analyze-screenshot
 */
router.post('/analyze-screenshot', upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传截图',
      });
    }

    // 调用 AI 审核服务
    const result = await aiVerifier.verifyScreenshot(req.file.buffer);

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
  } catch (error) {
    console.error('Screenshot analysis error:', error);
    return res.status(500).json({
      success: false,
      message: 'AI 解析失败',
    });
  }
});

export default router;
