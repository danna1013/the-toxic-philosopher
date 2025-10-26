import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// 定义字幕、图片和时间轴
const script = [
  { 
    text: "我是苏格拉底，雅典的'牛虻'。", 
    duration: 5000,
    image: "/socrates-scene-1.png",
    imageAlt: "雅典广场"
  },
  { 
    text: "我的使命，就是用问题戳穿所有确定的答案。", 
    duration: 6000,
    image: "/socrates-scene-2.png",
    imageAlt: "质疑与碎片"
  },
  { 
    text: "哪怕最终喝下毒酒，也要唤醒雅典对真理的诚实。", 
    duration: 6500,
    image: "/socrates-scene-3.png",
    imageAlt: "真理之光"
  },
];

export default function SocratesIntro() {
  const [, setLocation] = useLocation();
  const [currentLine, setCurrentLine] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showText, setShowText] = useState(false);

  // 跳过按钮处理
  const handleSkip = () => {
    setLocation('/chat/socrates');
  };

  // 图片加载和文字出场的编排
  useEffect(() => {
    if (currentLine >= script.length) {
      // 所有字幕播放完毕，直接淡出跳转
      const timer = setTimeout(() => {
        setLocation('/chat/socrates');
      }, 800);
      return () => clearTimeout(timer);
    }

    // 重置状态
    setImageLoaded(false);
    setShowText(false);

    // 图片加载完成后，延迟显示文字
    const imageLoadTimer = setTimeout(() => {
      setImageLoaded(true);
      // 图片放大动画完成后（1.5s），开始显示文字
      const textShowTimer = setTimeout(() => {
        setShowText(true);
      }, 1500);
      return () => clearTimeout(textShowTimer);
    }, 100);

    // 当前行显示完成后，等待一段时间再切换到下一行
    const nextLineTimer = setTimeout(() => {
      setCurrentLine(prev => prev + 1);
    }, script[currentLine].duration);

    return () => {
      clearTimeout(imageLoadTimer);
      clearTimeout(nextLineTimer);
    };
  }, [currentLine, setLocation]);

  if (currentLine >= script.length) {
    return null;
  }

  const currentScript = script[currentLine];

  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      {/* 跳过按钮 */}
      <motion.button
        onClick={handleSkip}
        className="absolute top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-800 transition-colors group"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <span className="text-sm font-medium">跳过</span>
        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>

      {/* 主内容区域 */}
      <motion.div
        key="content"
        className="h-full flex flex-col items-center justify-center px-8 md:px-16 py-12 gap-8 md:gap-12"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* 图片区域 - 先出现并放大 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLine}
            className="w-full flex items-center justify-center relative"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ 
              opacity: imageLoaded ? 1 : 0, 
              scale: imageLoaded ? 1 : 0.3,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 1.5, 
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* 图片背后的光晕效果 */}
            <motion.div
              className="absolute inset-0 -z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: imageLoaded ? 0.1 : 0, scale: imageLoaded ? 1.2 : 0.5 }}
              transition={{ duration: 1.2 }}
              style={{
                background: 'radial-gradient(circle, rgba(74, 74, 74, 0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            
            <img
              src={currentScript.image}
              alt={currentScript.imageAlt}
              className="w-full h-auto max-w-2xl relative z-10"
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
        </AnimatePresence>

        {/* 文字区域 - 图片稳定后从下方淡入，直接完整显示 */}
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {showText && (
              <motion.div
                key={`text-${currentLine}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <p 
                  className="text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed tracking-wide"
                  style={{ color: '#4A4A4A' }}
                >
                  {currentScript.text}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

