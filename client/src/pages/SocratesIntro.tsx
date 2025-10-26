import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// 定义三幕内容 - 统一样式
const script = [
  { 
    text: "我是苏格拉底，雅典的'牛虻'。", 
    duration: 3500,
    image: "/socrates-scene-1.png",
    imageAlt: "雅典广场",
  },
  { 
    text: "我的使命，就是用问题戳穿所有确定的答案。", 
    duration: 3000,
    image: "/socrates-scene-2.png",
    imageAlt: "质疑与碎片",
  },
  { 
    text: "哪怕最终喝下毒酒，也要唤醒雅典对真理的诚实。", 
    duration: 2000,
    image: "/socrates-scene-3.png",
    imageAlt: "真理之光",
  },
];

export default function SocratesIntro() {
  const [, setLocation] = useLocation();
  const [currentScene, setCurrentScene] = useState(0);
  const [showInkTransition, setShowInkTransition] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // 跳过按钮
  const handleSkip = () => {
    setLocation('/chat/socrates');
  };

  // 墨水扩散入场动画 - 1秒
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInkTransition(false);
      setShowContent(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 场景切换逻辑 - 优化流畅度
  useEffect(() => {
    if (!showContent || currentScene >= script.length) return;

    // 当前场景结束，切换到下一场景
    const sceneTimer = setTimeout(() => {
      if (currentScene < script.length - 1) {
        setCurrentScene(prev => prev + 1);
      } else {
        // 最后一幕结束，淡出跳转
        setTimeout(() => {
          setLocation('/chat/socrates');
        }, 1000);
      }
    }, script[currentScene].duration);

    return () => {
      clearTimeout(sceneTimer);
    };
  }, [currentScene, showContent, setLocation]);

  const currentScript = currentScene < script.length ? script[currentScene] : script[script.length - 1];

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#FAFAFA' }}>
      {/* 跳过按钮 */}
      {showContent && (
        <motion.button
          onClick={handleSkip}
          className="absolute top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 text-gray-800 hover:text-black transition-colors group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-sm font-medium">跳过</span>
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </motion.button>
      )}

      {/* 黑白墨水扩散入场动画 - 1秒 */}
      <AnimatePresence>
        {showInkTransition && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center"
            style={{ backgroundColor: '#000000' }}
            exit={{ 
              backgroundColor: '#FAFAFA',
              transition: { duration: 1, ease: "easeInOut" }
            }}
          >
            {/* 中心墨水扩散 - 黑到白 */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  background: `radial-gradient(circle, rgba(255, 255, 255, ${0.9 - i * 0.15}) 0%, rgba(255, 255, 255, 0) 70%)`,
                }}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{
                  width: [0, 400 + i * 200, 800 + i * 300],
                  height: [0, 400 + i * 200, 800 + i * 300],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
            
            {/* 黑白墨点飘散 */}
            {[...Array(30)].map((_, i) => {
              const angle = (i / 30) * Math.PI * 2;
              const distance = 150 + Math.random() * 250;
              const size = 2 + Math.random() * 4;
              const isWhite = Math.random() > 0.5;
              return (
                <motion.div
                  key={`dot-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: isWhite ? '#FFFFFF' : '#000000',
                    opacity: 0.6,
                  }}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.3 + i * 0.01,
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主内容区域 */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="h-full flex flex-col items-center justify-center px-8 md:px-16 py-12 gap-12 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* 顶部装饰线 */}
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-px bg-black"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.2 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            {/* 图片和文字容器 - 交叉淡入淡出 */}
            <div className="w-full flex flex-col items-center justify-center gap-12">
              {/* 图片区域 - 移除阴影和边框 */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`image-${currentScene}`}
                  className="w-full flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <img
                    src={currentScript.image}
                    alt={currentScript.imageAlt}
                    className="w-full h-auto max-w-3xl"
                    style={{
                      filter: 'grayscale(100%) contrast(1.1) brightness(0.95)',
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* 文字区域 - 统一样式，交叉淡入淡出 */}
              <div className="w-full max-w-4xl relative min-h-[100px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`text-${currentScene}`}
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <p 
                      className="text-4xl font-normal tracking-wide leading-relaxed"
                      style={{ 
                        color: '#000000',
                        fontFamily: "'Noto Serif SC', 'LXGW WenKai', serif",
                      }}
                    >
                      {currentScript.text}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* 底部装饰线 */}
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-px bg-black"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.2 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

