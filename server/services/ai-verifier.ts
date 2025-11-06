/**
 * AI 审核服务 - 使用 GPT-4 Vision 审核评论截图
 */

import fs from 'node:fs';
import OpenAI from 'openai';

// 根据模型选择对应的 API 配置
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// 判断是否使用 API2D（仅 gpt-4o-mini）
const isAPI2D = MODEL === 'gpt-4o-mini';

const openai = new OpenAI({
  apiKey: isAPI2D 
    ? (process.env.API2D_API_KEY || process.env.OPENAI_API_KEY)
    : (process.env.HAIHUB_API_KEY || process.env.OPENAI_API_KEY),
  baseURL: isAPI2D
    ? 'https://oa.api2d.net'
    : 'https://api.haihub.cn/v1'
});

console.log(`[AI Verifier] Using model: ${MODEL}`);
console.log(`[AI Verifier] Using API: ${isAPI2D ? 'API2D' : 'HaiHub'}`);
console.log(`[AI Verifier] Base URL: ${openai.baseURL}`);

export interface VerificationResult {
  success: boolean;
  valid: boolean;
  message: string;
  extractedName?: string;
  comment?: string;
  confidence?: number;
  commentTime?: string; // 评论时间
}

/**
 * 使用 GPT-4 Vision 审核评论截图
 * @param imageInput 截图文件路径或 Buffer
 * @param expectedName 期望的英文名（可选，用于验证）
 */
export async function verifyScreenshot(
  imageInput: string | Buffer,
  expectedName?: string
): Promise<VerificationResult> {
  try {
    // 读取图片并转换为 base64
    let imageBuffer: Buffer;
    let mimeType: string;

    if (Buffer.isBuffer(imageInput)) {
      imageBuffer = imageInput;
      mimeType = 'image/png'; // 默认 PNG
    } else {
      imageBuffer = fs.readFileSync(imageInput);
      mimeType = getMimeType(imageInput);
    }

    const base64Image = imageBuffer.toString('base64');
    const imageDataUrl = `data:${mimeType};base64,${base64Image}`;
    
    // 调用 AI 模型
    const promptText = expectedName 
      ? `请分析这张评论截图，提取以下信息：
1. 评论者的英文名（通常在头像旁边，如 awilltian、bestomzhang 等）
2. 评论内容（简要）
3. 评论时间（如"昨天 21:58"、"11月1日"、"2天前"等）

要求：
- 只返回 JSON 格式：{"username": "英文名", "comment": "评论内容", "comment_time": "评论时间", "is_comment": true}
- 如果这是一张评论截图（包含用户名和评论内容），请设置 is_comment: true
- 如果不是评论截图，请设置 is_comment: false
- comment_time 请尽量保持原文，如"昨天 21:58"、"11月1日"、"2天前"等
- 宽松匹配：只要截图中的英文名与期望英文名相似即可通过

期望英文名：${expectedName}`
      : `请分析这张截图，判断是否为评论截图：

要求：
- 只返回 JSON 格式：{"username": "英文名", "comment": "评论内容", "comment_time": "评论时间", "is_comment": true/false}
- 如果这是一张评论截图（包含用户名和评论内容），请设置 is_comment: true
- 如果不是评论截图，请设置 is_comment: false
- comment_time 请尽量保持原文，如"昨天 21:58"、"11月1日"、"2天前"等`;

    console.log('Using AI model:', MODEL);
    console.log('API Key:', process.env.OPENAI_API_KEY?.substring(0, 10) + '...');
    console.log('Base URL:', process.env.OPENAI_BASE_URL);
    
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: promptText
            },
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });
    
    const result = response.choices[0].message.content;
    
    if (!result) {
      return {
        success: false,
        valid: false,
        message: 'AI 审核失败，请稍后重试'
      };
    }
    
    console.log('AI 审核结果:', result);
    
    // 解析 AI 返回结果
    try {
      const parsed = JSON.parse(result);
      
      // 宽松验证：只要是评论图就通过
      if (parsed.is_comment === false) {
        return {
          success: false,
          valid: false,
          message: '请上传评论截图'
        };
      }
      
      // 宽松匹配：只要是评论图就通过
      if (expectedName) {
        // 宽松匹配：大小写不敏感，包含即可
        const extractedLower = (parsed.username || '').toLowerCase();
        const expectedLower = expectedName.toLowerCase();
        
        if (extractedLower.includes(expectedLower) || expectedLower.includes(extractedLower)) {
          return {
            success: true,
            valid: true,
            message: '验证通过',
            extractedName: parsed.username,
            comment: parsed.comment,
            commentTime: parsed.comment_time,
            confidence: 0.9
          };
        } else {
          // 即使名字不匹配，只要是评论图也通过
          return {
            success: true,
            valid: true,
            message: '验证通过（评论图已确认）',
            extractedName: parsed.username,
            comment: parsed.comment,
            commentTime: parsed.comment_time,
            confidence: 0.8
          };
        }
      } else {
        // 如果没有提供 expectedName，只返回识别结果
        return {
          success: true,
          valid: true,
          message: '识别成功',
          extractedName: parsed.username,
          comment: parsed.comment,
          commentTime: parsed.comment_time,
          confidence: 0.95
        };
      }
    } catch (e) {
      console.error('JSON解析失败:', e);
      console.error('AI返回内容:', result);
      
      // AI 返回格式错误，尝试更宽松的验证
      if (expectedName && result.includes(expectedName)) {
        return {
          success: true,
          valid: true,
          message: '验证通过',
          extractedName: expectedName,
          confidence: 0.8
        };
      } else {
        // 如果没有expectedName，说明是解析接口，返回更准确的错误
        if (!expectedName) {
          return {
            success: false,
            valid: false,
            message: 'AI识别失败，请确保截图清晰并包含用户名和评论内容'
          };
        }
        return {
          success: false,
          valid: false,
          message: '无法从截图中识别出英文名'
        };
      }
    }
  } catch (error: any) {
    console.error('AI 审核错误:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status
    });
    return {
      success: false,
      valid: false,
      message: `AI 审核失败: ${error.message}`
    };
  }
}

/**
 * 根据文件扩展名获取 MIME 类型
 */
function getMimeType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/png';
  }
}

export const aiVerifier = {
  verifyScreenshot
};
