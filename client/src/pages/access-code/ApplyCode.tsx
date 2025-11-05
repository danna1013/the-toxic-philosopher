/**
 * 申请体验码页面
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAccessControl } from '../../hooks/access-control/useAccessControl';

export default function ApplyCode() {
  const [, setLocation] = useLocation();
  const { activateCode } = useAccessControl();

  const [formData, setFormData] = useState({
    name: '',
    wechatId: '',
    screenshot: null as File | null
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    code?: string;
  } | null>(null);

  /**
   * 处理文件选择
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, screenshot: file });

      // 生成预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * 提交申请
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.wechatId || !formData.screenshot) {
      alert('请填写完整信息并上传评论截图');
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('wechatId', formData.wechatId);
      formDataToSend.append('screenshot', formData.screenshot);

      const response = await fetch('/api/apply-code', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success && data.code) {
        // 自动激活体验码
        await activateCode(data.code);

        setResult({
          success: true,
          message: data.message,
          code: data.code
        });
      } else {
        setResult({
          success: false,
          message: data.message || '申请失败，请稍后重试'
        });
      }
    } catch (error: any) {
      console.error('申请体验码错误:', error);
      setResult({
        success: false,
        message: error.message || '网络错误，请稍后重试'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 开始体验
   */
  const handleStartExperience = () => {
    setLocation('/arena');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">申请体验码</h1>
          <p className="text-gray-400">
            填写信息并上传评论截图，AI 将在 5 秒内完成审核
          </p>
        </div>

        {!result ? (
          /* 申请表单 */
          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-8 space-y-6">
            {/* 英文名 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                英文名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入您的英文名（必须与截图一致）"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                必须与评论截图中的英文名完全一致（严格匹配）
              </p>
            </div>

            {/* 企业微信ID */}
            <div>
              <label className="block text-sm font-medium mb-2">
                企业微信ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.wechatId}
                onChange={(e) => setFormData({ ...formData, wechatId: e.target.value })}
                placeholder="请输入您的企业微信ID"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white"
                disabled={isSubmitting}
              />
            </div>

            {/* 评论截图 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                评论截图 <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="预览"
                      className="max-w-full max-h-64 mx-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, screenshot: null });
                        setPreviewUrl(null);
                      }}
                      className="text-sm text-gray-400 hover:text-white"
                      disabled={isSubmitting}
                    >
                      重新上传
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="screenshot-upload"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="screenshot-upload"
                      className="cursor-pointer inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg"
                    >
                      选择图片
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      支持 JPG、PNG、GIF、WEBP 格式，最大 10MB
                    </p>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                截图必须包含您的评论内容和英文名
              </p>
            </div>

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.wechatId || !formData.screenshot}
              className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  AI 审核中...（约 5 秒）
                </span>
              ) : (
                '提交申请'
              )}
            </button>
          </form>
        ) : (
          /* 结果页面 */
          <div className="bg-gray-900 rounded-lg p-8 text-center space-y-6">
            {result.success ? (
              <>
                {/* 成功 */}
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl font-bold">申请成功！</h2>
                <p className="text-gray-400">{result.message}</p>

                {/* 体验码 */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <p className="text-sm text-gray-400 mb-2">您的体验码</p>
                  <p className="text-3xl font-mono font-bold">{result.code}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result.code!);
                      alert('体验码已复制到剪贴板');
                    }}
                    className="mt-4 text-sm text-gray-400 hover:text-white"
                  >
                    复制体验码
                  </button>
                </div>

                <p className="text-sm text-gray-400">
                  体验码已自动激活，您现在可以使用完整功能了！
                </p>

                {/* 操作按钮 */}
                <div className="flex gap-4">
                  <button
                    onClick={handleStartExperience}
                    className="flex-1 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200"
                  >
                    开始体验
                  </button>
                  <button
                    onClick={() => setLocation('/')}
                    className="flex-1 py-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700"
                  >
                    返回首页
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* 失败 */}
                <div className="text-6xl">❌</div>
                <h2 className="text-2xl font-bold">申请失败</h2>
                <p className="text-gray-400">{result.message}</p>

                {/* 重试按钮 */}
                <button
                  onClick={() => setResult(null)}
                  className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200"
                >
                  重新申请
                </button>
              </>
            )}
          </div>
        )}

        {/* 返回链接 */}
        {!result && (
          <div className="text-center mt-6">
            <button
              onClick={() => setLocation('/arena')}
              className="text-gray-400 hover:text-white text-sm"
            >
              ← 返回
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
