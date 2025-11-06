/**
 * 生成体验码页面
 */

import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../hooks/admin/useAdmin';

export default function AdminGenerateCode() {
  const { getToken } = useAdmin();
  const [userName, setUserName] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      alert('请输入用户姓名');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          userName: userName.trim(),
          note: note.trim() || '管理员手动生成'
        })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedCode(data.code);
        alert(`体验码生成成功！\n\n体验码：${data.code}\n\n已自动复制到剪贴板`);
        
        // 复制到剪贴板
        navigator.clipboard.writeText(data.code).catch(err => {
          console.error('复制失败:', err);
        });
        
        // 清空表单
        setUserName('');
        setNote('');
      } else {
        alert(data.message || '生成失败');
      }
    } catch (error) {
      console.error('生成体验码错误:', error);
      alert('生成失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode).then(() => {
        alert('体验码已复制到剪贴板');
      }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败');
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">生成体验码</h1>
          <p className="mt-2 text-sm text-gray-600">
            输入用户姓名，快速生成体验码
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* 用户姓名 */}
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                用户姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="请输入用户姓名"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                disabled={isLoading}
              />
            </div>

            {/* 备注 */}
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                备注（可选）
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="请输入备注信息"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                disabled={isLoading}
              />
            </div>

            {/* 提交按钮 */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading || !userName.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? '生成中...' : '生成体验码'}
              </button>
            </div>
          </form>

          {/* 显示生成的体验码 */}
          {generatedCode && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800 mb-1">
                    体验码生成成功！
                  </p>
                  <p className="text-2xl font-mono font-bold text-green-900">
                    {generatedCode}
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  复制
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 使用说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">使用说明</h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>输入用户姓名后，系统会自动生成一个唯一的体验码</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>生成的体验码会自动复制到剪贴板，方便发送给用户</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>体验码默认可使用1次，用户激活后即可体验完整模式</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>可以在"体验码管理"页面查看和管理所有生成的体验码</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
