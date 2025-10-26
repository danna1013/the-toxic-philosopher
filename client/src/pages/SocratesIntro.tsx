import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// 定义字幕、图片和时间轴
const script = [
  { 
    text: "我是苏格拉底，雅典的'牛虻'。", 
    duration: 5500,
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
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFragments, setShowFragments] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showText, setShowText] = useState(false);

  // 跳过按钮处理
  const handleSkip = () => {
    setShowFragments(true);
    setTimeout(() => {
      setLocation('/chat/socrates');
    }, 800);
  };

  // 图片加载和文字出场的编排
  useEffect(() => {
    if (currentLine >= script.length) {
      // 所有字幕播放完毕，显示碎片过渡动画
      setShowFragments(true);
      const timer = setTimeout(() => {
        setLocation('/chat/socrates');
      }, 1500);
      return () => clearTimeout(timer);
    }

    // 重置状态
    setImageLoaded(false);
    setShowText(false);
    setDisplayedText('');
    setIsTyping(false);

    // 图片加载完成后，延迟显示文字
    const imageLoadTimer = setTimeout(() => {
      setImageLoaded(true);
      // 图片放大动画完成后（1.5s），开始显示文字
      const textShowTimer = setTimeout(() => {
        setShowText(true);
        startTyping();
      }, 1500);
      return () => clearTimeout(textShowTimer);
    }, 100);

    return () => clearTimeout(imageLoadTimer);
  }, [currentLine]);

  // 打字机效果
  const startTyping = () => {
    const currentText = script[currentLine].text;
    let charIndex = 0;
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (charIndex < currentText.length) {
        setDisplayedText(currentText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 150);

    // 当前行显示完成后，等待一段时间再切换到下一行
    const nextLineTimer = setTimeout(() => {
      setCurrentLine(prev => prev + 1);
    }, script[currentLine].duration);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(nextLineTimer);
    };
  };

  if (currentLine >= script.length && !showFragments) {
    return null;
  }

  const currentScript = currentLine < script.length ? script[currentLine] : script[script.length - 1];

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

      {/* 过渡碎片动画 */}
      {showFragments && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          {[...Array(30)].map((_, i) => {
            const angle = (i / 30) * Math.PI * 2;
            const distance = 150 + Math.random() * 100;
            const size = Math.random() * 30 + 10;
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  width: size,
                  height: size,
                }}
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1, 1, 0.5],
                  x: [0, Math.cos(angle) * distance],
                  y: [0, Math.sin(angle) * distance],
                  rotate: [0, Math.random() * 720 - 360],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.03,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div 
                  className="w-full h-full"
                  style={{
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                    backgroundColor: '#fcd34d',
                    boxShadow: '0 0 10px #fcd34d',
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 主内容区域 */}
      <AnimatePresence mode="wait">
        {!showFragments && (
          <motion.div
            key="content"
            className="h-full flex flex-col items-center justify-center px-8 md:px-16 py-12 gap-12 md:gap-16"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
          >
            {/* 图片区域 - 先出现并放大 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLine}
                className="w-full max-w-md flex items-center justify-center relative"
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
                  className="w-full h-auto max-w-sm relative z-10"
                  onLoad={() => setImageLoaded(true)}
                />
              </motion.div>
            </AnimatePresence>

            {/* 文字区域 - 图片稳定后从下方淡入 */}
            <div className="w-full max-w-3xl">
              <AnimatePresence mode="wait">
                {showText && (
                  <motion.div
                    key={`text-${currentLine}`}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                  >
                    <p 
                      className="text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed tracking-wide"
                      style={{ color: '#4A4A4A' }}
                    >
                      {displayedText}
                      {isTyping && (
                        <motion.span
                          className="inline-block w-0.5 h-7 md:h-9 ml-1"
                          style={{ backgroundColor: '#4A4A4A' }}
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

