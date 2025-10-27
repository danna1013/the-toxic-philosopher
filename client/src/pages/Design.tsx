import { useLocation } from "wouter";
import { ArrowLeft, Quote } from "lucide-react";

export default function Design() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航 */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
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

      {/* 主要内容 */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        {/* Hero 区域 - 大标题 + 装饰线 */}
        <div className="text-center mb-32 relative">
          {/* 装饰性引号 */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-5">
            <Quote className="w-32 h-32 text-gray-900" />
          </div>
          
          <div className="relative">
            <h1 className="text-7xl font-bold text-gray-900 mb-8 tracking-tight">
              设计理念
            </h1>
            {/* 装饰线 */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-px bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-900"></div>
              <div className="w-16 h-px bg-gray-300"></div>
            </div>
            <p className="text-3xl text-gray-600 font-light italic">
              真相往往不在舒适区
            </p>
          </div>
        </div>

        {/* 引言 - 大字体突出显示 */}
        <div className="mb-32">
          <blockquote className="text-2xl text-gray-800 leading-[2] text-center max-w-4xl mx-auto font-light border-l-4 border-r-4 border-gray-200 py-12 px-16">
            在这个充斥着心灵鸡汤和虚假安慰的时代，<br />
            我们创造了一个不同的空间——<br />
            <span className="font-medium text-gray-900">一个让你直面真相的地方。</span>
          </blockquote>
        </div>

        {/* 内容区域 - 卡片式布局 */}
        <div className="space-y-24">
          {/* 为什么选择"毒舌"？ */}
          <section className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
              <div className="inline-block">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  为什么选择
                </h2>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  "毒舌"？
                </h2>
                <div className="w-24 h-1 bg-gray-900"></div>
              </div>
            </div>
            <div className="space-y-6 text-lg text-gray-700 leading-[2]">
              <p>
                因为真正的哲学从来不是用来安慰人的。苏格拉底因为揭穿雅典人的无知而被处死，尼采因为宣告"上帝已死"而被视为疯子，维特根斯坦用逻辑的刀子切开了无数哲学家的空话。
              </p>
              <p className="font-medium text-gray-900 text-xl">
                他们不是为了讨好你，而是为了唤醒你。
              </p>
            </div>
          </section>

          {/* 分隔线 */}
          <div className="flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <div className="w-32 h-px bg-gray-200 mx-4"></div>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            <div className="w-32 h-px bg-gray-200 mx-4"></div>
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          </div>

          {/* 我们的初衷 */}
          <section className="bg-gray-50 -mx-6 px-6 md:-mx-12 md:px-12 py-20 rounded-3xl">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">
                我们的初衷
              </h2>
              <p className="text-xl text-gray-700 leading-[2]">
                我们希望通过这个项目，让哲学回归它的本质——<span className="font-semibold text-gray-900">质疑、批判、反思</span>。不是给你答案，而是让你学会提问。不是让你舒服，而是让你成长。
              </p>
            </div>
          </section>

          {/* 设计哲学 - 三栏卡片 */}
          <section className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                设计哲学
              </h2>
              <p className="text-lg text-gray-600">
                三个核心原则，构建我们的设计语言
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* 卡片 1 */}
              <div className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-900 transition-all duration-300 hover:shadow-xl">
                <div className="absolute -top-4 left-8 bg-white px-4">
                  <span className="text-5xl font-bold text-gray-200 group-hover:text-gray-900 transition-colors">
                    01
                  </span>
                </div>
                <div className="mt-8 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    简洁至上
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    去除一切多余的装饰，让思想成为唯一的焦点
                  </p>
                </div>
              </div>

              {/* 卡片 2 */}
              <div className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-900 transition-all duration-300 hover:shadow-xl">
                <div className="absolute -top-4 left-8 bg-white px-4">
                  <span className="text-5xl font-bold text-gray-200 group-hover:text-gray-900 transition-colors">
                    02
                  </span>
                </div>
                <div className="mt-8 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    直击要害
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    没有客套，没有铺垫，直接进入核心
                  </p>
                </div>
              </div>

              {/* 卡片 3 */}
              <div className="group relative bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-900 transition-all duration-300 hover:shadow-xl">
                <div className="absolute -top-4 left-8 bg-white px-4">
                  <span className="text-5xl font-bold text-gray-200 group-hover:text-gray-900 transition-colors">
                    03
                  </span>
                </div>
                <div className="mt-8 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    保持距离
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    不迎合，不讨好，保持哲学应有的批判距离
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 致使用者 - 黑色背景突出 */}
          <section className="bg-gray-900 -mx-6 px-6 md:-mx-12 md:px-12 py-20 rounded-3xl text-white">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl font-bold text-center">
                致使用者
              </h2>
              <div className="h-px bg-white/20 max-w-xs mx-auto"></div>
              <p className="text-xl leading-[2] text-center text-gray-300">
                如果你只是想要安慰，<span className="text-white font-semibold">请离开</span>。<br />
                如果你准备好被质疑、被挑战、被"毒舌"，<br />
                那么，<span className="text-white font-semibold">欢迎来到真相的宇宙</span>。
              </p>
            </div>
          </section>

          {/* 底部签名 */}
          <div className="pt-16 pb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-px bg-gray-300"></div>
              <p className="text-xs tracking-[0.3em] text-gray-400 font-medium">
                THE TOXIC PHILOSOPHER
              </p>
              <div className="w-12 h-px bg-gray-300"></div>
            </div>
            <p className="text-center text-xs text-gray-400">
              让哲学回归本质
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

