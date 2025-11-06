/**
 * 存储适配器 - 自动检测环境并使用对应的存储方式
 * - 本地开发：使用 JSON 文件
 * - Vercel 部署：使用 Vercel KV
 */

// 检测是否在 Vercel 环境
const isVercel = process.env.VERCEL === '1' || process.env.KV_REST_API_URL !== undefined;

console.log(`[Storage] Environment: ${isVercel ? 'Vercel (KV)' : 'Local (JSON)'}`);
console.log(`[Storage] VERCEL env: ${process.env.VERCEL}`);
console.log(`[Storage] KV_REST_API_URL: ${process.env.KV_REST_API_URL ? 'set' : 'not set'}`);

// 根据环境选择存储实现
let storageModule: any;

if (isVercel) {
  console.log('[Storage] Loading KV storage modules...');
  // 使用 KV 版本
  const codeManagerKV = await import('./code-manager-kv.js');
  const applicationManagerKV = await import('./application-manager-kv.js');
  
  storageModule = {
    ...codeManagerKV,
    ...applicationManagerKV
  };
} else {
  console.log('[Storage] Loading JSON file storage modules...');
  // 使用 JSON 文件版本
  const codeManagerJSON = await import('./code-manager.js');
  const applicationManagerJSON = await import('./application-manager.js');
  
  storageModule = {
    ...codeManagerJSON,
    ...applicationManagerJSON
  };
}

console.log('[Storage] Storage modules loaded successfully');

// 导出统一的接口
export const {
  loadCodes,
  saveCodes,
  createCode,
  createBatchCodes,
  findCodeByCode,
  findCodeByUserName,
  findCodeByUserId,
  verifyCode,
  markCodeAsUsed,
  addCode,
  addBatchCodes,
  updateCode,
  getCodes,
  getStats,
  loadApplications,
  saveApplications,
  createApplication,
  addApplication,
  findApplicationByComment,
  findApplicationByCommentContent,
  getApplications,
  updateApplication
} = storageModule;

// 类型导出
export type { AccessCode, CodesData } from './code-manager.js';
export type { Application, ApplicationsData } from './application-manager.js';
