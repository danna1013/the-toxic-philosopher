/**
 * 企业微信发送服务
 */

import axios from 'axios';
import { generateLink } from '../utils/code-generator';

export interface SendResult {
  success: boolean;
  message: string;
}

/**
 * 发送消息到企业微信群机器人
 * @param webhookUrl 企业微信群机器人 Webhook URL
 * @param userName 用户英文名
 * @param code 体验码
 * @param baseUrl 网站域名
 */
export async function sendToWechat(
  webhookUrl: string,
  userName: string,
  code: string,
  baseUrl: string
): Promise<SendResult> {
  try {
    const link = generateLink(code, baseUrl);
    
    const message = {
      msgtype: 'text',
      text: {
        content: `@${userName} 您好！

感谢您对"毒舌哲学家"的评论支持！🎉

您的专属体验码已生成，点击下方链接即可自动激活完整功能：
👉 ${link}

体验码：${code}
（如链接失效，可手动输入体验码）

祝您体验愉快！`,
        mentioned_list: [userName]
      }
    };
    
    const response = await axios.post(webhookUrl, message, {
      timeout: 10000
    });
    
    const result = response.data;
    
    if (result.errcode === 0) {
      return {
        success: true,
        message: '发送成功'
      };
    } else {
      return {
        success: false,
        message: result.errmsg || '发送失败'
      };
    }
  } catch (error: any) {
    console.error('企业微信发送错误:', error);
    return {
      success: false,
      message: error.message || '网络错误'
    };
  }
}

/**
 * 批量发送到企业微信
 * @param webhookUrl 企业微信群机器人 Webhook URL
 * @param items 发送项目列表
 * @param baseUrl 网站域名
 * @param onProgress 进度回调
 */
export async function batchSendToWechat(
  webhookUrl: string,
  items: Array<{ userName: string; code: string }>,
  baseUrl: string,
  onProgress?: (current: number, total: number, userName: string, success: boolean, message: string) => void
): Promise<{ success: number; failed: number; results: Array<{ userName: string; success: boolean; message: string }> }> {
  const total = items.length;
  let successCount = 0;
  let failedCount = 0;
  const results: Array<{ userName: string; success: boolean; message: string }> = [];
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const current = i + 1;
    
    const result = await sendToWechat(webhookUrl, item.userName, item.code, baseUrl);
    
    if (result.success) {
      successCount++;
    } else {
      failedCount++;
    }
    
    results.push({
      userName: item.userName,
      success: result.success,
      message: result.message
    });
    
    // 调用进度回调
    if (onProgress) {
      onProgress(current, total, item.userName, result.success, result.message);
    }
    
    // 间隔 1 秒，避免频率限制
    if (i < items.length - 1) {
      await sleep(1000);
    }
  }
  
  return {
    success: successCount,
    failed: failedCount,
    results
  };
}

/**
 * 延迟函数
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
