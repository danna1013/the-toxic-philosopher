import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

// 定义三幕内容
const script = [
  { 
    text: "上帝已死！——我是尼采！", 
    image: "/nietzsche-scene-1-white.png",
    imageAlt: "上帝已死",
  },
  { 
    text: "旧的价值已经崩塌，人必须超越自身，成为超人！", 
    image: "/nietzsche-scene-2-white.png",
    imageAlt: "超人",
  },
  { 
    text: "生命不是忍受，是在命运的深渊上，尽情舞蹈！", 
    image: "/nietzsche-scene-3-white.png",
    imageAlt: "命运之舞",
  },
];

export default function NietzscheIntro() {
  const [, setLocation] = useLocation();
  const [currentScene, setCurrentScene] = useState(0);

  // 跳过按钮
  const handleSkip = () => {
    setLocation('/chat/nietzsche');
  };

  // 下一页按钮 - 直接切换
  const handleNext = () => {
    if (currentScene < script.length - 1) {
      setCurrentScene(prev => prev + 1);
    }
  };

  // 开始对话按钮
  const handleStartChat = () => {
    setLocation('/chat/nietzsche');
  };

  const currentScript = script[currentScene];

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#FAFAFA' }}>
      {/* 跳过按钮 */}
      <button
        onClick={handleSkip}
        className="fixed top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-black transition-colors"
      >
        <span className="text-sm">跳过</span>
        <X className="w-4 h-4" />
      </button>

      {/* 主内容区域 */}
      <div className="relative w-full h-full flex flex-col items-center justify-center px-8">
        {/* 图片容器 */}
        <div className="relative w-full max-w-2xl mb-12" style={{ aspectRatio: '1 / 1' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`image-container-${currentScene}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0"
            >
              <img
                src={currentScript.image}
                alt={currentScript.imageAlt}
                className="w-full h-full object-contain"
                style={{ filter: 'grayscale(100%)' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 文字容器 */}
        <div className="relative w-full max-w-2xl" style={{ minHeight: '200px' }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={`text-${currentScene}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-2xl md:text-3xl text-center text-gray-800 leading-relaxed"
            >
              {currentScript.text}
            </motion.p>
          </AnimatePresence>

          {/* 下一页/开始对话按钮 */}
          <AnimatePresence mode="wait">
            <motion.button
              key={`button-${currentScene}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onClick={currentScene < script.length - 1 ? handleNext : handleStartChat}
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-sm font-light tracking-wider text-gray-400 hover:text-black transition-colors"
            >
              {currentScene < script.length - 1 ? (
                <>
                  <span>下一页</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              ) : (
                <span>开始对话</span>
              )}
            </motion.button>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

