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

  // 下一页按钮
  const handleNext = () => {
    if (currentScene < script.length - 1) {
      // 图片和文字同时淡出
      setShowText(false);
      setShowContent(false);
      
      // 0.5秒后切换到下一场景
      setTimeout(() => {
        setCurrentScene(prev => prev + 1);
        setShowContent(true);
      }, 500);
    }
  };

  // 开始对话按钮
  const handleStartChat = () => {
    setLocation('/chat/socrates');
  };

  // 图片出现后，文字浮现
  useEffect(() => {
    if (!showContent) return;

    // 图片出现后0.6秒，文字开始浮现
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 600);

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
              {/* 图片区域 - 淡入 */}
              <motion.div
                key={`image-${currentScene}`}
                className="w-full flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeOut",
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
                      
                      {/* 按钮移到文字右下方 */}
                      <motion.div
                        className="absolute -bottom-16 right-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                      >
                        {currentScene < script.length - 1 ? (
                          // 前两页：下一页
                          <button
                            onClick={handleNext}
                            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors duration-300"
                            aria-label="下一页"
                          >
                            <span className="text-base font-normal">下一页</span>
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        ) : (
                          // 第三页：开始对话按钮
                          <button
                            onClick={handleStartChat}
                            className="text-gray-500 hover:text-black transition-colors duration-300"
                          >
                            <span className="text-base font-normal">开始对话</span>
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

