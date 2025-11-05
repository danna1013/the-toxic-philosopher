/**
 * 申请记录页面
 */

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../hooks/admin/useAdmin';

interface Application {
  id: string;
  userName: string;
  wechatId: string;
  screenshot: string;
  status: string;
  appliedAt: string;
  code?: string;
  rejectReason?: string;
  aiVerification?: {
    extractedName?: string;
    comment?: string;
    confidence?: number;
  };
}

export default function AdminApplications() {
  const { getToken } = useAdmin();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadApplications();
  }, [filter]);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await fetch(`/api/admin/applications?${params}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('加载申请记录错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 标题 */}
        <div>
          <h1 className="text-3xl font-bold">申请记录</h1>
          <p className="text-gray-400 mt-2">查看所有用户申请记录和 AI 审核结果</p>
        </div>

        {/* 筛选 */}
        <div className="bg-gray-900 rounded-lg p-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
          >
            <option value="all">全部状态</option>
            <option value="approved">已通过</option>
            <option value="rejected">已拒绝</option>
            <option value="pending">待审核</option>
          </select>
        </div>

        {/* 申请列表 */}
        <div className="bg-gray-900 rounded-lg p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>加载中...</p>
            </div>
          ) : applications.length === 0 ? (
            <p className="text-gray-400 text-center py-8">暂无申请记录</p>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="border border-gray-800 rounded-lg p-6 hover:bg-gray-800">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 左侧：基本信息 */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-400 text-sm">英文名：</span>
                        <span className="ml-2">{app.userName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">企业微信ID：</span>
                        <span className="ml-2">{app.wechatId}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">申请时间：</span>
                        <span className="ml-2 text-sm">{new Date(app.appliedAt).toLocaleString('zh-CN')}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">状态：</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          app.status === 'approved' 
                            ? 'bg-green-900 text-green-300' 
                            : app.status === 'rejected'
                            ? 'bg-red-900 text-red-300'
                            : 'bg-yellow-900 text-yellow-300'
                        }`}>
                          {app.status === 'approved' ? '已通过' : app.status === 'rejected' ? '已拒绝' : '待审核'}
                        </span>
                      </div>
                      {app.code && (
                        <div>
                          <span className="text-gray-400 text-sm">体验码：</span>
                          <span className="ml-2 font-mono text-sm">{app.code}</span>
                        </div>
                      )}
                      {app.rejectReason && (
                        <div>
                          <span className="text-gray-400 text-sm">拒绝原因：</span>
                          <span className="ml-2 text-red-400 text-sm">{app.rejectReason}</span>
                        </div>
                      )}
                    </div>

                    {/* 右侧：AI 审核信息 */}
                    <div className="space-y-3">
                      {app.aiVerification && (
                        <>
                          <div>
                            <span className="text-gray-400 text-sm">AI 识别姓名：</span>
                            <span className="ml-2">{app.aiVerification.extractedName || '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">评论内容：</span>
                            <span className="ml-2 text-sm">{app.aiVerification.comment || '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">置信度：</span>
                            <span className="ml-2">{app.aiVerification.confidence ? `${(app.aiVerification.confidence * 100).toFixed(0)}%` : '-'}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 统计信息 */}
        <div className="bg-gray-900 rounded-lg p-4 text-center text-gray-400">
          共 {applications.length} 条记录
        </div>
      </div>
    </AdminLayout>
  );
}
