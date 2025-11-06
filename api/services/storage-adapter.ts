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

// 懒加载存储模块
let storageModulePromise: Promise<any> | null = null;

function getStorageModule() {
  if (!storageModulePromise) {
    storageModulePromise = (async () => {
      if (isVercel) {
        console.log('[Storage] Loading KV storage modules...');
        // 使用 KV 版本
        const codeManagerKV = await import('./code-manager-kv.js');
        const applicationManagerKV = await import('./application-manager-kv.js');
        
        return {
          ...codeManagerKV,
          ...applicationManagerKV
        };
      } else {
        console.log('[Storage] Loading JSON file storage modules...');
        // 使用 JSON 文件版本
        const codeManagerJSON = await import('./code-manager.js');
        const applicationManagerJSON = await import('./application-manager.js');
        
        return {
          ...codeManagerJSON,
          ...applicationManagerJSON
        };
      }
    })();
  }
  return storageModulePromise;
}

// 导出统一的接口（懒加载版本）
export async function loadCodes() {
  const module = await getStorageModule();
  return module.loadCodes();
}

export async function saveCodes(data: any) {
  const module = await getStorageModule();
  return module.saveCodes(data);
}

export async function createCode(params: any) {
  const module = await getStorageModule();
  return module.createCode(params);
}

export async function createBatchCodes(users: any[], note?: string) {
  const module = await getStorageModule();
  return module.createBatchCodes(users, note);
}

export async function findCodeByCode(code: string) {
  const module = await getStorageModule();
  return module.findCodeByCode(code);
}

export async function findCodeByUserName(userName: string) {
  const module = await getStorageModule();
  return module.findCodeByUserName(userName);
}

export async function findCodeByUserId(userId: string) {
  const module = await getStorageModule();
  return module.findCodeByUserId(userId);
}

export async function verifyCode(code: string, forActivation?: boolean) {
  const module = await getStorageModule();
  return module.verifyCode(code, forActivation);
}

export async function markCodeAsUsed(code: string) {
  const module = await getStorageModule();
  return module.markCodeAsUsed(code);
}

export async function addCode(code: any) {
  const module = await getStorageModule();
  return module.addCode(code);
}

export async function addBatchCodes(codes: any[]) {
  const module = await getStorageModule();
  return module.addBatchCodes(codes);
}

export async function updateCode(id: string, updates: any) {
  const module = await getStorageModule();
  return module.updateCode(id, updates);
}

export async function getCodes(options?: any) {
  const module = await getStorageModule();
  return module.getCodes(options);
}

export async function getStats() {
  const module = await getStorageModule();
  return module.getStats();
}

export async function loadApplications() {
  const module = await getStorageModule();
  return module.loadApplications();
}

export async function saveApplications(data: any) {
  const module = await getStorageModule();
  return module.saveApplications(data);
}

export async function createApplication(params: any) {
  const module = await getStorageModule();
  return module.createApplication(params);
}

export async function addApplication(application: any) {
  const module = await getStorageModule();
  return module.addApplication(application);
}

export async function findApplicationByComment(userName: string, comment: string) {
  const module = await getStorageModule();
  return module.findApplicationByComment(userName, comment);
}

export async function findApplicationByCommentContent(comment: string) {
  const module = await getStorageModule();
  return module.findApplicationByCommentContent(comment);
}

export async function getApplications(options?: any) {
  const module = await getStorageModule();
  return module.getApplications(options);
}

export async function updateApplication(id: string, updates: any) {
  const module = await getStorageModule();
  return module.updateApplication(id, updates);
}

// 类型导出
export type { AccessCode, CodesData } from './code-manager.js';
export type { Application, ApplicationsData } from './application-manager.js';
