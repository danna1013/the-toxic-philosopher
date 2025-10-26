import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

// 定义字幕和时间轴
const script = [
  { 
    text: "我是苏格拉底，雅典的'牛虻'。", 
    duration: 4000, 
    className: "text-3xl md:text-4xl font-light text-white tracking-wide",
    emotion: "从容"
  },
  { 
    text: "我的使命，就是用问题戳穿所有确定的答案。", 
    duration: 5000, 
    className: "text-4xl md:text-5xl font-bold text-yellow-400 tracking-wider",
    emotion: "犀利"
  },
  { 
    text: "哪怕最终喝下毒酒，也要唤醒雅典对真理的诚实。", 
    duration: 6000, 
    className: "text-3xl md:text-4xl font-serif text-white/95 tracking-wide",
    emotion: "坚定"
  },
];

const totalDuration = script.reduce((acc, item) => acc + item.duration, 0);

export default function SocratesIntro() {
  const [, setLocation] = useLocation();
  const [currentLine, setCurrentLine] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentLine >= script.length) {
      // 所有字幕播放完毕，跳转
      const timer = setTimeout(() => {
        setLocation('/chat/socrates');
      }, 800);
      return () => clearTimeout(timer);
    }

    const { duration } = script[currentLine];
    const nextLineTimer = setTimeout(() => {
      setCurrentLine(prev => prev + 1);
    }, duration);

    return () => clearTimeout(nextLineTimer);
  }, [currentLine, setLocation]);

  // 进度条动画
  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);
      if (newProgress < 100) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      {/* 星空背景 - 复用选择页面的星星 */}
      <div className="absolute inset-0">
        {[...Array(150)].map((_, i) => {
          const size = Math.random();
          const shouldTwinkle = Math.random();
          let twinkleClass = '';
          let twinkleDelay = 0;
          
          if (shouldTwinkle > 0.6) {
            twinkleClass = '';
          } else if (shouldTwinkle > 0.3) {
            twinkleClass = 'animate-twinkle-slow';
            twinkleDelay = Math.random() * 10;
          } else {
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
      </div>

      {/* 中心光晕效果 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(252, 211, 77, 0.15) 0%, rgba(252, 211, 77, 0.05) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 苏格拉底头像 - 淡入后保持 */}
      <motion.div
        className="absolute top-20 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img
          src="/web-socrates.webp"
          alt="苏格拉底"
          className="w-32 h-32 object-contain opacity-60"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(252, 211, 77, 0.4))',
          }}
        />
      </motion.div>

      {/* 字幕容器 */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-8">
        <AnimatePresence mode="wait">
          {currentLine < script.length && (
            <motion.div
              key={currentLine}
              className="text-center max-w-4xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1] // 自定义缓动函数，更流畅
              }}
            >
              <p className={`${script[currentLine].className} leading-relaxed`}>
                {script[currentLine].text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 底部进度条 */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-3/4 max-w-2xl">
        <div className="h-0.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-full"
            style={{
              width: `${progress}%`,
              boxShadow: '0 0 10px rgba(252, 211, 77, 0.5)',
            }}
          />
        </div>
      </div>

      {/* 复用选择页面的动画样式 */}
      <style>{`
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
      `}</style>
    </div>
  );
}

