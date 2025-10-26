import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

// 定义三幕内容
const script = [
  { 
    text: "我是苏格拉底，雅典的'牛虻'。", 
    image: "/socrates-scene-1.png",
    imageAlt: "雅典广场",
  },
  { 
    text: "我的使命，就是用问题戳穿所有确定的答案。", 
    image: "/socrates-scene-2.png",
    imageAlt: "质疑与碎片",
  },
  { 
    text: "哪怕最终喝下毒酒，也要唤醒雅典对真理的诚实。", 
    image: "/socrates-scene-3.png",
    imageAlt: "真理之光",
  },
];

export default function SocratesIntro() {
  const [, setLocation] = useLocation();
  const [currentScene, setCurrentScene] = useState(0);
  const [showContent, setShowContent] = useState(true);
  const [showText, setShowText] = useState(false);

  // 跳过按钮
  const handleSkip = () => {
    setLocation('/chat/socrates');
  };

  // 下一页按钮 - 即时切换
  const handleNext = () => {
    if (currentScene < script.length - 1) {
      // 直接切换到下一场景，无淡入淡出
      setShowText(false);
      setCurrentScene(prev => prev + 1);
      // 立即显示内容
      setTimeout(() => {
        setShowContent(true);
      }, 0);
    }
  };

  // 开始对话按钮
  const handleStartChat = () => {
    setLocation('/chat/socrates');
  };

  // 图片出现后，文字浮现
  useEffect(() => {
    if (!showContent) return;

    // 第一页：图片出现后0.6秒，文字开始浮现
    // 翻页后：立即显示文字，无延迟
    const delay = currentScene === 0 ? 600 : 0;
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, delay);

    return () => {
      clearTimeout(textTimer);
    };
  }, [currentScene, showContent]);

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

      {/* 主内容区域 */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="h-full flex flex-col items-center justify-center px-8 md:px-16 py-12 gap-12 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* 顶部装饰线 */}
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-px bg-black"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.2 }}
              transition={{ duration: 1, delay: 0.3 }}
            />

            {/* 图片和文字容器 */}
            <div className="w-full flex flex-col items-center justify-center gap-12">
              {/* 图片区域 - 淡入，背景融合 */}
              <motion.div
                key={`image-${currentScene}`}
                className="w-full flex items-center justify-center relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeOut",
                }}
              >
                <div className="relative w-full max-w-3xl">
                  <img
                    src={currentScript.image}
                    alt={currentScript.imageAlt}
                    className="w-full h-auto"
                    style={{
                      filter: 'grayscale(100%) contrast(1.1) brightness(1.05)',
                      mixBlendMode: 'multiply',
                    }}
                  />
                  {/* 渐变遮罩，边缘融入白色背景 */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(250,250,250,0.3) 0%, rgba(250,250,250,0) 20%, rgba(250,250,250,0) 80%, rgba(250,250,250,0.3) 100%), linear-gradient(to right, rgba(250,250,250,0.2) 0%, rgba(250,250,250,0) 15%, rgba(250,250,250,0) 85%, rgba(250,250,250,0.2) 100%)',
                    }}
                  />
                </div>
              </motion.div>

              {/* 文字区域 - 图片出现后从下方向上浮现 */}
              <div className="w-full max-w-4xl relative min-h-[100px] flex items-center justify-center">
                <AnimatePresence>
                  {showText && (
                    <motion.div
                      key={`text-${currentScene}`}
                      className="text-center relative"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 0.6,
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
                      
                      {/* 按钮重新设计 - 居中显示 */}
                      <motion.div
                        className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        {/* 装饰线 */}
                        <div className="w-16 h-px bg-gray-300" />
                        
                        {currentScene < script.length - 1 ? (
                          // 前两页：下一页
                          <button
                            onClick={handleNext}
                            className="flex items-center gap-2 text-gray-400 hover:text-black transition-all duration-300 group"
                            aria-label="下一页"
                          >
                            <span className="text-sm font-light tracking-wider">下一页</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </button>
                        ) : (
                          // 第三页：开始对话按钮
                          <button
                            onClick={handleStartChat}
                            className="text-gray-400 hover:text-black transition-colors duration-300"
                          >
                            <span className="text-sm font-light tracking-wider">开始对话</span>
                          </button>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 底部装饰线 */}
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-px bg-black"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.2 }}
              transition={{ duration: 1, delay: 0.3 }}
            />


          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

