import { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getPhilosopherResponseStream, type ChatMessage } from "@/lib/ai-service";
import { ArrowLeft, Send } from "lucide-react";

interface Message {
  role: "user" | "philosopher";
  content: string;
  timestamp: number;
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

  // 页面刷新后重新开始对话
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "philosopher",
      content: `我是${philosopher.name}。说吧，你想让我戳穿你什么幻想？`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState(""); // 流式输出的内容
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput("");
    setIsTyping(true);
    setStreamingContent("");

    // 模拟1-2秒的"沉默"（思考）
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    try {
      // 构建对话历史（用于多轮对话）
      const conversationHistory: ChatMessage[] = messages.map((msg) => ({
        role: msg.role === "philosopher" ? ("assistant" as const) : ("user" as const),
        content: msg.content,
      }));

      // 流式输出
      let fullResponse = "";
      for await (const chunk of getPhilosopherResponseStream(
        philosopherId,
        userInput,
        conversationHistory
      )) {
        fullResponse += chunk;
        setStreamingContent(fullResponse);
      }

      // 流式输出完成后，将完整回复添加到消息列表
      const philosopherMessage: Message = {
        role: "philosopher",
        content: fullResponse,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, philosopherMessage]);
      setStreamingContent("");
    } catch (error) {
      console.error("Failed to get response:", error);
      const errorMessage: Message = {
        role: "philosopher",
        content: "...(沉默)",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStreamingContent("");
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
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* 背景插画 - 淡化显示 */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `url(/chat-bg-${philosopherId}.png)`,
          backgroundSize: '60%',
        }}
      />

      {/* 顶部标题栏 */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <button
          onClick={() => setLocation("/select")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">返回</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">与{philosopher.name}对话</h1>
          <p className="text-xs text-gray-500 mt-0.5">{philosopher.style}</p>
        </div>
        
        <div className="w-16" /> {/* 占位，保持标题居中 */}
      </div>

      {/* 对话区域 */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-3xl px-6 py-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg"
                      : "bg-white text-gray-800 shadow-md border border-gray-100"
                  }`}
                >
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 流式输出中的消息 */}
          {isTyping && streamingContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[70%] rounded-3xl px-6 py-4 bg-white text-gray-800 shadow-md border border-gray-100">
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {streamingContent}
                  <span className="inline-block w-1 h-4 ml-1 bg-gray-400 animate-pulse" />
                </p>
              </div>
            </motion.div>
          )}

          {/* 正在输入提示（还没开始流式输出时） */}
          {isTyping && !streamingContent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[70%] rounded-3xl px-6 py-4 bg-white text-gray-800 shadow-md border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 底部输入区域 */}
      <div className="relative z-10 border-t border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="说点什么..."
            disabled={isTyping}
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

