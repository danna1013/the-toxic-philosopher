import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Design() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 顶部导航 */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">返回</span>
          </button>
          <h1 className="text-sm font-medium text-gray-900">设计理念</h1>
          <div className="w-16" /> {/* 占位 */}
        </div>
      </div>

      {/* 主要内容 - 垂直居中 */}
      <div className="flex-1 flex items-center justify-center px-8 py-24">
        <div className="max-w-6xl w-full">
          {/* 标题区域 */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              设计理念
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-px bg-gray-300"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
              <div className="w-12 h-px bg-gray-300"></div>
            </div>
            <p className="text-2xl text-gray-500 font-light italic">
              真相往往不在舒适区
            </p>
          </div>

          {/* 内容网格 - 2x2 布局 */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            {/* 左上：为什么选择"毒舌"？ */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 inline-block">
                为什么选择"毒舌"？
              </h2>
              <p className="text-base text-gray-700 leading-relaxed">
                因为真正的哲学从来不是用来安慰人的。苏格拉底因为揭穿雅典人的无知而被处死，尼采因为宣告"上帝已死"而被视为疯子，维特根斯坦用逻辑的刀子切开了无数哲学家的空话。
              </p>
              <p className="text-base text-gray-900 font-semibold">
                他们不是为了讨好你，而是为了唤醒你。
              </p>
            </div>

            {/* 右上：我们的初衷 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 inline-block">
                我们的初衷
              </h2>
              <p className="text-base text-gray-700 leading-relaxed">
                我们希望通过这个项目，让哲学回归它的本质——<span className="font-semibold text-gray-900">质疑、批判、反思</span>。不是给你答案，而是让你学会提问。不是让你舒服，而是让你成长。
              </p>
            </div>

            {/* 左下：设计哲学 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 inline-block">
                设计哲学
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-sm font-bold text-gray-400 mt-0.5">01</span>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">简洁至上</h3>
                    <p className="text-sm text-gray-600">去除一切多余的装饰，让思想成为唯一的焦点</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-sm font-bold text-gray-400 mt-0.5">02</span>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">直击要害</h3>
                    <p className="text-sm text-gray-600">没有客套，没有铺垫，直接进入核心</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-sm font-bold text-gray-400 mt-0.5">03</span>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">保持距离</h3>
                    <p className="text-sm text-gray-600">不迎合，不讨好，保持哲学应有的批判距离</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右下：致使用者 */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 inline-block">
                致使用者
              </h2>
              <p className="text-base text-gray-700 leading-relaxed">
                如果你只是想要安慰，<span className="font-semibold text-gray-900">请离开</span>。如果你准备好被质疑、被挑战、被"毒舌"，那么，<span className="font-semibold text-gray-900">欢迎来到真相的宇宙</span>。
              </p>
            </div>
          </div>

          {/* 底部签名 */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-xs tracking-[0.3em] text-gray-400 font-medium">
              THE TOXIC PHILOSOPHER
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

