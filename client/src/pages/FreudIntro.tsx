import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

// 定义三幕内容
const script = [
  { 
    text: "我，弗洛伊德，闯入了人类心灵的禁区。", 
    image: "/freud-scene-1-white.png",
    imageAlt: "心灵禁区",
  },
  { 
    text: "意识只是海面的冰山，潜意识才是你真正的君王。", 
    image: "/freud-scene-2-white.png",
    imageAlt: "冰山",
  },
  { 
    text: "你的梦境和口误，都在泄露你不敢承认的秘密。", 
    image: "/freud-scene-3-white.png",
    imageAlt: "秘密",
  },
];

export default function FreudIntro() {
  const [, setLocation] = useLocation();
  const [currentScene, setCurrentScene] = useState(0);

  // 跳过按钮
  const handleSkip = () => {
    setLocation('/chat/freud');
  };

  // 下一页按钮 - 直接切换
  const handleNext = () => {
    if (currentScene < script.length - 1) {
      setCurrentScene(prev => prev + 1);
    }
  };

  // 开始对话按钮
  const handleStartChat = () => {
    setLocation('/chat/freud');
  };

  const currentScript = script[currentScene];

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#FAFAFA' }}>
      {/* 跳过按钮 */}
      <button
        onClick={handleSkip}
        className="fixed top-8 right-8 z-50 flex items-center gap-3 px-6 py-3 text-gray-800 hover:text-black transition-colors bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:border-black shadow-sm"
      >
        <span className="text-lg font-medium">跳过</span>
        <X className="w-6 h-6" />
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
              className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-6 py-3 text-gray-800 hover:text-black transition-colors bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:border-black shadow-sm"
            >
              {currentScene < script.length - 1 ? (
                <>
                  <span className="text-lg font-medium">下一页</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              ) : (
                <span className="text-lg font-medium">开始对话</span>
              )}
            </motion.button>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

