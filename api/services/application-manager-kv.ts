/**
 * 申请记录管理服务 (Vercel KV版本)
 */

import { kv } from '@vercel/kv';
import { generateId } from '../utils/code-generator.js';

const APPLICATIONS_KEY = 'applications';

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
export async function loadApplications(): Promise<ApplicationsData> {
  try {
    const applications = await kv.get<Application[]>(APPLICATIONS_KEY) || [];
    return { applications };
  } catch (e) {
    console.error('Error loading applications from KV:', e);
    return { applications: [] };
  }
}

/**
 * 保存申请记录
 */
export async function saveApplications(data: ApplicationsData): Promise<void> {
  try {
    await kv.set(APPLICATIONS_KEY, data.applications);
  } catch (e) {
    console.error('Error saving applications to KV:', e);
    throw e;
  }
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
export async function addApplication(application: Application): Promise<void> {
  const data = await loadApplications();
  data.applications.push(application);
  await saveApplications(data);
}

/**
 * 更新申请记录
 */
export async function updateApplication(id: string, updates: Partial<Application>): Promise<boolean> {
  const data = await loadApplications();
  const index = data.applications.findIndex(a => a.id === id);
  
  if (index === -1) {
    return false;
  }
  
  data.applications[index] = { ...data.applications[index], ...updates };
  await saveApplications(data);
  return true;
}

/**
 * 获取所有申请记录
 */
export async function getApplications(options?: {
  status?: 'pending' | 'approved' | 'rejected';
  page?: number;
  limit?: number;
}): Promise<{ applications: Application[]; total: number; page: number; pages: number }> {
  const data = await loadApplications();
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
export async function getRecentApplications(limit: number = 10): Promise<Application[]> {
  const data = await loadApplications();
  return data.applications
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, limit);
}

/**
 * 查找相同评论的申请记录（用于防止重复使用同一条评论）
 * 只检查相同用户名的重复评论
 */
export async function findApplicationByComment(userName: string, comment: string): Promise<Application | null> {
  const data = await loadApplications();
  const found = data.applications.find(app => 
    app.userName === userName && 
    app.aiVerification?.comment === comment &&
    app.status === 'approved'
  );
  return found || null;
}

/**
 * 查找相同评论内容的申请记录（不限用户名）
 * 用于防止不同用户使用相同评论
 */
export async function findApplicationByCommentContent(comment: string): Promise<Application | null> {
  const data = await loadApplications();
  const found = data.applications.find(app => 
    app.aiVerification?.comment === comment &&
    app.status === 'approved'
  );
  return found || null;
}
