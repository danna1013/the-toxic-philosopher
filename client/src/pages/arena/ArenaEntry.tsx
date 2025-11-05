import { useState } from 'react';
import { useLocation } from 'wouter';

export default function ArenaEntry() {
  const [, setLocation] = useLocation();
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
        <div className="px-8 py-5 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="text-xl md:text-2xl font-bold tracking-wide">毒舌哲学家</div>
            <div className="text-xs md:text-sm font-medium tracking-[0.2em] text-gray-300">THE TOXIC PHILOSOPHER</div>
          </div>
          
          <div className="flex items-center gap-8">
            <button
              onClick={() => setLocation("/")}
              className="relative text-lg md:text-xl text-gray-300 hover:text-white transition-colors group"
            >
              首页
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => setLocation("/arena")}
              className="relative text-lg md:text-xl text-white font-medium group"
            >
              思维擂台
              <span className="absolute bottom-0 left-0 w-full h-px bg-white"></span>
            </button>
            <button
              onClick={() => setLocation("/select")}
              className="relative text-lg md:text-xl text-gray-300 hover:text-white transition-colors group"
            >
              一对一开怼
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => setLocation("/design")}
              className="relative text-lg md:text-xl text-gray-300 hover:text-white transition-colors group"
            >
              设计理念
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="pt-32 pb-24 px-8">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 tracking-tight">
            思维擂台-哲学奇葩说
          </h1>
          <p className="text-2xl text-gray-300 font-light">
            让5位伟大的哲学家为你辩论，50位AI观众实时投票
          </p>
        </div>

        {/* 用户状态卡片 */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <p className="text-lg font-medium">未激活用户</p>
                <p className="text-sm text-gray-300">今日剩余: 3次</p>
              </div>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              🔓 激活邀请码
            </button>
          </div>
        </div>

        {/* 模式选择 */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* 基础模式 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/20 hover:border-white/40 transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">基础模式</h2>
              <span className="px-4 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                免费
              </span>
            </div>
            
            <div className="space-y-4 mb-8 text-gray-200">
              <p className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                50分钟快速辩论
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                固定话题: AI会取代人类吗?
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                固定辩手: 5位哲学家
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                观众身份，可发言1次
              </p>
            </div>

            <button
              onClick={() => setLocation("/arena/debate/basic")}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-bold text-lg transition-all transform hover:scale-105"
            >
              开始辩论
            </button>
          </div>

          {/* 完整模式 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/20 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">完整模式</h2>
              <span className="px-4 py-1 bg-yellow-500 text-black rounded-full text-sm font-medium">
                VIP
              </span>
            </div>
            
            <div className="space-y-4 mb-8 text-gray-200">
              <p className="flex items-center gap-2">
                <span className="text-yellow-400">★</span>
                自定义辩题和观点
              </p>
              <p className="flex items-center gap-2">
                <span className="text-yellow-400">★</span>
                自由选择辩手阵营
              </p>
              <p className="flex items-center gap-2">
                <span className="text-yellow-400">★</span>
                选择观众或辩手身份
              </p>
              <p className="flex items-center gap-2">
                <span className="text-yellow-400">★</span>
                更多发言次数
              </p>
            </div>

            <button
              disabled
              className="w-full py-4 bg-gray-600 rounded-xl font-bold text-lg cursor-not-allowed opacity-50 flex items-center justify-center gap-2"
            >
              <span>🔒</span>
              需要邀请码
            </button>

            {/* 锁定遮罩 */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
              <div className="text-6xl opacity-30">🔒</div>
            </div>
          </div>
        </div>

        {/* 功能介绍 */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <p className="text-gray-300 text-lg leading-relaxed">
            每场辩论由50位AI同时运行：5位哲学家 + 1位主持人 + 50位观众
            <br />
            观众会被辩论"说服"而改变投票，你可以选1-2位观众站起来发言
          </p>
        </div>
      </div>

      {/* 邀请码激活弹窗 (占位) */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4">激活邀请码</h3>
            <input
              type="text"
              placeholder="请输入邀请码"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-purple-500 focus:outline-none"
            />
            <div className="flex gap-4">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // TODO: 激活邀请码逻辑
                  setShowInviteModal(false);
                }}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                激活
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
