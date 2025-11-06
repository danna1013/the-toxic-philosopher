/**
 * 体验码生成工具
 */

const CODE_PREFIX = 'PHIL2024';
const CODE_LENGTH = 6;

/**
 * 生成随机体验码
 * 格式：PHIL2024-XXXXXX（6位大写字母+数字）
 */
export function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  
  for (let i = 0; i < CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomPart += chars[randomIndex];
  }
  
  return `${CODE_PREFIX}-${randomPart}`;
}

/**
 * 生成专属链接
 * @param code 体验码
 * @param baseUrl 网站域名
 */
export function generateLink(code: string, baseUrl: string): string {
  const tokenData = { code };
  const token = Buffer.from(JSON.stringify(tokenData)).toString('base64url');
  return `${baseUrl}/?token=${token}`;
}

/**
 * 解码 token
 * @param token Base64 编码的 token
 */
export function decodeToken(token: string): { code: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
