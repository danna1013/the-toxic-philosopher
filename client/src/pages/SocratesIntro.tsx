import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// 定义三幕内容
const script = [
  { 
    text: "我是苏格拉底，雅典的'牛虻'。", 
    duration: 6000,
    image: "/socrates-scene-1.png",
    imageAlt: "雅典广场"
  },
  { 
    text: "我的使命，就是用问题戳穿所有确定的答案。", 
    duration: 7000,
    image: "/socrates-scene-2.png",
    imageAlt: "质疑与碎片"
  },
  { 
    text: "哪怕最终喝下毒酒，也要唤醒雅典对真理的诚实。", 
    duration: 7500,
    image: "/socrates-scene-3.png",
    imageAlt: "真理之光"
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

  // 墨水扩散入场动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInkTransition(false);
      setShowContent(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // 场景切换逻辑
  useEffect(() => {
    if (!showContent || currentScene >= script.length) return;

    const timer = setTimeout(() => {
      if (currentScene < script.length - 1) {
        setCurrentScene(prev => prev + 1);
      } else {
        // 最后一幕结束，淡出跳转
        setTimeout(() => {
          setLocation('/chat/socrates');
        }, 1000);
      }
    }, script[currentScene].duration);

    return () => clearTimeout(timer);
  }, [currentScene, showContent, setLocation]);

  const currentScript = currentScene < script.length ? script[currentScene] : script[script.length - 1];

  return (
    <div className="fixed inset-0 overflow-hidden bg-white">


      {/* 跳过按钮 */}
      {showContent && (
        <motion.button
          onClick={handleSkip}
          className="absolute top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 transition-colors group"
          style={{ color: '#6D4C41' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ color: '#3E2723' }}
        >
          <span className="text-sm font-medium">跳过</span>
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </motion.button>
      )}

      {/* 墨水扩散入场动画 */}
      <AnimatePresence>
        {showInkTransition && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* 中心墨水扩散 */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  background: `radial-gradient(circle, rgba(193, 68, 14, ${0.3 - i * 0.05}) 0%, transparent 70%)`,
                }}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{
                  width: [0, 800 + i * 200, 1200 + i * 300],
                  height: [0, 800 + i * 200, 1200 + i * 300],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
            
            {/* 墨点飘散 */}
            {[...Array(30)].map((_, i) => {
              const angle = (i / 30) * Math.PI * 2;
              const distance = 200 + Math.random() * 300;
              return (
                <motion.div
                  key={`dot-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: 3 + Math.random() * 6,
                    height: 3 + Math.random() * 6,
                    backgroundColor: '#C1440E',
                  }}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.5 + i * 0.02,
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
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            {/* 古希腊建筑线条装饰 - 顶部 */}
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-1"
              style={{
                background: 'linear-gradient(to right, transparent 0%, #C1440E 50%, transparent 100%)',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.3 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />

            {/* 图片区域 - 克制的淡入和缩放 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene}
                className="w-full flex items-center justify-center relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 2,
                  ease: "easeInOut",
                }}
              >
                {/* 柔和的光晕 - 仅第三幕 */}
                {currentScene === 2 && (
                  <motion.div
                    className="absolute inset-0 -z-10"
                    style={{
                      background: 'radial-gradient(circle, rgba(193, 68, 14, 0.1) 0%, transparent 60%)',
                      filter: 'blur(40px)',
                    }}
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
                
                <img
                  src={currentScript.image}
                  alt={currentScript.imageAlt}
                  className="w-full h-auto max-w-3xl relative"
                  style={{
                    filter: 'contrast(1.05) saturate(0.9)',
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* 文字区域 - 像墨水书写般浮现 */}
            <div className="w-full max-w-4xl relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`text-${currentScene}`}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ 
                    duration: 1.2,
                    delay: 1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <p 
                    className="text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed tracking-wide"
                    style={{ 
                      color: '#2C2416',
                      textShadow: currentScene === 2 ? '0 2px 20px rgba(212, 165, 116, 0.3)' : 'none',
                    }}
                  >
                    {currentScript.text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 古希腊建筑线条装饰 - 底部 */}
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-1"
              style={{
                background: 'linear-gradient(to right, transparent 0%, #C1440E 50%, transparent 100%)',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.3 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />

            {/* 漂浮的纸张纤维粒子 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 1 + Math.random() * 2,
                    height: 1 + Math.random() * 2,
                    backgroundColor: '#C1440E',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -50, 0],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 5 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

