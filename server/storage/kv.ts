import { kv } from '@vercel/kv';

export interface AccessCode {
  code: string;
  createdAt: string;
  usedAt?: string;
  usedBy?: string;
  isUsed: boolean;
}

export interface Application {
  id: string;
  username: string;
  screenshotUrl: string;
  status: 'pending' | 'approved' | 'rejected' | 'activated';
  code?: string;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  activatedAt?: string;
  rejectionReason?: string;
  aiAnalysis?: {
    isValid: boolean;
    commentLength: number;
    timeWithin2Days: boolean;
    usernameMatch: boolean;
    extractedUsername?: string;
    extractedComment?: string;
    extractedTime?: string;
    reason?: string;
  };
}

const CODES_KEY = 'access_codes';
const APPLICATIONS_KEY = 'applications';

// 获取所有体验码
export async function getCodes(): Promise<AccessCode[]> {
  try {
    const codes = await kv.get<AccessCode[]>(CODES_KEY);
    return codes || [];
  } catch (error) {
    console.error('Error getting codes from KV:', error);
    return [];
  }
}

// 保存体验码
export async function saveCodes(codes: AccessCode[]): Promise<void> {
  try {
    await kv.set(CODES_KEY, codes);
  } catch (error) {
    console.error('Error saving codes to KV:', error);
    throw error;
  }
}

// 添加单个体验码
export async function addCode(code: AccessCode): Promise<void> {
  const codes = await getCodes();
  codes.push(code);
  await saveCodes(codes);
}

// 更新体验码
export async function updateCode(codeToUpdate: string, updates: Partial<AccessCode>): Promise<void> {
  const codes = await getCodes();
  const index = codes.findIndex(c => c.code === codeToUpdate);
  if (index !== -1) {
    codes[index] = { ...codes[index], ...updates };
    await saveCodes(codes);
  }
}

// 获取所有申请记录
export async function getApplications(): Promise<Application[]> {
  try {
    const applications = await kv.get<Application[]>(APPLICATIONS_KEY);
    return applications || [];
  } catch (error) {
    console.error('Error getting applications from KV:', error);
    return [];
  }
}

// 保存申请记录
export async function saveApplications(applications: Application[]): Promise<void> {
  try {
    await kv.set(APPLICATIONS_KEY, applications);
  } catch (error) {
    console.error('Error saving applications to KV:', error);
    throw error;
  }
}

// 添加单个申请记录
export async function addApplication(application: Application): Promise<void> {
  const applications = await getApplications();
  applications.push(application);
  await saveApplications(applications);
}

// 更新申请记录
export async function updateApplication(id: string, updates: Partial<Application>): Promise<void> {
  const applications = await getApplications();
  const index = applications.findIndex(a => a.id === id);
  if (index !== -1) {
    applications[index] = { ...applications[index], ...updates };
    await saveApplications(applications);
  }
}

// 查找体验码
export async function findCode(code: string): Promise<AccessCode | undefined> {
  const codes = await getCodes();
  return codes.find(c => c.code === code);
}

// 查找申请记录
export async function findApplication(id: string): Promise<Application | undefined> {
  const applications = await getApplications();
  return applications.find(a => a.id === id);
}
