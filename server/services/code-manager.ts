/**
 * 体验码管理服务
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { generateCode, generateLink, generateId } from '../utils/code-generator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const CODES_FILE = path.join(DATA_DIR, 'codes.json');

export interface AccessCode {
  id: string;
  code: string;
  status: 'active' | 'used' | 'expired';
  userId: string;
  userName: string;
  createdAt: string;
  usedAt: string | null;
  expiresAt: string | null;
  maxUses: number;
  currentUses: number;
  source: 'batch' | 'self_apply' | 'manual';
  note?: string;
  sentAt?: string;
  sentStatus?: 'pending' | 'success' | 'failed';
  sentError?: string;
}

export interface CodesData {
  codes: AccessCode[];
  stats: {
    total: number;
    active: number;
    used: number;
    expired: number;
    batch: number;
    selfApply: number;
  };
}

/**
 * 读取体验码数据
 */
export function loadCodes(): CodesData {
  try {
    const data = fs.readFileSync(CODES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    // 如果文件不存在，返回空数据
    return {
      codes: [],
      stats: {
        total: 0,
        active: 0,
        used: 0,
        expired: 0,
        batch: 0,
        selfApply: 0
      }
    };
  }
}

/**
 * 保存体验码数据
 */
export function saveCodes(data: CodesData): void {
  // 确保目录存在
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  // 更新统计数据
  data.stats = calculateStats(data.codes);
  
  fs.writeFileSync(CODES_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * 计算统计数据
 */
function calculateStats(codes: AccessCode[]) {
  return {
    total: codes.length,
    active: codes.filter(c => c.status === 'active').length,
    used: codes.filter(c => c.status === 'used').length,
    expired: codes.filter(c => c.status === 'expired').length,
    batch: codes.filter(c => c.source === 'batch').length,
    selfApply: codes.filter(c => c.source === 'self_apply').length
  };
}

/**
 * 创建新的体验码
 */
export function createCode(params: {
  userName: string;
  userId: string;
  source: 'batch' | 'self_apply' | 'manual';
  note?: string;
}): AccessCode {
  const code: AccessCode = {
    id: generateId(),
    code: generateCode(),
    status: 'active',
    userId: params.userId,
    userName: params.userName,
    createdAt: new Date().toISOString(),
    usedAt: null,
    expiresAt: null,
    maxUses: 1,
    currentUses: 0,
    source: params.source,
    note: params.note
  };
  
  return code;
}

/**
 * 批量创建体验码
 */
export function createBatchCodes(users: Array<{ userName: string; userId: string }>, note?: string): AccessCode[] {
  const codes: AccessCode[] = [];
  
  for (const user of users) {
    const code = createCode({
      userName: user.userName,
      userId: user.userId,
      source: 'batch',
      note: note || '批量发放'
    });
    codes.push(code);
  }
  
  return codes;
}

/**
 * 根据体验码查找
 */
export function findCodeByCode(code: string): AccessCode | undefined {
  const data = loadCodes();
  return data.codes.find(c => c.code === code);
}

/**
 * 根据用户名查找
 */
export function findCodeByUserName(userName: string): AccessCode | undefined {
  const data = loadCodes();
  return data.codes.find(c => c.userName === userName);
}

/**
 * 根据用户ID查找
 */
export function findCodeByUserId(userId: string): AccessCode | undefined {
  const data = loadCodes();
  return data.codes.find(c => c.userId === userId);
}

/**
 * 验证体验码
 * @param code 体验码
 * @param forActivation 是否用于激活（true=激活，false=权限检查）
 */
export function verifyCode(code: string, forActivation: boolean = true): { valid: boolean; message: string; data?: AccessCode } {
  const accessCode = findCodeByCode(code);
  
  if (!accessCode) {
    return { valid: false, message: '体验码不存在' };
  }
  
  if (accessCode.status === 'expired') {
    return { valid: false, message: '体验码已过期' };
  }
  
  // 如果是激活操作，检查是否已被使用
  if (forActivation && accessCode.status === 'used' && accessCode.currentUses >= accessCode.maxUses) {
    return { valid: false, message: '体验码已被使用' };
  }
  
  // 如果是权限检查，允许已使用的体验码通过验证
  if (!forActivation && accessCode.status === 'used') {
    return { valid: true, message: '验证成功', data: accessCode };
  }
  
  if (accessCode.expiresAt && new Date(accessCode.expiresAt) < new Date()) {
    // 自动更新为过期状态
    accessCode.status = 'expired';
    const data = loadCodes();
    saveCodes(data);
    return { valid: false, message: '体验码已过期' };
  }
  
  return { valid: true, message: '验证成功', data: accessCode };
}

/**
 * 标记体验码为已使用
 */
export function markCodeAsUsed(code: string): boolean {
  const data = loadCodes();
  const accessCode = data.codes.find(c => c.code === code);
  
  if (!accessCode) {
    return false;
  }
  
  accessCode.currentUses += 1;
  
  if (accessCode.currentUses >= accessCode.maxUses) {
    accessCode.status = 'used';
  }
  
  if (!accessCode.usedAt) {
    accessCode.usedAt = new Date().toISOString();
  }
  
  saveCodes(data);
  return true;
}

/**
 * 添加体验码
 */
export function addCode(code: AccessCode): void {
  const data = loadCodes();
  data.codes.push(code);
  saveCodes(data);
}

/**
 * 批量添加体验码
 */
export function addBatchCodes(codes: AccessCode[]): void {
  const data = loadCodes();
  data.codes.push(...codes);
  saveCodes(data);
}

/**
 * 更新体验码
 */
export function updateCode(id: string, updates: Partial<AccessCode>): boolean {
  const data = loadCodes();
  const index = data.codes.findIndex(c => c.id === id);
  
  if (index === -1) {
    return false;
  }
  
  data.codes[index] = { ...data.codes[index], ...updates };
  saveCodes(data);
  return true;
}

/**
 * 获取所有体验码（支持筛选和分页）
 */
export function getCodes(options?: {
  status?: 'active' | 'used' | 'expired';
  source?: 'batch' | 'self_apply' | 'manual';
  page?: number;
  limit?: number;
}): { codes: AccessCode[]; total: number; page: number; pages: number } {
  const data = loadCodes();
  let codes = data.codes;
  
  // 筛选
  if (options?.status) {
    codes = codes.filter(c => c.status === options.status);
  }
  
  if (options?.source) {
    codes = codes.filter(c => c.source === options.source);
  }
  
  // 按创建时间倒序排列（最新的在最前面）
  codes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // 分页
  const page = options?.page || 1;
  const limit = options?.limit || 50;
  const total = codes.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  
  codes = codes.slice(start, end);
  
  return { codes, total, page, pages };
}

/**
 * 获取统计数据
 */
export function getStats() {
  const data = loadCodes();
  return data.stats;
}
