/**
 * 体验码提示弹窗
 */

import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAccessControl } from '../../hooks/access-control/useAccessControl';
import { ApplyCodeModal } from './ApplyCodeModal';

interface AccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessCodeModal({ isOpen, onClose }: AccessCodeModalProps) {
  const [, setLocation] = useLocation();
  const { activateCode } = useAccessControl();
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);

  if (!isOpen) return null;

  /**
   * 申请体验码
   */
  const handleApply = () => {
    setShowApplyModal(true);
  };

  /**
   * 输入体验码
   */
  const handleInput = () => {
    setShowInput(true);
    setError('');
  };

  /**
   * 验证体验码
   */
  const handleVerify = async () => {
    if (!code.trim()) {
      setError('请输入体验码');
      return;
    }

    setIsVerifying(true);
    setError('');

    const result = await activateCode(code.trim());

    if (result.success) {
      alert(result.message);
      onClose();
      // 刷新页面以更新权限状态
      window.location.reload();
    } else {
      setError(result.message);
    }

    setIsVerifying(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-4xl w-full p-12 relative shadow-2xl">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-600 text-2xl font-light"
        >
          ×
        </button>

        {!showInput ? (
          /* 提示页面 */
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-light tracking-wide text-black mb-2">需要体验码</h2>
            <p className="text-gray-600 font-light">
              完整模式需要体验码才能访问
            </p>

            <div className="space-y-3">
              <button
                onClick={handleApply}
                className="w-full py-4 bg-black text-white font-light tracking-wide hover:bg-gray-800"
              >
                申请体验码
              </button>
              <button
                onClick={handleInput}
                className="w-full py-4 bg-white text-black border border-gray-300 font-light tracking-wide hover:border-black"
              >
                我已有体验码
              </button>
            </div>

            <p className="text-sm text-gray-500 font-light leading-relaxed">
              💡 体验码可快速获取，约15s
            </p>
          </div>
        ) : (
          /* 输入页面 */
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-light mb-2 tracking-wide text-black">输入体验码</h2>
              <p className="text-gray-600 text-sm font-light">
                请输入您的体验码
              </p>
            </div>

            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="PHIL2024-XXXXXX"
                className="w-full px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-black text-center font-mono text-lg text-black"
                disabled={isVerifying}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleVerify();
                  }
                }}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full py-4 bg-black text-white font-light tracking-wide hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isVerifying ? '验证中...' : '确认'}
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="w-full py-4 bg-white text-black border border-gray-300 font-light tracking-wide hover:border-black"
              >
                返回
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 申请体验码弹窗 */}
      <ApplyCodeModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSuccess={(code) => {
          setShowApplyModal(false);
          setCode(code);
          setShowInput(true);
          handleVerify();
        }}
      />
    </div>
  );
}
