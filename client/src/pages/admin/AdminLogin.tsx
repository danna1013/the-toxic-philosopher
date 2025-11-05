/**
 * 管理后台登录页面
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAdmin } from '../../hooks/admin/useAdmin';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { login } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(password);
    if (success) {
      setLocation('/admin');
    } else {
      setError('密码错误');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">管理后台</h1>
          <p className="text-gray-400">体验码管理系统</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              管理员密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="请输入管理员密码"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200"
          >
            登录
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setLocation('/')}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← 返回首页
          </button>
        </div>
      </div>
    </div>
  );
}
