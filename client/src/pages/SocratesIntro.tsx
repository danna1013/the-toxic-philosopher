import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// 定义字幕、图片和时间轴
const script = [
  { 
    text: "我是苏格拉底，雅典的'牛虻'。", 
    duration: 4000,
    image: "/socrates-intro-1.jpg",
    imageAlt: "苏格拉底肖像"
  },
  { 
    text: "我的使命，就是用问题戳穿所有确定的答案。", 
    duration: 5000,
    image: "/socrates-intro-2.jpg",
    imageAlt: "苏格拉底深思"
  },
  { 
    text: "哪怕最终喝下毒酒，也要唤醒雅典对真理的诚实。", 
    duration: 6000,
    image: "/socrates-intro-3.jpg",
    imageAlt: "苏格拉底之死"
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
      }, 800);
      return () => clearTimeout(timer);
    }

    const currentText = script[currentLine].text;
    let charIndex = 0;
    setDisplayedText('');
    setIsTyping(true);

    // 打字机效果：逐字显示
    const typingInterval = setInterval(() => {
      if (charIndex < currentText.length) {
        setDisplayedText(currentText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 80); // 每个字符显示间隔 80ms

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
        className="absolute top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors group"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-sm font-medium">跳过</span>
        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
      </motion.button>

      {/* 主内容区域 */}
      <div className="h-full flex flex-col md:flex-row items-center justify-center px-8 md:px-16 gap-8 md:gap-16">
        {/* 图片区域 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLine}
            className="w-full md:w-1/2 max-w-md"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <img
              src={currentScript.image}
              alt={currentScript.imageAlt}
              className="w-full h-auto rounded-lg shadow-2xl grayscale"
              style={{
                filter: 'grayscale(100%) contrast(1.1)',
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* 文字区域 */}
        <div className="w-full md:w-1/2 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLine}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-relaxed tracking-wide">
                {displayedText}
                {isTyping && (
                  <motion.span
                    className="inline-block w-1 h-8 md:h-10 bg-gray-900 ml-1"
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

