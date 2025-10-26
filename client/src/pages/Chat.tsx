import { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getPhilosopherResponse } from "@/lib/ai-service";
import { ArrowLeft, Send } from "lucide-react";

interface Message {
  role: "user" | "philosopher";
  content: string;
  timestamp: number;
  isCritical?: boolean; // 是否是致命一击
}

const philosopherInfo: Record<
  string,
  {
    name: string;
    nameEn: string;
    tagline: string;
    style: string;
    avatar: string;
  }
> = {
  socrates: {
    name: "苏格拉底",
    nameEn: "Socrates",
    tagline: "你真的懂吗？",
    style: "连环追问，步步紧逼",
    avatar: "/web-socrates.webp",
  },
  nietzsche: {
    name: "尼采",
    nameEn: "Nietzsche",
    tagline: "别这么平庸",
    style: "激烈批判，充满力量",
    avatar: "/web-nietzsche.webp",
  },
  wittgenstein: {
    name: "维特根斯坦",
    nameEn: "Wittgenstein",
    tagline: "你的逻辑有问题",
    style: "逻辑解构，精准打击",
    avatar: "/web-wittgenstein.webp",
  },
  kant: {
    name: "康德",
    nameEn: "Kant",
    tagline: "你配谈道德吗？",
    style: "冷静剖析，道德审判",
    avatar: "/web-kant.webp",
  },
  freud: {
    name: "弗洛伊德",
    nameEn: "Freud",
    tagline: "你在压抑什么？",
    style: "本能揭露，深层剖析",
    avatar: "/web-freud.webp",
  },
};

export default function Chat() {
  const [, params] = useRoute("/chat/:id");
  const philosopherId = params?.id || "socrates";
  const philosopher = philosopherInfo[philosopherId] || philosopherInfo.socrates;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "philosopher",
      content: `我是${philosopher.name}。说吧，你想让我戳穿你什么幻想？`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setShowHint(false);

    // 模拟1-2秒的"沉默"（思考/不屑）
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role === "philosopher" ? ("assistant" as const) : ("user" as const),
        content: msg.content,
      }));

      const response = await getPhilosopherResponse(
        philosopherId,
        input,
        conversationHistory
      );

      // 判断是否是"致命一击"（回复特别犀利）
      const isCritical = response.length < 50 && (response.includes("？") || response.includes("..."));

      const philosopherMessage: Message = {
        role: "philosopher",
        content: response,
        timestamp: Date.now(),
        isCritical,
      };
      setMessages((prev) => [...prev, philosopherMessage]);
    } catch (error) {
      console.error("Failed to get response:", error);
      const errorMessage: Message = {
        role: "philosopher",
        content: "...(沉默)",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className="fixed inset-0 overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)",
      }}
    >
      {/* 顶部哲学家头像区域 - 固定 */}
      <div className="relative flex-shrink-0 py-8 px-4" style={{ height: "clamp(200px, 25vh, 280px)" }}>
        {/* 聚光灯效果 */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
          }}
        />
        
        {/* 头像 */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <img
              src={philosopher.avatar}
              alt={philosopher.name}
              className="w-40 h-40 rounded-full object-cover"
              style={{
                filter: "grayscale(100%) contrast(1.2) brightness(0.9)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255,255,255,0.1)",
              }}
            />
            {/* 光环效果 */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: "inset 0 0 30px rgba(255,255,255,0.2)",
              }}
            />
          </div>
          
          <h1 className="mt-4 text-2xl font-bold text-gray-100 tracking-wider">
            {philosopher.name}
          </h1>
          <p className="mt-1 text-sm text-gray-400 tracking-wide">
            {philosopher.tagline}
          </p>
        </motion.div>

        {/* 返回按钮 - 左上角 */}
        <button
          onClick={() => setLocation("/select")}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">返回</span>
        </button>
      </div>

      {/* 对话区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: message.role === "philosopher" ? -20 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "philosopher" ? (
                  // 哲学家消息 - 审判风格
                  <div className="relative max-w-[85%]">
                    {/* Critical Hit 标签 */}
                    {message.isCritical && (
                      <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-6 -right-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold z-10"
                        style={{ boxShadow: "0 4px 12px rgba(255,74,74,0.4)" }}
                      >
                        CRITICAL HIT
                      </motion.div>
                    )}
                    
                    <div
                      className="relative px-6 py-4 text-gray-100"
                      style={{
                        background: "linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%)",
                        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                    >
                      <p className="text-base leading-relaxed font-serif">
                        {message.content}
                      </p>
                      <span className="text-xs text-gray-500 mt-2 block">
                        {new Date(message.timestamp).toLocaleTimeString("zh-CN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ) : (
                  // 用户消息 - 谦卑风格
                  <div
                    className="max-w-[70%] px-5 py-3 rounded-2xl text-gray-300 text-sm"
                    style={{
                      background: "rgba(60, 60, 60, 0.6)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    }}
                  >
                    <p className="leading-relaxed">{message.content}</p>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {new Date(message.timestamp).toLocaleTimeString("zh-CN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 正在输入指示器 */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div
                className="px-6 py-4"
                style={{
                  background: "linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%)",
                  clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
                }}
              >
                <div className="flex gap-2">
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 - 固定在底部 */}
      <div className="flex-shrink-0 border-t border-gray-800 bg-black bg-opacity-50 backdrop-blur-sm p-4">
        <div className="max-w-3xl mx-auto">
          {/* 提示文字 */}
          {showHint && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-gray-500 mb-2 text-center"
            >
              你确定要这么说吗？
            </motion.p>
          )}
          
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => setShowHint(true)}
                onBlur={() => setShowHint(false)}
                placeholder="说出你的辩护..."
                disabled={isTyping}
                rows={1}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  maxHeight: "120px",
                  minHeight: "48px",
                }}
              />
            </div>
            
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-5 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed text-gray-200 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Send size={18} />
              <span className="hidden sm:inline">发送</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

