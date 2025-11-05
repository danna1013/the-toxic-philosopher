/**
 * 管理员认证 Hook
 */

import { useState, useEffect } from 'react';

const ADMIN_TOKEN_KEY = 'phil_admin_token';

export function useAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 检查是否已登录
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  /**
   * 登录
   */
  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (data.success && data.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  /**
   * 登出
   */
  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setIsAuthenticated(false);
  };

  /**
   * 获取认证 token
   */
  const getToken = (): string | null => {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  };

  return {
    isAuthenticated,
    isChecking,
    login,
    logout,
    getToken
  };
}
