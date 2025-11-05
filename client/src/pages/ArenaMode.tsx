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
              思维擂台-哲学"奇葩说"
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
          <h1 className="text-5xl font-bold text-black mb-4">思维擂台-哲学"奇葩说"</h1>
          <p className="text-xl text-gray-600">选择你的辩论模式</p>
        </div>

        {/* 模式卡片 */}
        <div className="flex gap-8 max-w-6xl">
          {/* 基础模式 */}
          <div className="flex-1 border-2 border-black p-8 hover:shadow-2xl transition-all duration-300 bg-white">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">基础模式</h2>
              <span className="px-3 py-1 border border-black text-sm">快速体验</span>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              固定话题和辩手阵营，快速开启一场辩论。适合初次体验的用户。
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700">
                <span className="mr-2">✓</span>
                预设辩题和阵营
              </li>
              <li className="flex items-center text-gray-700">
                <span className="mr-2">✓</span>
                5位哲学家同台辩论
              </li>
              <li className="flex items-center text-gray-700">
                <span className="mr-2">✓</span>
                观众席观战
              </li>
            </ul>

            <button
              onClick={() => {
                // 基础模式直接进入辩论
                sessionStorage.setItem("arenaMode", "basic");
                sessionStorage.setItem("arenaTopic", "AI会取代人类吗？");
                sessionStorage.setItem("arenaRole", "audience");
                sessionStorage.setItem("arenaProSide", JSON.stringify(["socrates", "kant"]));
                sessionStorage.setItem("arenaConSide", JSON.stringify(["nietzsche", "wittgenstein", "freud"]));
                setLocation("/arena/debate/basic");
              }}
              className="w-full py-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            >
              开始辩论
            </button>
          </div>

          {/* 完整模式 */}
          <div className="flex-1 border-2 border-black p-8 hover:shadow-2xl transition-all duration-300 bg-white">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">完整模式</h2>
              <span className="px-3 py-1 border border-black text-sm bg-black text-white">深度定制</span>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              自由选择话题、身份、阵营。50位AI观众全程观战，完整体验哲学辩论的魅力。
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700">
                <span className="mr-2">✓</span>
                自定义辩论话题
              </li>
              <li className="flex items-center text-gray-700">
                <span className="mr-2">✓</span>
                自由配置哲学家阵营
              </li>
              <li className="flex items-center text-gray-700">
                <span className="mr-2">✓</span>
                选择观众或辩手身份
              </li>
              <li className="flex items-center text-gray-700">
                <span className="mr-2">✓</span>
                50位AI观众全程投票
              </li>
              <li className="flex items-center text-gray-700">
                <span className="mr-2">✓</span>
                选择观众发言互动
              </li>
            </ul>

            <button
              onClick={() => {
                sessionStorage.setItem("arenaMode", "full");
                setLocation("/arena/topic");
              }}
              className="w-full py-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
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
