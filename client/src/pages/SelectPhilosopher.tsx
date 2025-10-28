import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

interface Philosopher {
  id: string;
  name: string;
  nameEn: string;
  warning: string;
  description: string;
  image: string;
  size: number;
  top: string;
  color: string;
}

const philosophers: Philosopher[] = [
  {
    id: 'socrates',
    name: '苏格拉底',
    nameEn: 'Socrates',
    warning: '⚠️ 你真的懂吗?',
    description: '古希腊“街头杠精”,专治各种不懂装懂。',
    image: '/web-socrates.webp',
    size: 120,
    top: '5%',
    color: '#fcd34d',
  },
  {
    id: 'nietzsche',
    name: '尼采',
    nameEn: 'Nietzsche',
    warning: '⚠️ 别这么平庸',
    description: '宣布“上帝已死”的哲学摇滚巨星。',
    image: '/web-nietzsche.webp',
    size: 240,
    top: '22%',
    color: '#fb923c',
  },
  {
    id: 'wittgenstein',
    name: '维特根斯坦',
    nameEn: 'Wittgenstein',
    warning: '⚠️ 你的逻辑有问题',
    description: '哲学界的“拆墙工”,专拆语言骗局。',
    image: '/web-wittgenstein.webp',
    size: 300,
    top: '40%',
    color: '#d4a574',
  },
  {
    id: 'kant',
    name: '康德',
    nameEn: 'Kant',
    warning: '⚠️ 你配谈道德吗?',
    description: '准时散步的“哥尼斯堡时钟”,为理性划界。',
    image: '/web-kant.webp',
    size: 200,
    top: '62%',
    color: '#60a5fa',
  },
  {
    id: 'freud',
    name: '弗洛伊德',
    nameEn: 'Freud',
    warning: '⚠️ 你在压抑什么?',
    description: '告诉你“你并不完全是自己的主人”的老爷爷。',
    image: '/web-freud.webp',
    size: 160,
    top: '82%',
    color: '#a78bfa',
  },
];

export default function SelectPhilosopher() {
  const [, setLocation] = useLocation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [explodingId, setExplodingId] = useState<string | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  
  // 检测是否从其他页面返回
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisitedSelect');
    if (hasVisited) {
      setIsReturning(true);
    } else {
      sessionStorage.setItem('hasVisitedSelect', 'true');
    }
  }, []);

  // 预加载所有图片
  useEffect(() => {
    // 设置超时，确保即使图片加载失败也能显示
    const timeout = setTimeout(() => {
      console.log('Image preload timeout, showing images anyway');
      setImagesLoaded(true);
    }, 2000); // 2秒超时

    const imagePromises = philosophers.map((phil) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = phil.image;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        clearTimeout(timeout);
        setImagesLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to preload images:', err);
        clearTimeout(timeout);
        setImagesLoaded(true); // 即使失败也显示
      });

    return () => clearTimeout(timeout);
  }, []);

  const handleSelect = (id: string) => {
    // 触发爆炸动画
    setExplodingId(id);
    
    // 延迟跳转，让粒子爆炸和背景渐变动画播放完
    setTimeout(() => {
      setLocation(`/intro/${id}`);
    }, 2500);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{
      backgroundColor: explodingId ? '#FAFAFA' : '#000000',
      transition: explodingId ? 'background-color 1.8s ease-in-out 0.5s' : 'none',
    }}>
      {/* 星空背景 */}
      <div className="absolute inset-0 overflow-hidden" style={{
        opacity: explodingId ? 0 : 1,
        transition: explodingId ? 'opacity 1.2s ease-out 0.6s' : 'none',
      }}>
        {/* 背景星星 */}
        {[...Array(200)].map((_, i) => {
          const size = Math.random();
          const shouldTwinkle = Math.random();
          let twinkleClass = '';
          let twinkleDelay = 0;
          
          if (shouldTwinkle > 0.6) {
            // 40% 星星保持稳定
            twinkleClass = '';
          } else if (shouldTwinkle > 0.3) {
            // 30% 缓慢闪烁
            twinkleClass = 'animate-twinkle-slow';
            twinkleDelay = Math.random() * 10;
          } else {
            // 30% 快速闪烁
            twinkleClass = 'animate-twinkle-fast';
            twinkleDelay = Math.random() * 10;
          }
          
          return (
            <div
              key={`star-${i}`}
              className={`absolute rounded-full bg-white ${twinkleClass}`}
              style={{
                width: size > 0.7 ? '6px' : size > 0.4 ? '4px' : '2px',
                height: size > 0.7 ? '6px' : size > 0.4 ? '4px' : '2px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: twinkleDelay + 's',
              }}
            />
          );
        })}
                {/* 流星 - 带渐变尾巴,有大有小,有亮有暗 */}
        {[
          { top: 10, left: 20, delay: 0, size: 3, opacity: 1, tailLength: 180 },
          { top: 30, left: 65, delay: 3, size: 2, opacity: 0.7, tailLength: 120 },
          { top: 18, left: 85, delay: 6, size: 2.5, opacity: 0.85, tailLength: 150 },
          { top: 55, left: 25, delay: 9, size: 3.5, opacity: 0.95, tailLength: 200 },
          { top: 78, left: 75, delay: 12, size: 2, opacity: 0.65, tailLength: 110 },
        ].map((meteor, i) => (
          <div
            key={`meteor-${i}`}
            className="absolute animate-meteor"
            style={{
              top: `${meteor.top}%`,
              left: `${meteor.left}%`,
              animationDelay: `${meteor.delay}s`,
            }}
          >
            <div className="relative">
              {/* 流星头部 - 动态大小和亮度 */}
              <div className="bg-white rounded-full relative z-10" style={{
                width: `${meteor.size * 4}px`,
                height: `${meteor.size * 4}px`,
                opacity: meteor.opacity,
                boxShadow: `0 0 ${meteor.size * 3}px ${meteor.size * 1.5}px rgba(255,255,255,${meteor.opacity * 0.8}), 0 0 ${meteor.size * 6}px ${meteor.size * 3}px rgba(255,255,255,${meteor.opacity * 0.4})`,
              }} />
              {/* 流星尾巴 - 动态长度和亮度 */}
              <div className="absolute top-1/2 right-full" style={{
                width: `${meteor.tailLength}px`,
                height: `${meteor.size}px`,
                background: `linear-gradient(to left, rgba(255,255,255,${meteor.opacity * 0.95}) 0%, rgba(255,255,255,${meteor.opacity * 0.7}) 15%, rgba(255,255,255,${meteor.opacity * 0.4}) 40%, rgba(255,255,255,${meteor.opacity * 0.15}) 70%, transparent 100%)`,
                transform: 'translateY(-50%)',
                filter: 'blur(0.5px)',
              }} />
              {/* 尾巴内层 - 动态亮度 */}
              <div className="absolute top-1/2 right-full" style={{
                width: `${meteor.tailLength * 0.67}px`,
                height: `${meteor.size * 0.5}px`,
                background: `linear-gradient(to left, rgba(255,255,255,${meteor.opacity}) 0%, rgba(255,255,255,${meteor.opacity * 0.85}) 20%, rgba(255,255,255,${meteor.opacity * 0.5}) 50%, rgba(255,255,255,${meteor.opacity * 0.15}) 80%, transparent 100%)`,
                transform: 'translateY(-50%)',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* 导航栏 */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6" style={{
        opacity: explodingId ? 0 : 1,
        transition: explodingId ? 'opacity 0.8s ease-out 0.5s' : 'none',
      }}>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg font-bold tracking-wide">毒舌哲学家</h1>
          <p className="text-[10px] font-medium tracking-[0.2em] text-gray-400">THE TOXIC PHILOSOPHER</p>
        </div>
        <div className="flex items-center gap-8 text-sm">
          <a href="/" className="hover:text-gray-300 transition-colors">首页</a>
          <a href="/about" className="hover:text-gray-300 transition-colors">设计理念</a>
          <a href="/select" className="hover:text-gray-300 transition-colors">查见反馈 ↗</a>
          <a href="/chat/socrates" className="hover:text-gray-300 transition-colors">求点赞评论 ↗</a>
        </div>
      </nav>

      {/* 标题 - 分步动画 */}
      <div className="relative z-10 text-center pt-12 pb-8" style={{
        opacity: explodingId ? 0 : 1,
        transition: explodingId ? 'opacity 0.8s ease-out 0.5s' : 'none',
      }}>
        <h1 className={`text-7xl font-bold mb-6 tracking-wider ${isReturning ? '' : 'animate-fadeInStep1'}`}>
          宇宙不在乎你的困惑
        </h1>
        <p className={`text-gray-400 text-4xl tracking-wider font-light ${isReturning ? '' : 'animate-fadeInStep2'}`}>选一个，或者OUT</p>
      </div>

      {/* 竖直发光连接线 */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px transform -translate-x-1/2 z-0" style={{
        opacity: explodingId ? 0 : 1,
        transition: explodingId ? 'opacity 0.8s ease-out 0.5s' : 'none',
      }}>
        <div
          className="w-full h-full"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.6) 20%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.6) 80%, transparent 100%)',
            boxShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3)',
          }}
        />
      </div>

      {/* 星球容器 - 延迟显示 */}
      <div className={`relative min-h-[calc(100vh-280px)] w-full ${isReturning ? '' : 'animate-fadeInStep3'}`} style={{
        opacity: explodingId ? 0 : 1,
        transition: explodingId ? 'opacity 1s ease-out 0.6s' : 'none',
      }}>
        {philosophers.map((phil) => (
          <div
            key={phil.id}
            className="absolute left-1/2 cursor-pointer transition-all duration-500 z-20"
            style={{
              top: phil.top,
              width: phil.size + 'px',
              height: phil.size + 'px',
              transform: `translate(-50%, -50%) scale(${hoveredId === phil.id ? 1.15 : hoveredId && hoveredId !== phil.id ? 0.85 : 1})`,
              opacity: hoveredId && hoveredId !== phil.id ? 0.3 : 1,
              filter: hoveredId && hoveredId !== phil.id ? 'blur(3px)' : 'none',
            }}
            onMouseEnter={() => setHoveredId(phil.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => handleSelect(phil.id)}
          >
            
            {/* 星球图片 */}
            <img
              src={phil.image}
              alt={phil.name}
              className="relative w-full h-full object-contain z-10"
              loading="eager"
              onError={(e) => {
                // WebP加载失败时，尝试加载PNG格式
                const target = e.target as HTMLImageElement;
                if (target.src.endsWith('.webp')) {
                  console.log(`WebP failed for ${phil.id}, trying PNG`);
                  target.src = phil.image.replace('.webp', '.png');
                }
              }}
              style={{
                filter: hoveredId === phil.id ? 'brightness(1.2) drop-shadow(0 0 30px currentColor)' : 'brightness(1) drop-shadow(0 0 10px rgba(255,255,255,0.3))',
                opacity: explodingId === phil.id ? 0 : (imagesLoaded ? 1 : 0),
                transform: explodingId === phil.id ? 'scale(2)' : 'scale(1)',
                transition: explodingId === phil.id ? 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)' : 'filter 0.3s ease, opacity 0.5s ease',
              }}
            />
            
            {/* 黑白墨水扩散动画 */}
            {explodingId === phil.id && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* 中心黑白墨水扩散波纹 - 减弱光晕 */}
                {[...Array(4)].map((_, i) => (
                  <div
                    key={`ink-${i}`}
                    className="absolute rounded-full"
                    style={{
                      background: `radial-gradient(circle, rgba(255, 255, 255, ${0.3 - i * 0.05}) 0%, rgba(255, 255, 255, 0) 70%)`,
                      animation: `inkSpreadBWReduced 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                ))}
                
                {/* 黑白粒子全屏爆炸 - 增强视觉效果 */}
                {[...Array(80)].map((_, i) => {
                  const angle = (i / 80) * Math.PI * 2;
                  const distance = 1000 + Math.random() * 800; // 更远的全屏距离
                  const size = 4 + Math.random() * 10; // 更大的粒子
                  const isWhite = Math.random() > 0.4; // 60%白色，40%黑色
                  return (
                    <div
                      key={`dot-${i}`}
                      className="absolute rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        width: size + 'px',
                        height: size + 'px',
                        backgroundColor: isWhite ? '#FFFFFF' : '#000000',
                        opacity: 0.9,
                        boxShadow: isWhite ? '0 0 8px rgba(255,255,255,0.6)' : '0 0 6px rgba(0,0,0,0.4)',
                        animation: `inkDotBW 2.2s ease-out forwards`,
                        animationDelay: `${0.1 + i * 0.008}s`,
                        '--dot-x': `${Math.cos(angle) * distance}px`,
                        '--dot-y': `${Math.sin(angle) * distance}px`,
                      } as React.CSSProperties}
                    />
                  );
                })}
              </div>
            )}

            {/* 信息卡片 */}
            {hoveredId === phil.id && (
              <div className="absolute left-full ml-12 top-1/2 transform -translate-y-1/2 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-6 w-64 animate-fadeIn">
                <h3 className="text-2xl font-bold mb-1">{phil.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{phil.nameEn}</p>
                <p className="text-yellow-400 text-sm mb-2">{phil.warning}</p>
                <p className="text-gray-300 text-sm mb-4">{phil.description}</p>
                <p className="text-white/60 text-xs">点击进入对话 →</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 底部信息 */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 text-center pb-8 text-xs text-gray-500" style={{
        opacity: explodingId ? 0 : 1,
        transition: explodingId ? 'opacity 0.8s ease-out 0.5s' : 'none',
      }}>
        <p>Made by CSIG 云产品一部 Elisedai · Powered by GPT-4o</p>
      </footer>

      <style>{`
        /* 星星闪烁动画 */
        @keyframes twinkleSlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes twinkleFast {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.9; }
        }
        .animate-twinkle-slow {
          animation: twinkleSlow 5s ease-in-out infinite;
        }
        .animate-twinkle-fast {
          animation: twinkleFast 2.5s ease-in-out infinite;
        }
        
        /* 流星动画 - 从左上到右下 */
        @keyframes meteor {
          0% {
            transform: translate(0, 0) rotate(45deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translate(400px, 400px) rotate(45deg);
            opacity: 0;
          }
        }
        .animate-meteor {
          animation: meteor 3.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) infinite;
          /* 初始状态保持45度旋转 */
          transform: rotate(45deg);
          opacity: 0;
        }
        
        /* 黑白墨水扩散动画 */
        @keyframes inkSpreadBW {
          0% {
            width: 0;
            height: 0;
            opacity: 0;
          }
          30% {
            width: 60vmin;
            height: 60vmin;
            opacity: 0.8;
          }
          100% {
            width: 100vmin;
            height: 100vmin;
            opacity: 0;
          }
        }
        
        /* 黑白墨水全屏扩散动画 */
        @keyframes inkSpreadBWFullscreen {
          0% {
            width: 0;
            height: 0;
            opacity: 0;
          }
          20% {
            width: 120vmin;
            height: 120vmin;
            opacity: 0.9;
          }
          100% {
            width: 300vmin;
            height: 300vmin;
            opacity: 0;
          }
        }
        
        /* 黑白墨水减弱扩散动画 */
        @keyframes inkSpreadBWReduced {
          0% {
            width: 0;
            height: 0;
            opacity: 0;
          }
          25% {
            width: 80vmin;
            height: 80vmin;
            opacity: 0.3;
          }
          100% {
            width: 150vmin;
            height: 150vmin;
            opacity: 0;
          }
        }
        
        /* 黑白墨点飘散动画 */
        @keyframes inkDotBW {
          0% {
            transform: translate(-50%, -50%) translate(0, 0);
            opacity: 0;
          }
          30% {
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--dot-x), var(--dot-y));
            opacity: 0;
          }
        }
        
        /* 分步入场动画 */
        @keyframes fadeInStep1 {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInStep2 {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInStep3 {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        .animate-fadeInStep1 {
          animation: fadeInStep1 0.8s ease-out 0.3s both;
        }
        .animate-fadeInStep2 {
          animation: fadeInStep2 0.8s ease-out 1.3s both;
        }
        .animate-fadeInStep3 {
          animation: fadeInStep3 1s ease-out 2.3s both;
        }
        
        /* 星云和光云动画 */
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.15); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -10px); }
          50% { transform: translate(20px, 0); }
          75% { transform: translate(10px, 10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-10px, 10px); }
          50% { transform: translate(-20px, 0); }
          75% { transform: translate(-10px, -10px); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 10s ease-in-out infinite;
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
        
        /* 信息卡片动画 */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-50%) translateX(20px); }
          to { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* 星球光晕动画 */
        @keyframes glow-pulse {
          0%, 100% { 
            opacity: 0.4; 
            transform: scale(1.08); 
          }
          50% { 
            opacity: 0.6; 
            transform: scale(1.12); 
          }
        }
        @keyframes glow-strong {
          0%, 100% { 
            opacity: 0.6; 
            transform: scale(1.15); 
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.2); 
          }
        }
        .animate-glow-pulse {
          animation: glow-pulse 2.5s ease-in-out infinite;
        }
        .animate-glow-strong {
          animation: glow-strong 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

