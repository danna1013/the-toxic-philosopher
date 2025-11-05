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
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black mb-4">哲学"奇葩说"</h1>
          <p className="text-xl text-gray-600">选择你的辩论模式</p>
        </div>

        {/* 模式卡片 */}
        <div className="flex gap-8 max-w-6xl mb-12">
          {/* 基础模式 */}
          <div 
            onClick={() => setSelectedMode("basic")}
            className={`flex-1 border-2 p-8 cursor-pointer transition-all duration-300 ${
              selectedMode === "basic" 
                ? "bg-black text-white border-black" 
                : "bg-white text-black border-gray-400 hover:border-black hover:bg-black hover:text-white"
            }`}
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold">基础模式</h2>
              <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium">免费</span>
            </div>
            
            <p className={`mb-6 leading-relaxed ${selectedMode === "basic" ? "text-gray-200" : "text-gray-600"}`}>
              选择辩题，AI自动分配阵营，快速开启一场辩论。适合初次体验。
            </p>

            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                选择预设辩题
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                AI智能分配哲学家阵营
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                观众视角观看辩论
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                1位AI裁判评判
              </li>
            </ul>
          </div>

          {/* 完整模式 */}
          <div 
            onClick={() => setSelectedMode("full")}
            className={`flex-1 border-2 p-8 cursor-pointer transition-all duration-300 ${
              selectedMode === "full" 
                ? "bg-black text-white border-black" 
                : "bg-white text-black border-gray-400 hover:border-black hover:bg-black hover:text-white"
            }`}
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold">完整模式</h2>
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">内测中</span>
            </div>
            
            <p className={`mb-6 leading-relaxed ${selectedMode === "full" ? "text-gray-200" : "text-gray-600"}`}>
              完全自定义辩题、身份、阵营配置。可以作为辩手参与，与哲学家同台对决。
            </p>

            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                自定义辩论话题
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                自由配置哲学家阵营
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                选择观众或辩手身份
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                50位AI观众全程投票
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                1位AI主持人引导辩论
              </li>
            </ul>
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
          <p className="text-sm leading-relaxed mb-4">
            <strong>完整模式</strong>包含57个AI同时运行：5位哲学家 + 50位观众 + 1位主持人 + 你
          </p>
          <p className="text-sm leading-relaxed text-gray-400">
            💡 评论10字以上，获取体验码，即可体验完整模式
          </p>
        </div>
      </div>
    </div>
  );
}
