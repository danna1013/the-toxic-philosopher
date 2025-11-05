import { useLocation } from "wouter";

export default function ArenaMode() {
  const [, setLocation] = useLocation();

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
            <button className="relative text-lg md:text-xl text-black font-medium group">
              哲学"奇葩说"
              <span className="absolute bottom-0 left-0 w-full h-px bg-black"></span>
            </button>
            <button onClick={() => setLocation("/select")} className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group">
              一对一开怼
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => setLocation("/design")} className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group">
              设计理念
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
        <div className="flex gap-8 max-w-6xl">
          {/* 基础模式 */}
          <div className="flex-1 border-2 border-black p-8 hover:shadow-2xl hover:bg-black transition-all duration-300 bg-white group flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-black group-hover:text-white transition-colors">基础模式</h2>
              <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium">免费</span>
            </div>
            
            <p className="text-gray-600 group-hover:text-gray-200 mb-6 leading-relaxed transition-colors">
              选择辩题，AI自动分配阵营，快速开启一场辩论。适合初次体验。
            </p>

            <ul className="space-y-3 mb-auto flex-1">
              <li className="flex items-center text-gray-700 group-hover:text-gray-200 transition-colors">
                <span className="mr-2">✓</span>
                选择或自定义辩题
              </li>
              <li className="flex items-center text-gray-700 group-hover:text-gray-200 transition-colors">
                <span className="mr-2">✓</span>
                AI智能分配哲学家阵营
              </li>
              <li className="flex items-center text-gray-700 group-hover:text-gray-200 transition-colors">
                <span className="mr-2">✓</span>
                观众视角观看辩论
              </li>
              <li className="flex items-center text-gray-700 group-hover:text-gray-200 transition-colors">
                <span className="mr-2">✓</span>
                50位AI观众实时投票
              </li>
            </ul>

            <button
              onClick={() => {
                // 基础模式也要选择辩题
                sessionStorage.setItem("arenaMode", "basic");
                setLocation("/arena/topic");
              }}
              className="w-full py-4 bg-black group-hover:bg-white text-white group-hover:text-black font-medium transition-colors mt-6"
            >
              选择辩题
            </button>
          </div>

          {/* 完整模式 */}
          <div className="flex-1 border-2 border-black p-8 hover:shadow-2xl hover:bg-black transition-all duration-300 bg-white group flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-black group-hover:text-white transition-colors">完整模式</h2>
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">内测中</span>
            </div>
            
            <p className="text-gray-600 group-hover:text-gray-200 mb-6 leading-relaxed transition-colors">
              完全自定义辩题、身份、阵营配置。可以作为辩手参与，与哲学家同台对决。
            </p>

            <ul className="space-y-3 mb-auto flex-1">
              <li className="flex items-center text-gray-700 group-hover:text-gray-200 transition-colors">
                <span className="mr-2">✓</span>
                自定义辩论话题
              </li>
              <li className="flex items-center text-gray-700 group-hover:text-gray-200 transition-colors">
                <span className="mr-2">✓</span>
                自由配置哲学家阵营
              </li>
              <li className="flex items-center text-gray-700 group-hover:text-gray-200 transition-colors">
                <span className="mr-2">✓</span>
                选择观众或辩手身份
              </li>
              <li className="flex items-center text-gray-700 group-hover:text-gray-200 transition-colors">
                <span className="mr-2">✓</span>
                50位AI观众全程投票
              </li>
              <li className="flex items-center text-gray-700 group-hover:text-gray-200 transition-colors">
                <span className="mr-2">✓</span>
                选择观众发言互动
              </li>
            </ul>

            <button
              onClick={() => {
                sessionStorage.setItem("arenaMode", "full");
                setLocation("/arena/topic");
              }}
              className="w-full py-4 bg-black group-hover:bg-white text-white group-hover:text-black font-medium transition-colors mt-6"
            >
              开始配置
            </button>
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-16 text-center text-gray-500 max-w-4xl">
          <p className="text-sm leading-relaxed">
            57个AI同时运行：5位哲学家 + 50位观众 + 1位主持人 + 你。
            <br />
            观众会被辩论"说服"而改变立场，你可以选择1-2位观众站起来发言。
          </p>
        </div>
      </div>
    </div>
  );
}
