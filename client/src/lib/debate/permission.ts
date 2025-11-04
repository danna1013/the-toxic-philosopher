import { getFingerprint } from './fingerprint';

export interface UserPermission {
  userType: 'free' | 'beta' | 'vip' | 'trial';
  features: {
    fullMode: boolean;
    maxDebatesPerDay: number;
    audienceSpeakLimit: number;
    customTopic: boolean;
  };
  activatedAt?: string;
}

const PERMISSION_STORAGE_KEY = 'user_permission';

// 获取用户权限
export async function getUserPermission(): Promise<UserPermission> {
  // 先从 localStorage 读取缓存
  const cached = localStorage.getItem(PERMISSION_STORAGE_KEY);
  if (cached) {
    try {
      const permission = JSON.parse(cached);
      // 检查缓存是否过期（24小时）
      if (permission.cachedAt && Date.now() - permission.cachedAt < 24 * 60 * 60 * 1000) {
        return permission;
      }
    } catch (e) {
      console.error('Failed to parse cached permission:', e);
    }
  }

  // 从服务器验证
  try {
    const fingerprint = getFingerprint();
    const response = await fetch('/api/invitation/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint })
    });

    if (!response.ok) {
      throw new Error('Failed to verify permission');
    }

    const permission = await response.json();
    
    // 缓存到 localStorage
    localStorage.setItem(PERMISSION_STORAGE_KEY, JSON.stringify({
      ...permission,
      cachedAt: Date.now()
    }));

    return permission;
  } catch (error) {
    console.error('Error getting user permission:', error);
    
    // 返回默认免费权限
    return {
      userType: 'free',
      features: {
        fullMode: false,
        maxDebatesPerDay: 3,
        audienceSpeakLimit: 1,
        customTopic: false
      }
    };
  }
}

// 激活邀请码
export async function activateInvitationCode(code: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  permission?: UserPermission;
}> {
  try {
    const fingerprint = getFingerprint();
    const response = await fetch('/api/invitation/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        fingerprint,
        ipAddress: '', // 服务器会从请求中获取
        userAgent: navigator.userAgent
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to activate invitation code'
      };
    }

    // 清除缓存，强制重新获取权限
    localStorage.removeItem(PERMISSION_STORAGE_KEY);

    const permission: UserPermission = {
      userType: data.type,
      features: data.features
    };

    // 缓存新权限
    localStorage.setItem(PERMISSION_STORAGE_KEY, JSON.stringify({
      ...permission,
      cachedAt: Date.now()
    }));

    return {
      success: true,
      message: data.message,
      permission
    };
  } catch (error) {
    console.error('Error activating invitation code:', error);
    return {
      success: false,
      error: 'Network error'
    };
  }
}

// 检查今日使用次数
export async function checkUsageToday(): Promise<{
  maxDebatesPerDay: number;
  usedToday: number;
  remaining: number;
  canCreateDebate: boolean;
}> {
  try {
    const fingerprint = getFingerprint();
    const response = await fetch('/api/invitation/check-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint })
    });

    if (!response.ok) {
      throw new Error('Failed to check usage');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking usage:', error);
    return {
      maxDebatesPerDay: 3,
      usedToday: 0,
      remaining: 3,
      canCreateDebate: true
    };
  }
}

// 清除权限缓存（用于退出登录或重置）
export function clearPermissionCache(): void {
  localStorage.removeItem(PERMISSION_STORAGE_KEY);
}
