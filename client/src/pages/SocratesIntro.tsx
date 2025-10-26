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

// 几何碎片组件
const GeometricFragment = ({ delay = 0, duration = 2 }: { delay?: number; duration?: number }) => {
  const shapes = ['triangle', 'circle', 'square'];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const size = Math.random() * 30 + 10;
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;
  const endX = Math.random() * 400 - 200;
  const endY = Math.random() * 400 - 200;
  const rotation = Math.random() * 720 - 360;

  return (
    <motion.div
      className="absolute"
      style={{
        left: startX,
        top: startY,
        width: size,
        height: size,
      }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0.5],
        x: [0, endX],
        y: [0, endY],
        rotate: [0, rotation],
      }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {shape === 'triangle' && (
        <div className="w-full h-full border-2 border-gray-800" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
      )}
      {shape === 'circle' && (
        <div className="w-full h-full border-2 border-gray-800 rounded-full" />
      )}
      {shape === 'square' && (
        <div className="w-full h-full border-2 border-gray-800" />
      )}
    </motion.div>
  );
};

export default function SocratesIntro() {
  const [, setLocation] = useLocation();
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showFragments, setShowFragments] = useState(false);

  // 跳过按钮处理
  const handleSkip = () => {
    setShowFragments(true);
    setTimeout(() => {
      setLocation('/chat/socrates');
    }, 800);
  };

  // 打字机效果
  useEffect(() => {
    if (currentLine >= script.length) {
      // 所有字幕播放完毕，显示碎片过渡动画
      setShowFragments(true);
      const timer = setTimeout(() => {
        setLocation('/chat/socrates');
      }, 1500);
      return () => clearTimeout(timer);
    }

    const currentText = script[currentLine].text;
    let charIndex = 0;
    setDisplayedText('');
    setIsTyping(true);

    // 打字机效果
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
  }, [currentLine, setLocation]);

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
          {[...Array(30)].map((_, i) => (
            <GeometricFragment key={i} delay={i * 0.03} duration={1.5} />
          ))}
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
            {/* 图片区域 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentLine}
                className="w-full max-w-md flex items-center justify-center relative"
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* 图片背后的光晕效果 */}
                <motion.div
                  className="absolute inset-0 -z-10"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.1, scale: 1.2 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 1 }}
                  style={{
                    background: 'radial-gradient(circle, rgba(74, 74, 74, 0.15) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                  }}
                />
                
                <motion.img
                  src={currentScript.image}
                  alt={currentScript.imageAlt}
                  className="w-full h-auto max-w-sm relative z-10"
                  initial={{ filter: 'blur(10px)' }}
                  animate={{ filter: 'blur(0px)' }}
                  transition={{ duration: 0.8 }}
                />

                {/* 图片切换时的碎片效果 */}
                {currentLine > 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={`frag-${currentLine}-${i}`}
                        className="absolute w-4 h-4 border border-gray-700"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{
                          opacity: 0,
                          scale: 0,
                          x: (Math.random() - 0.5) * 200,
                          y: (Math.random() - 0.5) * 200,
                          rotate: Math.random() * 360,
                        }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* 文字区域 */}
            <div className="w-full max-w-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLine}
                  initial={{ opacity: 0, y: 20 }}
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
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

