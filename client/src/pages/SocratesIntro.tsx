import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// 定义字幕、图片和时间轴
const script = [
  { 
    text: "我是苏格拉底，雅典的'牛虻'。", 
    duration: 6000,
    image: "/socrates-scene-1.png",
    imageAlt: "雅典广场",
    theme: "calm" // 从容
  },
  { 
    text: "我的使命，就是用问题戳穿所有确定的答案。", 
    duration: 7000,
    image: "/socrates-scene-2.png",
    imageAlt: "质疑与碎片",
    theme: "intense" // 犀利
  },
  { 
    text: "哪怕最终喝下毒酒，也要唤醒雅典对真理的诚实。", 
    duration: 7500,
    image: "/socrates-scene-3.png",
    imageAlt: "真理之光",
    theme: "serene" // 平静坚定
  },
];

export default function SocratesIntro() {
  const [, setLocation] = useLocation();
  const [currentScene, setCurrentScene] = useState(0);
  const [showPortal, setShowPortal] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [imageFragments, setImageFragments] = useState<boolean>(false);
  const [exitAnimation, setExitAnimation] = useState(false);

  // 跳过按钮处理
  const handleSkip = () => {
    setExitAnimation(true);
    setTimeout(() => {
      setLocation('/chat/socrates');
    }, 1200);
  };

  // 初始传送门动画
  useEffect(() => {
    const portalTimer = setTimeout(() => {
      setShowPortal(false);
      setShowContent(true);
    }, 2500);

    return () => clearTimeout(portalTimer);
  }, []);

  // 场景切换逻辑
  useEffect(() => {
    if (!showContent || currentScene >= script.length) return;

    // 如果不是第一个场景，显示碎片过渡
    if (currentScene > 0) {
      setImageFragments(true);
      const fragmentTimer = setTimeout(() => {
        setImageFragments(false);
      }, 1500);
      return () => clearTimeout(fragmentTimer);
    }

    const sceneTimer = setTimeout(() => {
      if (currentScene < script.length - 1) {
        setCurrentScene(prev => prev + 1);
      } else {
        // 最后一幕结束，开始退出动画
        setExitAnimation(true);
        setTimeout(() => {
          setLocation('/chat/socrates');
        }, 1500);
      }
    }, script[currentScene].duration);

    return () => clearTimeout(sceneTimer);
  }, [currentScene, showContent, setLocation]);

  const currentScript = currentScene < script.length ? script[currentScene] : script[script.length - 1];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-100 to-white overflow-hidden">
      {/* 跳过按钮 */}
      {!exitAnimation && (
        <motion.button
          onClick={handleSkip}
          className="absolute top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors group"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <span className="text-sm font-medium">跳过</span>
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </motion.button>
      )}

      {/* 传送门入场动画 */}
      <AnimatePresence>
        {showPortal && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 汇聚的星星碎片形成传送门 */}
            <motion.div
              className="relative w-96 h-96"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* 发光的圆形传送门 */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(252, 211, 77, 0.8) 0%, rgba(252, 211, 77, 0.3) 50%, transparent 70%)',
                  boxShadow: '0 0 80px rgba(252, 211, 77, 0.6), inset 0 0 80px rgba(252, 211, 77, 0.4)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* 旋转的星星碎片 */}
              {[...Array(20)].map((_, i) => {
                const angle = (i / 20) * Math.PI * 2;
                const radius = 180;
                return (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: '50%',
                      top: '50%',
                      width: '16px',
                      height: '16px',
                    }}
                    initial={{
                      x: Math.cos(angle) * radius * 2,
                      y: Math.sin(angle) * radius * 2,
                      opacity: 0,
                    }}
                    animate={{
                      x: Math.cos(angle) * radius,
                      y: Math.sin(angle) * radius,
                      opacity: [0, 1, 1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                        backgroundColor: '#fcd34d',
                        boxShadow: '0 0 10px #fcd34d',
                      }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>

            {/* 速度线效果 */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, delay: 1.5 }}
            >
              {[...Array(30)].map((_, i) => {
                const angle = (i / 30) * Math.PI * 2;
                return (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2 w-1 bg-gradient-to-r from-yellow-400 to-transparent"
                    style={{
                      height: '2px',
                      transformOrigin: 'left center',
                      transform: `rotate(${angle}rad)`,
                    }}
                    animate={{
                      scaleX: [0, 200, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: 1.5 + i * 0.02,
                      ease: "easeOut",
                    }}
                  />
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主内容区域 */}
      <AnimatePresence>
        {showContent && !exitAnimation && (
          <motion.div
            key="main-content"
            className="h-full flex flex-col items-center justify-center px-8 md:px-16 py-12 gap-8 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 背景漂浮粒子 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gray-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* 场景切换的碎片动画 */}
            <AnimatePresence>
              {imageFragments && (
                <div className="absolute inset-0 z-30 pointer-events-none">
                  {[...Array(30)].map((_, i) => {
                    const angle = (i / 30) * Math.PI * 2;
                    const distance = 200 + Math.random() * 100;
                    const size = 20 + Math.random() * 30;
                    return (
                      <motion.div
                        key={i}
                        className="absolute left-1/2 top-1/2"
                        style={{
                          width: size,
                          height: size,
                        }}
                        initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0 }}
                        animate={{
                          x: [0, Math.cos(angle) * distance, 0],
                          y: [0, Math.sin(angle) * distance, 0],
                          opacity: [0, 1, 1, 0],
                          rotate: [0, Math.random() * 360, Math.random() * 720],
                          scale: [0, 1, 1, 0.5],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.02,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundColor: currentScene === 2 ? '#fcd34d' : '#9ca3af',
                            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                            boxShadow: currentScene === 2 ? '0 0 20px #fcd34d' : 'none',
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>

            {/* 图片区域 - 电影级入场 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene}
                className="w-full flex items-center justify-center relative z-20"
                initial={{ 
                  opacity: 0, 
                  scale: 0.5,
                  z: -500,
                  filter: 'blur(20px)',
                }}
                animate={{ 
                  opacity: 1, 
                  scale: currentScene === 2 ? 1.05 : 1,
                  z: 0,
                  filter: 'blur(0px)',
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8,
                  rotateY: currentScene < 2 ? 90 : 0,
                }}
                transition={{ 
                  duration: 2, 
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* 光晕效果 - 第三幕特别强 */}
                {currentScene === 2 && (
                  <motion.div
                    className="absolute inset-0 -z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: [0.3, 0.6, 0.3], 
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      background: 'radial-gradient(circle, rgba(252, 211, 77, 0.4) 0%, transparent 70%)',
                      filter: 'blur(60px)',
                    }}
                  />
                )}
                
                <motion.img
                  src={currentScript.image}
                  alt={currentScript.imageAlt}
                  className="w-full h-auto max-w-3xl relative z-10"
                  animate={{
                    scale: currentScene === 0 ? [1, 1.02, 1] : 1,
                  }}
                  transition={{
                    duration: 4,
                    repeat: currentScene === 0 ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* 文字区域 - 从图片中浮现 */}
            <div className="w-full max-w-4xl relative z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`text-${currentScene}`}
                  className="text-center relative"
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 1.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* 文字光效 - 第三幕 */}
                  {currentScene === 2 && (
                    <motion.div
                      className="absolute inset-0 -z-10"
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      style={{
                        background: 'radial-gradient(ellipse, rgba(252, 211, 77, 0.3) 0%, transparent 70%)',
                        filter: 'blur(30px)',
                      }}
                    />
                  )}
                  
                  <motion.p 
                    className="text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed tracking-wide relative"
                    style={{ 
                      color: currentScene === 2 ? '#92400e' : '#4A4A4A',
                      textShadow: currentScene === 2 ? '0 0 20px rgba(252, 211, 77, 0.3)' : 'none',
                    }}
                    animate={{
                      scale: currentScene === 1 ? [1, 1.02, 1] : 1,
                    }}
                    transition={{
                      duration: 3,
                      repeat: currentScene === 1 ? Infinity : 0,
                    }}
                  >
                    {currentScript.text}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 退出动画 - 溶解成光粒子 */}
      <AnimatePresence>
        {exitAnimation && (
          <motion.div
            className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(100)].map((_, i) => {
              const angle = (i / 100) * Math.PI * 2;
              const distance = 50 + Math.random() * 300;
              const size = 4 + Math.random() * 8;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: size,
                    height: size,
                    backgroundColor: '#fcd34d',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px #fcd34d',
                  }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: [1, 0],
                    scale: [1, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.005,
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

