import { useLocation } from "wouter";
import { useState } from "react";

export default function ArenaMode() {
  const [, setLocation] = useLocation();
  const [selectedMode, setSelectedMode] = useState<"basic" | "full" | null>(null);

  const handleContinue = () => {
    if (!selectedMode) {
      alert("请选择一个辩论模式!");
      return;
    }
    
    sessionStorage.setItem("arenaMode", selectedMode);
    setLocation("/arena/topic");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="px-8 py-5 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="text-xl md:text-2xl font-bold tracking-wide">毒舌哲学家</div>
            <div className="text-xs md:text-sm font-medium tracking-[0.2em] text-gray-500">THE TOXIC PHILOSOPHER</div>
          </div>
          
          <div className="flex items-center gap-8">
            <button onClick={() => setLocation("/")} className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group">
              首页
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => setLocation("/select")} className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group">
              一对一开怼
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button className="relative text-lg md:text-xl text-black font-medium group">
              哲学"奇葩说"
              <span className="absolute bottom-0 left-0 w-full h-px bg-black"></span>
            </button>
            <button onClick={() => setLocation("/design")} className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group">
              设计理念
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => window.open("https://forms.gle/feedback", "_blank")} className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group">
              意见反馈
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => window.open("https://forms.gle/review", "_blank")} className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group">
              求点赞评论
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-16">
        {/* 标题 */}
        <div className="text-center mb-16 max-w-5xl">
          <h1 className="text-4xl font-bold text-black mb-4 leading-relaxed">
            如果苏格拉底、尼采、康德、弗洛伊德、维特根斯坦同台辩论，会发生什么？
          </h1>
          <p className="text-xl text-gray-600 mt-6">选择你的辩论模式</p>
        </div>

        {/* 模式卡片 */}
        <div className="flex gap-8 max-w-6xl mb-12">
          {/* 基础模式 */}
          <div 
            onClick={() => setSelectedMode("basic")}
            className={`flex-1 border-2 p-8 cursor-pointer transition-all duration-300 ${
              selectedMode === "basic" 
                ? "bg-white text-black border-black" 
                : "bg-white text-black border-gray-400 hover:border-black"
            }`}
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-3xl font-bold">基础模式</h2>
              <span className="px-4 py-1.5 bg-gray-800 text-white text-sm font-medium">快速体验</span>
            </div>

            <ul className="space-y-3 text-lg mb-6">
              <li className="flex items-start">
                <span className="mr-3 text-green-600 flex-shrink-0">✅</span>
                <span>预设辩题</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-green-600 flex-shrink-0">✅</span>
                <span>AI自动分配阵营</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-green-600 flex-shrink-0">✅</span>
                <span>观众视角观看</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-green-600 flex-shrink-0">✅</span>
                <span>1位AI主持人</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-green-600 flex-shrink-0">✅</span>
                <span>1位AI裁判判定胜负</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-red-600 flex-shrink-0">❌</span>
                <span className="text-gray-400">自定义话题</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-red-600 flex-shrink-0">❌</span>
                <span className="text-gray-400">参与讨论</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-red-600 flex-shrink-0">❌</span>
                <span className="text-gray-400">调整阵营</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-red-600 flex-shrink-0">❌</span>
                <span className="text-gray-400">观众投票</span>
              </li>
            </ul>

            <p className="text-center text-gray-600 text-lg font-medium mt-8">
              基础模式肯定也好玩！
            </p>
          </div>

          {/* 完整模式 */}
          <div 
            onClick={() => setSelectedMode("full")}
            className={`flex-1 border-2 p-8 cursor-pointer transition-all duration-300 ${
              selectedMode === "full" 
                ? "bg-white text-black border-black" 
                : "bg-white text-black border-gray-400 hover:border-black"
            }`}
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-3xl font-bold">完整模式</h2>
              <span className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">限量内测</span>
            </div>

            <ul className="space-y-3 text-lg mb-6">
              <li className="flex items-start">
                <span className="mr-3 text-green-600 flex-shrink-0">✅</span>
                <span>预设辩题</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-green-600 flex-shrink-0">✅</span>
                <span>AI自动分配阵营</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-green-600 flex-shrink-0">✅</span>
                <span>观众视角观看</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-green-600 flex-shrink-0">✅</span>
                <span>1位AI主持人</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-green-600 flex-shrink-0">✅</span>
                <span className="font-semibold">自定义话题</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-green-600 flex-shrink-0">✅</span>
                <span className="font-semibold">观众或参与讨论</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-green-600 flex-shrink-0">✅</span>
                <span className="font-semibold">上帝之手调整阵营</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-green-600 flex-shrink-0">✅</span>
                <span className="font-semibold">50位AI观众</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-green-600 flex-shrink-0">✅</span>
                <span className="font-semibold">奇葩说投票赛制</span>
              </li>
            </ul>

            <p className="text-center text-black text-lg font-bold mt-8">
              完整模式能力更多！57个AI同时运行
            </p>
          </div>
        </div>

        {/* 继续按钮 */}
        <button
          onClick={handleContinue}
          disabled={!selectedMode}
          className="px-16 py-4 bg-black text-white text-xl font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          继续
        </button>

        {/* 底部说明 */}
        <div className="mt-16 text-center text-gray-500 max-w-4xl">
          <p className="text-sm leading-relaxed text-gray-400">
            💡 <a href="https://teko.woa.com/event/ai-agent/246" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">评论10字以上</a>，获取体验码，即可体验完整模式
          </p>
        </div>
      </div>
    </div>
  );
}
