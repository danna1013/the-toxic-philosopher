/**
 * 体验码列表页面
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../hooks/admin/useAdmin';

interface Code {
  id: string;
  userName: string;
  userId: string;
  code: string;
  status: string;
  source: string;
  createdAt: string;
  usedAt?: string;
  expiresAt?: string;
  sentStatus?: string;
}

export default function AdminCodes() {
  const { getToken } = useAdmin();
  const [codes, setCodes] = useState<Code[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCodes();
  }, [filter]);

  const loadCodes = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await fetch(`/api/admin/codes?${params}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCodes(data.codes || []);
      }
    } catch (error) {
      console.error('加载体验码列表错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (id: string) => {
    if (!confirm('确定要重置这个体验码吗？\n\n重置后将生成一个新的体验码，旧码将失效。')) return;
    
    try {
      const response = await fetch(`/api/admin/codes/${id}/reset`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        alert(`重置成功！\n\n旧码：${data.oldCode}\n新码：${data.newCode}\n\n新码已自动复制到剪贴板`);
        
        // 复制新码到剪贴板
        navigator.clipboard.writeText(data.newCode).catch(err => {
          console.error('复制失败:', err);
        });
        
        loadCodes();
      } else {
        const data = await response.json();
        alert(`重置失败：${data.message}`);
      }
    } catch (error) {
      console.error('重置错误:', error);
      alert('重置失败！');
    }
  };

  const handleAdjustUses = async (id: string) => {
    const newMaxUses = prompt('请输入新的最大使用次数：');
    if (!newMaxUses) return;
    
    const maxUses = parseInt(newMaxUses);
    if (isNaN(maxUses) || maxUses < 1) {
      alert('请输入有效的数字！');
      return;
    }

    try {
      const response = await fetch(`/api/admin/codes/${id}/adjust-uses`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ maxUses })
      });

      if (response.ok) {
        alert('调整成功！');
        loadCodes();
      } else {
        const data = await response.json();
        alert(`调整失败：${data.error}`);
      }
    } catch (error) {
      console.error('调整错误:', error);
      alert('调整失败！');
    }
  };

  const handleRegenerate = async (id: string) => {
    if (!confirm('确定要重新生成这个体验码吗？旧码将失效！')) return;
    
    try {
      const response = await fetch(`/api/admin/codes/${id}/regenerate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        alert(`重新生成成功！新码：${data.newCode}`);
        loadCodes();
      } else {
        const data = await response.json();
        alert(`重新生成失败：${data.error}`);
      }
    } catch (error) {
      console.error('重新生成错误:', error);
      alert('重新生成失败！');
    }
  };

  const filteredCodes = codes.filter(code => 
    code.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-900 text-green-300 border-green-700',
      used: 'bg-blue-900 text-blue-300 border-blue-700',
      expired: 'bg-gray-800 text-gray-400 border-gray-700'
    };

    const labels = {
      active: '未使用',
      used: '已使用',
      expired: '已过期'
    };

    return (
      <span className={`px-2 py-1 text-xs border rounded ${styles[status as keyof typeof styles] || styles.active}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = ['英文名', '企业微信ID', '体验码', '状态', '生成时间', '使用时间'];
    const rows = filteredCodes.map(code => [
      code.userName,
      code.userId,
      code.code,
      code.status === 'active' ? '未使用' : code.status === 'used' ? '已使用' : '已过期',
      formatDate(code.createdAt),
      formatDate(code.usedAt)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `体验码列表_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 标题 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">体验码列表</h1>
            <p className="text-gray-400 mt-2">查看和管理所有体验码</p>
          </div>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
          >
            导出 CSV
          </button>
        </div>

        {/* 筛选和搜索 */}
        <div className="bg-gray-900 rounded-lg p-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索英文名、企业微信ID或体验码..."
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-gray-500"
            >
              <option value="all">全部状态</option>
              <option value="active">未使用</option>
              <option value="used">已使用</option>
              <option value="expired">已过期</option>
            </select>
          </div>

          <div className="text-sm text-gray-400">
            共 {filteredCodes.length} 个体验码
          </div>
        </div>

        {/* 体验码列表 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-gray-400 mt-4">加载中...</p>
          </div>
        ) : filteredCodes.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-12 text-center">
            <p className="text-gray-400">暂无体验码</p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      英文名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      企业微信ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      体验码
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      生成时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      使用时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredCodes.map((code) => (
                    <tr key={code.id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {code.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {code.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">
                        {code.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(code.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(code.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(code.usedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {code.status === 'used' && (
                            <button
                              onClick={() => handleReset(code.id)}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                            >
                              重置
                            </button>
                          )}
                          <button
                            onClick={() => handleAdjustUses(code.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                          >
                            调整次数
                          </button>
                          <button
                            onClick={() => handleRegenerate(code.id)}
                            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-xs"
                          >
                            重新生成
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
