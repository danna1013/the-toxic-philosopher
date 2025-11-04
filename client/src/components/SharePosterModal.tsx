import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { X, Download, Copy, Check } from 'lucide-react';
import { downloadImage, copyImageToClipboard } from '../lib/poster-generator';

interface SharePosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  posterDataUrl: string;
}

export function SharePosterModal({ isOpen, onClose, posterDataUrl }: SharePosterModalProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyError, setCopyError] = useState(false);
  
  // 当模态框打开时重置状态
  useEffect(() => {
    if (isOpen) {
      setCopySuccess(false);
      setCopyError(false);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleDownload = () => {
    downloadImage(posterDataUrl, `毒舌哲学家-${Date.now()}.png`);
  };
  
  const handleCopy = async () => {
    console.log('handleCopy 被调用');
    const success = await copyImageToClipboard(posterDataUrl);
    console.log('复制结果:', success);
    if (success) {
      console.log('设置 copySuccess = true');
      flushSync(() => {
        setCopySuccess(true);
        setCopyError(false);
      });
      setTimeout(() => {
        flushSync(() => {
          setCopySuccess(false);
        });
      }, 2000);
    } else {
      console.log('设置 copyError = true');
      flushSync(() => {
        setCopyError(true);
      });
      setTimeout(() => {
        flushSync(() => {
          setCopyError(false);
        });
      }, 3000);
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[98vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题和关闭按钮 */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900">分享海报</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* 海报预览 */}
        <div className="mb-4 overflow-hidden shadow-lg">
          <img 
            src={posterDataUrl} 
            alt="分享海报" 
            className="w-full"
          />
        </div>
        
        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button 
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium text-lg"
          >
            <Download className="w-5 h-5" />
            下载图片
          </button>
          
          <button 
            onClick={handleCopy}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg transition-colors font-medium text-lg ${
              copySuccess 
                ? 'bg-green-500 text-white' 
                : copyError
                ? 'bg-red-500 text-white'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
            }`}
            disabled={copySuccess}
          >
            {copySuccess ? (
              <>
                <Check className="w-5 h-5" />
                已复制
              </>
            ) : copyError ? (
              <>
                <X className="w-5 h-5" />
                不支持
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                复制图片
              </>
            )}
          </button>
        </div>
        
        {copyError && (
          <p className="mt-3 text-sm text-gray-600 text-center">
            您的浏览器不支持复制图片，请下载后分享
          </p>
        )}
      </div>
    </div>
  );
}
