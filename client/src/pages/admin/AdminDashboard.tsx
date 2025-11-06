/**
 * 管理后台首页（Dashboard）
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../hooks/admin/useAdmin';

interface Stats {
  total: number;
  active: number;
  used: number;
  expired: number;
  batch: number;
  selfApply: number;
}

interface Application {
  id: string;
  userName: string;
  status: string;
  appliedAt: string;
  code?: string;
}

export default function AdminDashboard() {
  const { getToken } = useAdmin();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentApplications(data.recentApplications || []);
      }
    } catch (error) {
      console.error('加载数据错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* 标题 */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-2">体验码管理系统概览</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">总数</div>
            <div className="text-4xl font-bold">{stats?.total || 0}</div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">激活中</div>
            <div className="text-4xl font-bold text-green-500">{stats?.active || 0}</div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">已使用</div>
            <div className="text-4xl font-bold text-blue-500">{stats?.used || 0}</div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">已过期</div>
            <div className="text-4xl font-bold text-red-500">{stats?.expired || 0}</div>
          </div>
        </div>

        {/* 来源统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">批量发放</div>
            <div className="text-3xl font-bold">{stats?.batch || 0}</div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">自助申请</div>
            <div className="text-3xl font-bold">{stats?.selfApply || 0}</div>
          </div>
        </div>

        {/* 最近申请 */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">最近申请</h2>
          
          {recentApplications.length === 0 ? (
            <p className="text-gray-400 text-center py-8">暂无申请记录</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4">英文名</th>
                    <th className="text-left py-3 px-4">状态</th>
                    <th className="text-left py-3 px-4">体验码</th>
                    <th className="text-left py-3 px-4">申请时间</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="py-3 px-4">{app.userName}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          app.status === 'approved' 
                            ? 'bg-green-900 text-green-300' 
                            : app.status === 'rejected'
                            ? 'bg-red-900 text-red-300'
                            : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {app.status === 'approved' ? '已通过' : app.status === 'rejected' ? '已拒绝' : '待审核'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm">
                        {app.code || '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {new Date(app.appliedAt).toLocaleString('zh-CN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
