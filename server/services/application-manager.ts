/**
 * 申请记录管理服务
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateId } from '../utils/code-generator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');

export interface Application {
  id: string;
  userName: string;
  wechatId: string;
  screenshot: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
  aiVerification?: {
    extractedName?: string;
    comment?: string;
    confidence?: number;
    verifiedAt: string;
  };
  code?: string;
  rejectReason?: string;
}

export interface ApplicationsData {
  applications: Application[];
}

/**
 * 读取申请记录
 */
export function loadApplications(): ApplicationsData {
  try {
    const data = fs.readFileSync(APPLICATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return { applications: [] };
  }
}

/**
 * 保存申请记录
 */
export function saveApplications(data: ApplicationsData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * 创建申请记录
 */
export function createApplication(params: {
  userName: string;
  wechatId: string;
  screenshot: string;
  aiVerification?: {
    extractedName?: string;
    comment?: string;
    confidence?: number;
  };
  code?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
}): Application {
  const application: Application = {
    id: generateId(),
    userName: params.userName,
    wechatId: params.wechatId,
    screenshot: params.screenshot,
    status: params.status,
    appliedAt: new Date().toISOString(),
    reviewedAt: params.status !== 'pending' ? new Date().toISOString() : undefined,
    aiVerification: params.aiVerification ? {
      ...params.aiVerification,
      verifiedAt: new Date().toISOString()
    } : undefined,
    code: params.code,
    rejectReason: params.rejectReason
  };
  
  return application;
}

/**
 * 添加申请记录
 */
export function addApplication(application: Application): void {
  const data = loadApplications();
  data.applications.push(application);
  saveApplications(data);
}

/**
 * 获取所有申请记录
 */
export function getApplications(options?: {
  status?: 'pending' | 'approved' | 'rejected';
  page?: number;
  limit?: number;
}): { applications: Application[]; total: number; page: number; pages: number } {
  const data = loadApplications();
  let applications = data.applications;
  
  // 筛选
  if (options?.status) {
    applications = applications.filter(a => a.status === options.status);
  }
  
  // 按时间倒序排序
  applications.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  
  // 分页
  const page = options?.page || 1;
  const limit = options?.limit || 50;
  const total = applications.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  
  applications = applications.slice(start, end);
  
  return { applications, total, page, pages };
}

/**
 * 获取最近的申请记录
 */
export function getRecentApplications(limit: number = 10): Application[] {
  const data = loadApplications();
  return data.applications
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, limit);
}
