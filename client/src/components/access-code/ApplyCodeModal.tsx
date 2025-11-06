import React, { useState } from 'react';

interface ApplyCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (code: string) => void;
}

export const ApplyCodeModal: React.FC<ApplyCodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [userName, setUserName] = useState(''); // 企业微信英文名ID
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    extractedName: string;
    comment: string;
    commentTime?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // 处理粘贴事件
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          setScreenshot(file);
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
          
          // 自动触发 AI 解析
          await analyzeScreenshot(file);
        }
        break;
      }
    }
  };

  // 处理文件选择
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // 自动触发 AI 解析
      await analyzeScreenshot(file);
    }
  };

  // AI 解析截图
  const analyzeScreenshot = async (file: File) => {
    setIsAnalyzing(true);
    setError('');
    setAiResult(null);

    try {
      const formData = new FormData();
      formData.append('screenshot', file);

      const response = await fetch('/api/analyze-screenshot', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setAiResult({
          extractedName: data.extractedName,
          comment: data.comment,
          commentTime: data.commentTime,
        });
      } else {
        setError(data.message || 'AI 解析失败');
      }
    } catch (err) {
      setError('AI 解析失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 提交申请
  const handleSubmit = async () => {
    if (!userName || !screenshot) {
      setError('请填写所有必填项');
      return;
    }

    // 验证 AI 识别结果
    if (!aiResult) {
      setError('请等待 AI 识别完成');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('userName', userName);
      formData.append('screenshot', screenshot);
      formData.append('extractedName', aiResult.extractedName);
      formData.append('comment', aiResult.comment);
      if (aiResult.commentTime) {
        formData.append('commentTime', aiResult.commentTime);
      }

      const response = await fetch('/api/apply-code', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onSuccess(data.code);
        onClose();
      } else {
        setError(data.message || '申请失败');
      }
    } catch (err) {
      setError('申请失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-5xl bg-white p-12 shadow-2xl"
        onPaste={handlePaste}
        tabIndex={0}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-600 text-2xl font-light"
        >
          ×
        </button>

        {/* 标题 */}
        <h2 className="text-2xl font-light text-black mb-2 tracking-wide">申请体验码</h2>
        <p className="text-gray-500 text-sm mb-8 font-light leading-relaxed">
          💡 <a href="https://teko.woa.com/event/ai-agent/246" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-600">点击链接</a>，评论10字以上，上传截图等待AI验证（约5秒）即可获取体验码。
        </p>

        {/* 表单 */}
        <div className="space-y-6">
          {/* 企业微信英文名ID */}
          <div>
            <label className="block text-sm font-light text-black mb-2 tracking-wide">
              企业微信英文名ID *
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="请输入您的企业微信英文名ID（必须与截图一致）"
              className="w-full px-4 py-3 bg-white border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-black font-light"
            />
            <p className="text-xs text-gray-500 mt-2 font-light">
              如需帮助可企微找 elisedai
            </p>
          </div>

          {/* 评论截图 */}
          <div>
            <label className="block text-sm font-light text-black mb-2 tracking-wide">
              评论截图 *
            </label>
            <p className="text-xs text-gray-500 mb-2 font-light">
              支持格式：JPG、PNG、GIF、WEBP，建议使用清晰的评论截图，包含用户名和评论内容
            </p>
            <div
              className="w-full border border-dashed border-gray-300 p-8 text-center cursor-pointer hover:border-black transition-colors"
            >
              {!previewUrl ? (
                <div>
                  <p className="text-gray-500 mb-4 font-light">
                    点击选择图片或直接粘贴截图（Ctrl+V）
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="screenshot-upload"
                  />
                  <label
                    htmlFor="screenshot-upload"
                    className="inline-block px-6 py-2 bg-black text-white cursor-pointer hover:bg-gray-800 font-light tracking-wide"
                  >
                    选择图片
                  </label>
                </div>
              ) : (
                <div>
                  <img
                    src={previewUrl}
                    alt="截图预览"
                    className="max-h-48 mx-auto mb-4 border border-gray-800"
                  />
                  <button
                    onClick={() => {
                      setScreenshot(null);
                      setPreviewUrl('');
                      setAiResult(null);
                    }}
                    className="text-sm text-gray-500 hover:text-black font-light"
                  >
                    重新上传
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AI 解析中 */}
          {isAnalyzing && (
            <div className="bg-gray-50 border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span className="text-gray-400 font-light">AI 正在解析截图...</span>
              </div>
            </div>
          )}

          {/* AI 解析结果 */}
          {aiResult && (
            <div className="bg-gray-50 border border-gray-200 p-4">
              <h3 className="text-black font-light mb-3 tracking-wide">AI 识别结果</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600 font-light">评论者：</span>
                  <span className="text-black ml-2 font-light">{aiResult.extractedName}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-light">评论内容：</span>
                  <span className="text-black ml-2 font-light">{aiResult.comment}</span>
                </div>
              </div>
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-3">
              <p className="text-red-500 text-sm font-light">{error}</p>
            </div>
          )}

          {/* 按钮 */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white text-black border border-gray-300 hover:border-black font-light tracking-wide"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !userName || !screenshot}
              className="px-6 py-2 bg-black text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed font-light tracking-wide"
            >
              {isSubmitting ? '提交中...' : '提交申请'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
