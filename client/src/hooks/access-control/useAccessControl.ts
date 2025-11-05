/**
 * 权限检测 Hook
 */

import { useState, useEffect } from 'react';

const ACCESS_CODE_KEY = 'phil_access_code';

export interface AccessControlState {
  hasAccess: boolean;
  isChecking: boolean;
  code: string | null;
  userName: string | null;
}

/**
 * 权限检测 Hook
 */
export function useAccessControl() {
  const [state, setState] = useState<AccessControlState>({
    hasAccess: false,
    isChecking: true,
    code: null,
    userName: null
  });

  useEffect(() => {
    checkAccess();
  }, []);

  /**
   * 检查访问权限
   */
  const checkAccess = async () => {
    try {
      // 从 LocalStorage 读取体验码
      const code = localStorage.getItem(ACCESS_CODE_KEY);

      if (!code) {
        setState({
          hasAccess: false,
          isChecking: false,
          code: null,
          userName: null
        });
        return;
      }

      // 验证体验码
      const response = await fetch('/api/check-access', {
        headers: {
          'Authorization': `Bearer ${code}`
        }
      });

      const result = await response.json();

      if (result.hasAccess) {
        setState({
          hasAccess: true,
          isChecking: false,
          code: result.code,
          userName: result.userName
        });
      } else {
        // 体验码无效，清除
        localStorage.removeItem(ACCESS_CODE_KEY);
        setState({
          hasAccess: false,
          isChecking: false,
          code: null,
          userName: null
        });
      }
    } catch (error) {
      console.error('检查访问权限错误:', error);
      setState({
        hasAccess: false,
        isChecking: false,
        code: null,
        userName: null
      });
    }
  };

  /**
   * 激活体验码
   */
  const activateCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      const result = await response.json();

      if (result.valid) {
        // 保存到 LocalStorage
        localStorage.setItem(ACCESS_CODE_KEY, code);

        // 更新状态
        setState({
          hasAccess: true,
          isChecking: false,
          code: code,
          userName: result.data?.userName || null
        });

        return {
          success: true,
          message: '体验码激活成功！'
        };
      } else {
        return {
          success: false,
          message: result.message || '体验码无效'
        };
      }
    } catch (error: any) {
      console.error('激活体验码错误:', error);
      return {
        success: false,
        message: error.message || '网络错误，请稍后重试'
      };
    }
  };

  /**
   * 通过 token 激活（专属链接）
   */
  const activateByToken = async (token: string): Promise<{ success: boolean; message: string; code?: string }> => {
    try {
      const response = await fetch('/api/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      const result = await response.json();

      if (result.valid && result.code) {
        // 保存到 LocalStorage
        localStorage.setItem(ACCESS_CODE_KEY, result.code);

        // 更新状态
        setState({
          hasAccess: true,
          isChecking: false,
          code: result.code,
          userName: result.data?.userName || null
        });

        return {
          success: true,
          message: result.message || '体验码已激活！',
          code: result.code
        };
      } else {
        return {
          success: false,
          message: result.message || '链接无效'
        };
      }
    } catch (error: any) {
      console.error('通过 token 激活错误:', error);
      return {
        success: false,
        message: error.message || '网络错误，请稍后重试'
      };
    }
  };

  return {
    ...state,
    activateCode,
    activateByToken,
    checkAccess
  };
}
