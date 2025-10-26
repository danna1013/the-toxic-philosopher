import { useState, useRef, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { getPhilosopherResponse } from "@/lib/ai-service";
import ShareButton from "@/components/ShareButton";

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
  }
> = {
  socrates: {
    name: "苏格拉底",
    nameEn: "Socrates",
    tagline: "无知即智慧",
    style: "反问式毒舌",
  },
  nietzsche: {
    name: "尼采",
    nameEn: "Nietzsche",
    tagline: "上帝已死",
    style: "直击灵魂",
  },
  wittgenstein: {
    name: "维特根斯坦",
    nameEn: "Wittgenstein",
    tagline: "凡不可说的,应当沉默",
    style: "逻辑解构",
  },
  kant: {
    name: "康德",
    nameEn: "Kant",
    tagline: "人为自然立法",
    style: "理性审判",
  },
  freud: {
    name: "弗洛伊德",
    nameEn: "Freud",
    tagline: "潜意识支配一切",
    style: "本能揭露",
  },
};



export default function Chat() {
  const [, params] = useRoute("/chat/:id");
  const philosopherId = params?.id || "socrates";
  const philosopher = philosopherInfo[philosopherId] || philosopherInfo.socrates;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "philosopher",
      content: `我是${philosopher.name}。说吧,你想让我戳穿你什么幻想?`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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

    // 调用AI获取回复
    try {
      // 转换消息历史格式
      const conversationHistory = messages.map((msg) => ({
        role: msg.role === "philosopher" ? "assistant" as const : "user" as const,
        content: msg.content,
      }));

      const response = await getPhilosopherResponse(
        philosopherId,
        input,
        conversationHistory
      );

      const philosopherMessage: Message = {
        role: "philosopher",
        content: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, philosopherMessage]);
    } catch (error) {
      console.error("Failed to get response:", error);
      // 错误时显示一个通用回复
      const errorMessage: Message = {
        role: "philosopher",
        content: "...(沉思中)",
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* 顶部导航栏 */}
      <div className="border-b-2 border-black p-4 flex items-center justify-between">
        <button
          onClick={() => setLocation("/select")}
          className="flex items-center gap-2 hover:opacity-60 transition-opacity"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7"></path>
          </svg>
          <span className="font-medium">更换导师</span>
        </button>

        <div className="text-center">
          <h1 className="text-xl font-bold">{philosopher.name}</h1>
          <p className="text-sm text-gray-600">{philosopher.tagline}</p>
        </div>

        <div className="w-20"></div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] md:max-w-[60%] ${
                message.role === "user"
                  ? "bg-black text-white"
                  : "border-2 border-black bg-white text-black"
              } p-4 relative`}
            >
              {/* 装饰性几何图形 */}
              {message.role === "philosopher" && (
                <div className="absolute top-2 right-2 w-8 h-8 opacity-10">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polygon
                      points="50,10 90,90 10,90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              )}

              <p className="text-base leading-relaxed relative z-10">
                {message.content}
              </p>

              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-xs ${
                    message.role === "user" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString("zh-CN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {message.role === "philosopher" && (
                  <ShareButton
                    message={message.content}
                    philosopher={philosopher.name}
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="border-2 border-black bg-white text-black p-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-black rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-black rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t-2 border-black p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="说出你的困惑..."
            className="flex-1 border-2 border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}

