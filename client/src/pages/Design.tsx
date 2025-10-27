import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Design() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航 */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* 标题 */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            设计理念
          </h1>
          <p className="text-2xl text-gray-600 font-light">
            真相往往不在舒适区
          </p>
        </div>

        {/* 内容区域 */}
        <div className="space-y-16">
          {/* 第一段 */}
          <section>
            <p className="text-lg text-gray-700 leading-[2] mb-6">
              在这个充斥着心灵鸡汤和虚假安慰的时代，我们创造了一个不同的空间——一个让你直面真相的地方。
            </p>
          </section>

          {/* 为什么选择"毒舌"？ */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              为什么选择"毒舌"？
            </h2>
            <p className="text-lg text-gray-700 leading-[2] mb-6">
              因为真正的哲学从来不是用来安慰人的。苏格拉底因为揭穿雅典人的无知而被处死，尼采因为宣告"上帝已死"而被视为疯子，维特根斯坦用逻辑的刀子切开了无数哲学家的空话。
            </p>
            <p className="text-lg text-gray-700 leading-[2]">
              他们不是为了讨好你，而是为了唤醒你。
            </p>
          </section>

          {/* 我们的初衷 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              我们的初衷
            </h2>
            <p className="text-lg text-gray-700 leading-[2]">
              我们希望通过这个项目，让哲学回归它的本质——质疑、批判、反思。不是给你答案，而是让你学会提问。不是让你舒服，而是让你成长。
            </p>
          </section>

          {/* 设计哲学 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              设计哲学
            </h2>
            <div className="space-y-8">
              <div className="border-l-2 border-gray-900 pl-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  简洁至上
                </h3>
                <p className="text-lg text-gray-600 leading-[2]">
                  去除一切多余的装饰，让思想成为唯一的焦点
                </p>
              </div>
              <div className="border-l-2 border-gray-900 pl-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  直击要害
                </h3>
                <p className="text-lg text-gray-600 leading-[2]">
                  没有客套，没有铺垫，直接进入核心
                </p>
              </div>
              <div className="border-l-2 border-gray-900 pl-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  保持距离
                </h3>
                <p className="text-lg text-gray-600 leading-[2]">
                  不迎合，不讨好，保持哲学应有的批判距离
                </p>
              </div>
            </div>
          </section>

          {/* 致使用者 */}
          <section className="pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              致使用者
            </h2>
            <p className="text-lg text-gray-700 leading-[2]">
              如果你只是想要安慰，请离开。如果你准备好被质疑、被挑战、被"毒舌"，那么，欢迎来到真相的宇宙。
            </p>
          </section>

          {/* 分隔线 */}
          <div className="border-t border-gray-200 pt-12">
            <p className="text-center text-sm text-gray-400">
              THE TOXIC PHILOSOPHER
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

