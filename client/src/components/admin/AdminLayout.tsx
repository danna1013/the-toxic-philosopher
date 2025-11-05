/**
 * 管理后台布局组件
 */

import { useLocation } from 'wouter';
import { useAdmin } from '../../hooks/admin/useAdmin';
import { useEffect } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isChecking, logout } = useAdmin();

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, isChecking]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶部导航 */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">体验码管理系统</h1>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setLocation('/admin')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location === '/admin' 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  首页
                </button>
                <button
                  onClick={() => setLocation('/admin/codes')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location === '/admin/codes' 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  体验码列表
                </button>
                <button
                  onClick={() => setLocation('/admin/generate')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location === '/admin/generate' 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  批量生成
                </button>
                <button
                  onClick={() => setLocation('/admin/applications')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location === '/admin/applications' 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  申请记录
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLocation('/')}
                className="text-gray-400 hover:text-white text-sm"
              >
                返回网站
              </button>
              <button
                onClick={() => {
                  logout();
                  setLocation('/admin/login');
                }}
                className="text-gray-400 hover:text-white text-sm"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
