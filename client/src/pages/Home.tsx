import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [isExploding, setIsExploding] = useState(false);
  const [, setLocation] = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [containerHeight, setContainerHeight] = useState('100vh');

  useEffect(() => {
    // 页面加载动画
    setTimeout(() => setIsLoaded(true), 100);
    
    // 检测浏览器对zoom的支持：Chrome/Edge需要166.67vh，Safari使用100vh
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isEdge = /Edg/.test(navigator.userAgent);
    if (isChrome || isEdge) {
      setContainerHeight('166.67vh');
    }
  }, []);

  const handleArenaClick = () => {
    setIsExploding(true);
    setTimeout(() => {
      setLocation("/arena/mode");
    }, 1500);
  };

  const handleChatClick = () => {
    setIsExploding(true);
    setTimeout(() => {
      setLocation("/select");
    }, 1500);
  };

  return (
    <div className={`bg-white flex flex-col relative overflow-hidden transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ height: containerHeight }}>
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="px-8 py-5 flex items-center justify-between">
          {/* 左侧品牌名 - 中英文组合 */}
          <div className="flex flex-col gap-0.5">
            <div className="text-xl md:text-2xl font-bold tracking-wide">毒舌哲学家</div>
            <div className="text-xs md:text-sm font-medium tracking-[0.2em] text-gray-500">THE TOXIC PHILOSOPHER</div>
          </div>
          
          {/* 右侧导航 */}
          <div className="flex items-center gap-8">
            <a href="#home" className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group">
              首页
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
            <button
              onClick={() => setLocation("/select")}
              className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group"
            >
              一对一开怼
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => setLocation("/arena/mode")}
              className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group"
            >
              哲学"奇葩说"
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => setLocation("/design")}
              className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group"
            >
              设计理念
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <a 
              href="https://nops.woa.com/pigeon/v1/tools/add_chat?chatId=ww235627801068712&msgContent=hi%EF%BC%8C%E6%AC%A2%E8%BF%8E%E5%8A%A0%E5%85%A5%E2%80%9C%E6%AF%92%E8%88%8C%E5%93%B2%E5%AD%A6%E5%AE%B6%E2%80%9D%E5%BB%BA%E8%AE%AE%E5%8F%8D%E9%A6%88%E7%BE%A4%EF%BD%9E%20" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group"
            >
              意见反馈 ↗
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="https://teko.woa.com/event/ai-agent/246" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group"
            >
              求点赞评论 ↗
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>
        </div>
      </nav>

      {/* 分层背景设计 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 第一层: 极浅网格纹理 */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 0, 0, .05) 25%, rgba(0, 0, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, .05) 75%, rgba(0, 0, 0, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 0, 0, .05) 25%, rgba(0, 0, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, .05) 75%, rgba(0, 0, 0, .05) 76%, transparent 77%, transparent)',
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* 第二层: 大型几何图案 (远景) */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-[10%] left-[8%] w-40 h-40 border border-black rounded-full animate-float-slow"></div>
          <div className="absolute top-[15%] right-[12%] w-32 h-32 border border-black rotate-12 animate-rotate-slow"></div>
          <div className="absolute bottom-[20%] left-[10%] w-48 h-48 border border-black rounded-full animate-float-slower"></div>
          <div className="absolute bottom-[15%] right-[8%] w-36 h-36 border border-black rotate-45 animate-rotate-slower"></div>
          <div className="absolute top-[40%] right-[35%] w-44 h-44 border border-black rounded-full animate-float-slow"></div>
          <div className="absolute bottom-[45%] left-[15%] w-38 h-38 border border-black rotate-[25deg] animate-rotate-slow"></div>
        </div>
        
        {/* 第三层: 中型几何图案 (中景) */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-[25%] left-[20%] w-24 h-24 border border-black rounded-full animate-float"></div>
          <div className="absolute top-[35%] right-[18%] w-20 h-20 border border-black rotate-[18deg] animate-rotate"></div>
          <div className="absolute bottom-[30%] left-[25%] w-28 h-28 border border-black rounded-full animate-float-slow"></div>
          <div className="absolute bottom-[40%] right-[22%] w-22 h-22 border border-black rotate-[-22deg] animate-rotate-slow"></div>
          <div className="absolute top-[55%] left-[35%] w-26 h-26 border border-black rounded-full animate-float"></div>
          <div className="absolute top-[48%] right-[28%] w-24 h-24 border border-black rotate-[32deg] animate-rotate"></div>
          
          {/* 三角形 */}
          <div className="absolute top-[30%] right-[40%] w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-black rotate-[35deg] animate-float-slow"></div>
          <div className="absolute bottom-[35%] left-[40%] w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[31px] border-b-black rotate-[-20deg] animate-float"></div>
        </div>
        
        {/* 第四层: 小型装饰 (近景) */}
        <div className="absolute inset-0 opacity-[0.08]">
          {/* 小圆点 */}
          <div className="absolute top-[18%] left-[28%] w-3 h-3 bg-black rounded-full animate-pulse-subtle"></div>
          <div className="absolute top-[42%] right-[32%] w-4 h-4 bg-black rounded-full animate-pulse-subtle" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-[28%] left-[42%] w-3 h-3 bg-black rounded-full animate-pulse-subtle" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-[45%] right-[45%] w-4 h-4 bg-black rounded-full animate-pulse-subtle" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-[65%] left-[18%] w-3 h-3 bg-black rounded-full animate-pulse-subtle" style={{animationDelay: '2s'}}></div>
          
          {/* 小线条 */}
          <div className="absolute top-[22%] left-[45%] w-20 h-px bg-black rotate-[25deg]"></div>
          <div className="absolute bottom-[38%] right-[38%] w-24 h-px bg-black rotate-[-35deg]"></div>
          <div className="absolute top-[58%] right-[15%] w-16 h-px bg-black rotate-[15deg]"></div>
          
          {/* 小方形 */}
          <div className="absolute top-[50%] left-[15%] w-12 h-12 border border-black rotate-[15deg] animate-rotate-slow"></div>
          <div className="absolute bottom-[50%] right-[20%] w-14 h-14 border border-black rotate-[-18deg] animate-rotate"></div>
        </div>
      </div>

      {/* 粒子爆炸效果容器 */}
      {isExploding && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="particle absolute"
              style={{
                left: "50%",
                top: "50%",
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
                animation: `explode ${Math.random() * 0.8 + 1.2}s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                animationDelay: `${Math.random() * 0.2}s`,
                transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
                "--tx": `${(Math.random() - 0.5) * 2000}px`,
                "--ty": `${(Math.random() - 0.5) * 2000}px`,
                "--rotation": `${Math.random() * 720 - 360}deg`,
              } as React.CSSProperties}
            >
              <svg viewBox="0 0 20 20" className="w-full h-full">
                <polygon
                  points={
                    Math.random() > 0.5
                      ? "10,0 20,20 0,20"
                      : "0,0 20,0 20,20 0,20"
                  }
                  fill="none"
                  stroke="black"
                  strokeWidth="1"
                />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* 主要内容 */}
      <div
        id="home"
        className={`flex-1 flex flex-col items-center justify-center px-6 md:px-8 py-12 pt-24 md:pt-32 transition-opacity duration-500 relative z-10 ${
          isExploding ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* 主标题区域 - 添加渐入动画 */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20 max-w-6xl animate-fade-in-up">
          <h1 className="font-bold text-black tracking-tight leading-[1.1] mb-4 md:mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
            真相往往不太礼貌
          </h1>
          
          <h2 className="font-light text-gray-600 tracking-tight leading-[1.2] animate-fade-in-up" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', animationDelay: '0.2s' }}>
            但总比谎言有用
          </h2>
        </div>

        {/* 副标题 - 哲学家名字 */}
        <p className="text-lg md:text-xl lg:text-2xl text-gray-500 mb-12 md:mb-16 lg:mb-20 text-center leading-relaxed tracking-wide animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          苏格拉底、尼采、维特根斯坦、康德、弗洛伊德
          <br className="hidden md:block" />
          <span className="md:inline-block md:ml-2">在此等你</span>
        </p>

        {/* Logo区域 */}
        <div className="flex flex-col items-center mb-12 md:mb-16 lg:mb-20 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <img
            src="/logo.png"
            alt="The Toxic Philosopher"
            className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem] 2xl:w-[32rem] 2xl:h-[32rem] object-contain opacity-90 mb-12"
          />
          
          {/* 两个选项按钮 */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
            {/* 一对一开怼 - 左侧 */}
            <div
              className="cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 group flex flex-col items-center"
              onClick={handleChatClick}
            >
              <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm border-2 border-black/10 hover:border-black/30 rounded-2xl px-8 py-6 min-w-[240px] transition-all duration-300 hover:shadow-xl">
                <p className="text-xl md:text-2xl font-bold text-black mb-2 tracking-wide">
                  一对一开怼
                </p>
                <p className="text-sm text-gray-500 tracking-wider">
                  与一位哲学家深入对话
                </p>
              </div>
            </div>
            
            {/* 哲学"奇葩说" - 右侧 */}
            <div
              className="cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 group flex flex-col items-center"
              onClick={handleArenaClick}
            >
              <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm border-2 border-black/10 hover:border-black/30 rounded-2xl px-8 py-6 min-w-[240px] transition-all duration-300 hover:shadow-xl">
                <p className="text-xl md:text-2xl font-bold text-black mb-2 tracking-wide">
                  哲学"奇葩说"
                </p>
                <p className="text-sm text-gray-500 tracking-wider">
                  与5位哲学家同台互怼
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center mt-8">
            <div className="flex items-center gap-2 mb-2">
              
              {/* 向下箭头动画 */}
              <svg 
                className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors animate-bounce" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* 底部区域 */}
        <div className="text-center space-y-5 md:space-y-6 max-w-2xl mb-12 md:mb-0 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          {/* 装饰性分割 */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse-subtle"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse-subtle" style={{animationDelay: '0.5s'}}></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse-subtle" style={{animationDelay: '1s'}}></div>
          </div>

          {/* 品牌名称 */}
          <h3 className="text-base md:text-lg lg:text-xl font-light tracking-[0.35em] text-black uppercase">
            The Toxic Philosopher
          </h3>
          
          {/* 引言和说明 */}
          <div className="space-y-2 md:space-y-3">
            <p className="text-xs md:text-sm text-gray-500 italic tracking-wide">
              "语言是世界的边界"
            </p>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
              让哲学的思考与毒舌的态度陪伴前行中的你
            </p>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <div className="py-6 text-center relative z-10 bg-white">
        <p className="text-xs text-gray-400 tracking-wide">
          Made by CSIG 云产品一部 Elisedai · Powered by GPT-4o
        </p>
      </div>

      <style>{`
        @keyframes explode {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--rotation)) scale(0.5);
            opacity: 0;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }
        
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(3deg);
          }
        }
        
        @keyframes float-slower {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(2deg);
          }
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes rotate-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes rotate-slower {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
        
        .animate-rotate {
          animation: rotate 20s linear infinite;
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 30s linear infinite;
        }
        
        .animate-rotate-slower {
          animation: rotate-slower 40s linear infinite;
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

