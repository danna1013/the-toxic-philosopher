/**
 * 批量生成体验码页面
 */

import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAdmin } from '../../hooks/admin/useAdmin';

interface GeneratedCode {
  id: string;
  userName: string;
  userId: string;
  code: string;
  link: string;
}

export default function AdminGenerate() {
  const { getToken } = useAdmin();
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>([]);
  const [error, setError] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState({ current: 0, total: 0 });

  /**
   * 处理文件选择
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  /**
   * 批量生成
   */
  const handleGenerate = async () => {
    if (!file) {
      setError('请上传用户名单 Excel 文件');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedCodes([]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (note) {
        formData.append('note', note);
      }

      const response = await fetch('/api/admin/generate-batch', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedCodes(data.codes);
        alert(`成功生成 ${data.count} 个体验码！`);
      } else {
        setError(data.message || '生成失败');
      }
    } catch (error: any) {
      console.error('批量生成错误:', error);
      setError(error.message || '网络错误');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * 批量发送到企业微信
   */
  const handleSend = async () => {
    if (!webhookUrl) {
      alert('请输入企业微信 Webhook URL');
      return;
    }

    if (generatedCodes.length === 0) {
      alert('没有可发送的体验码');
      return;
    }

    setIsSending(true);
    setSendProgress({ current: 0, total: generatedCodes.length });

    try {
      const codeIds = generatedCodes.map(c => c.id);

      const response = await fetch('/api/admin/batch-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          codeIds,
          webhookUrl
        })
      });

      if (!response.ok) {
        throw new Error('发送失败');
      }

      // 读取 SSE 流
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'progress') {
                setSendProgress({ current: data.current, total: data.total });
              } else if (data.type === 'complete') {
                alert(`发送完成！成功: ${data.success}，失败: ${data.failed}`);
              } else if (data.type === 'error') {
                alert(`发送错误: ${data.message}`);
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error('批量发送错误:', error);
      alert(error.message || '发送失败');
    } finally {
      setIsSending(false);
    }
  };

  /**
   * 下载 Excel
   */
  const handleDownload = () => {
    // 创建 CSV 内容
    const headers = ['英文名', '企业微信ID', '体验码', '专属链接'];
    const rows = generatedCodes.map(c => [
      c.userName,
      c.userId,
      c.code,
      c.link
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `体验码_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* 标题 */}
        <div>
          <h1 className="text-3xl font-bold">批量生成体验码</h1>
          <p className="text-gray-400 mt-2">上传用户名单 Excel，批量生成体验码和专属链接</p>
        </div>

        {/* 上传表单 */}
        <div className="bg-gray-900 rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              用户名单 Excel <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
              {file ? (
                <div className="space-y-2">
                  <p className="text-green-500">✓ {file.name}</p>
                  <button
                    onClick={() => setFile(null)}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    重新上传
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg"
                  >
                    选择文件
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Excel 文件需包含"英文名"和"企业微信ID"列
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              备注（可选）
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="如：2024年11月批次"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
            />
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-300">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !file}
            className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500"
          >
            {isGenerating ? '生成中...' : '批量生成'}
          </button>
        </div>

        {/* 生成结果 */}
        {generatedCodes.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">生成结果（{generatedCodes.length} 个）</h2>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
              >
                下载 CSV
              </button>
            </div>

            {/* 企业微信发送 */}
            <div className="border-t border-gray-800 pt-6 space-y-4">
              <h3 className="text-lg font-bold">批量发送到企业微信</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  企业微信 Webhook URL
                </label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                  disabled={isSending}
                />
              </div>

              {isSending && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>发送进度</span>
                    <span>{sendProgress.current} / {sendProgress.total}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${(sendProgress.current / sendProgress.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                onClick={handleSend}
                disabled={isSending || !webhookUrl}
                className="w-full py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500"
              >
                {isSending ? '发送中...' : '批量发送'}
              </button>
            </div>

            {/* 体验码列表 */}
            <div className="border-t border-gray-800 pt-6">
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-900">
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4">英文名</th>
                      <th className="text-left py-3 px-4">企业微信ID</th>
                      <th className="text-left py-3 px-4">体验码</th>
                      <th className="text-left py-3 px-4">专属链接</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedCodes.map((code) => (
                      <tr key={code.id} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="py-3 px-4">{code.userName}</td>
                        <td className="py-3 px-4">{code.userId}</td>
                        <td className="py-3 px-4 font-mono text-sm">{code.code}</td>
                        <td className="py-3 px-4">
                          <a
                            href={code.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm truncate block max-w-xs"
                          >
                            {code.link}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
