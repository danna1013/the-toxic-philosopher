import { useEffect, useState } from 'react';
import { Monitor } from 'lucide-react';

export default function MobileGuide() {
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    // 生成随机星星
    const newStars = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() > 0.7 ? 3 : Math.random() > 0.4 ? 2 : 1,
      delay: Math.random() * 3,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* 星空背景 */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* 主内容 */}
      <div className="relative z-10 text-center max-w-md animate-fadeIn">
        {/* Logo区域 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-wide mb-2">毒舌哲学家</h1>
          <p className="text-xs tracking-[0.3em] text-gray-400">THE TOXIC PHILOSOPHER</p>
        </div>

        {/* 图标 */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center animate-pulse-slow">
            <Monitor className="w-12 h-12" />
          </div>
        </div>

        {/* 主标题 */}
        <h2 className="text-2xl font-bold mb-4 leading-tight">
          请在电脑上<br />体验完整版
        </h2>

        {/* 说明文字 */}
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          为了获得最佳的视觉效果和交互体验，<br />
          我们建议您使用电脑浏览器访问。
        </p>

        {/* 特性列表 */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-300">沉浸式星空选择界面</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-300">5位哲学家的深度对话</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-300">精心设计的视觉动画</p>
            </div>
          </div>
        </div>

        {/* 网址提示 */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-2">PC端访问地址</p>
          <p className="text-sm font-mono text-white break-all">
            {window.location.origin}
          </p>
        </div>

        {/* 底部提示 */}
        <p className="text-xs text-gray-500 mt-8">
          移动端版本正在开发中，敬请期待
        </p>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

