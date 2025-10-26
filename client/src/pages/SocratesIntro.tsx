import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// 定义字幕、图片和时间轴
const script = [
  { 
    text: "我是苏格拉底，雅典的'牛虻'。", 
    duration: 5500, // 增加停顿时间
    image: "/socrates-intro-1-new.png",
    imageAlt: "苏格拉底侧面像"
  },
  { 
    text: "我的使命，就是用问题戳穿所有确定的答案。", 
    duration: 7000,
    image: "/socrates-intro-2-new.png",
    imageAlt: "苏格拉底思考"
  },
  { 
    text: "哪怕最终喝下毒酒，也要唤醒雅典对真理的诚实。", 
    duration: 7500,
    image: "/socrates-intro-3-new.png",
    imageAlt: "苏格拉底与毒酒"
  },
];

export default function SocratesIntro() {
  const [, setLocation] = useLocation();
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // 跳过按钮处理
  const handleSkip = () => {
    setLocation('/chat/socrates');
  };

  // 打字机效果
  useEffect(() => {
    if (currentLine >= script.length) {
      // 所有字幕播放完毕，跳转
      const timer = setTimeout(() => {
        setLocation('/chat/socrates');
      }, 1200);
      return () => clearTimeout(timer);
    }

    const currentText = script[currentLine].text;
    let charIndex = 0;
    setDisplayedText('');
    setIsTyping(true);

    // 打字机效果：逐字显示，速度放慢
    const typingInterval = setInterval(() => {
      if (charIndex < currentText.length) {
        setDisplayedText(currentText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 150); // 从80ms增加到150ms，营造庄严感

    // 当前行显示完成后，等待一段时间再切换到下一行
    const nextLineTimer = setTimeout(() => {
      setCurrentLine(prev => prev + 1);
    }, script[currentLine].duration);

    return () => {
      clearInterval(typingInterval);
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

      {/* 主内容区域 - 上下布局 */}
      <div className="h-full flex flex-col items-center justify-center px-8 md:px-16 py-12 gap-12 md:gap-16">
        {/* 图片区域 - 在上方 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLine}
            className="w-full max-w-md flex items-center justify-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <img
              src={currentScript.image}
              alt={currentScript.imageAlt}
              className="w-full h-auto max-w-sm"
              style={{
                filter: 'none', // 保持原始黑白线条风格
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* 文字区域 - 在下方 */}
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLine}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p 
                className="text-2xl md:text-3xl lg:text-4xl font-serif leading-relaxed tracking-wide"
                style={{
                  color: '#4A4A4A', // 深灰色，更柔和、更具文艺感
                }}
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
      </div>
    </div>
  );
}

