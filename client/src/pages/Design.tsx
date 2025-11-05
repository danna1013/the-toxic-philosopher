import { useLocation } from "wouter";

export default function Design() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="px-8 py-5 flex items-center justify-between">
          {/* 左侧品牌名 - 中英文组合 */}
          <div className="flex flex-col gap-0.5">
            <div className="text-xl md:text-2xl font-bold tracking-wide">毒舌哲学家</div>
            <div className="text-xs md:text-sm font-medium tracking-[0.2em] text-gray-500">THE TOXIC PHILOSOPHER</div>
          </div>
          
          {/* 右侧导航 */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setLocation("/")}
              className="relative text-base md:text-lg text-gray-600 hover:text-black transition-colors group"
            >
              首页
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => setLocation("/arena/mode")}
              className="relative text-base md:text-lg text-gray-600 hover:text-black transition-colors group"
            >
              思维擂台-哲学"奇葩说"
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => setLocation("/select")}
              className="relative text-base md:text-lg text-gray-600 hover:text-black transition-colors group"
            >
              一对一开怼
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => setLocation("/design")}
              className="relative text-base md:text-lg text-black font-medium group"
            >
              设计理念
              <span className="absolute bottom-0 left-0 w-full h-px bg-black"></span>
            </button>
            <a 
              href="https://nops.woa.com/pigeon/v1/tools/add_chat?chatId=ww235627801068712&msgContent=hi%EF%BC%8C%E6%AC%A2%E8%BF%8E%E5%8A%A0%E5%85%A5%E2%80%9C%E6%AF%92%E8%88%8C%E5%93%B2%E5%AD%A6%E5%AE%B6%E2%80%9D%E5%BB%BA%E8%AE%AE%E5%8F%8D%E9%A6%88%E7%BE%A4%EF%BD%9E%20" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative text-base md:text-lg text-gray-600 hover:text-black transition-colors group"
            >
              意见反馈 ↗
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="https://teko.woa.com/event/ai-agent/246" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative text-base md:text-lg text-gray-600 hover:text-black transition-colors group"
            >
              求点赞评论 ↗
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="px-8 pt-32 pb-24">
        {/* 标题 */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            设计理念
          </h1>
          <p className="text-2xl text-gray-500 font-light italic">
            真相往往不在舒适区
          </p>
        </div>

        {/* 内容 */}
        <div className="space-y-16 text-lg text-gray-700 leading-relaxed">
          {/* 引言，使用较宽的宽度 */}
          <p className="max-w-4xl mx-auto text-center text-xl">
            在这个充斥着心灵鸡汤和猜你喜欢的时代，我们创造了一个不同的空间——一个让你直面真相的地方。
          </p>

          {/* 正文内容，使用更窄的宽度 */}
          <div className="max-w-3xl mx-auto space-y-16">
          {/* 为什么选择“毒舌”？ */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              为什么选择"毒舌"？
            </h2>
            <p>
              因为真正的哲学从来不是用来安慰人的。苏格拉底因为揭穿雅典人的无知而被处死，尼采因为宣告"上帝已死"而被视为疯子，维特根斯坦用逻辑的刀子切开了无数哲学家的空话。
            </p>
            <p className="font-medium text-gray-900">
              他们不是为了讨好你，而是为了唤醒你。
            </p>
          </div>

          {/* 我们的初衷 */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              我们的初衷
            </h2>
            <p>
              我们希望通过这个项目，让哲学回归它的本质——质疑、批判、反思。不是给你答案，而是让你学会提问。不是让你舒服，而是让你成长。
            </p>
          </div>

          {/* 设计哲学 */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              设计哲学
            </h2>
            <div className="space-y-4 pl-6 border-l-2 border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">简洁至上</h3>
                <p>去除一切多余的装饰，让思想成为唯一的焦点</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">直击要害</h3>
                <p>没有客套，没有铺垫，直接进入核心</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">保持距离</h3>
                <p>不迎合，不讨好，保持哲学应有的批判距离</p>
              </div>
            </div>
          </div>

          {/* 致使用者 */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              致使用者
            </h2>
            <p>
              如果你只是想要安慰，请离开。如果你准备好被质疑、被挑战、被"毒舌"，那么，欢迎来到真相的宇宙。
            </p>
          </div>

          {/* 底部签名 */}
          <div className="pt-16 text-center border-t border-gray-200">
            <p className="text-xs tracking-[0.3em] text-gray-400 font-medium mb-2">
              THE TOXIC PHILOSOPHER
            </p>
            <p className="text-sm text-gray-400">
              让哲学回归本质
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

