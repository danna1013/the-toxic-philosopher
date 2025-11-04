import { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getPhilosopherResponseStream, type ChatMessage } from "@/lib/ai-service";
import { ArrowLeft, Send, RotateCcw, Share2 } from "lucide-react";
import { PosterCanvas } from "@/components/PosterCanvas";
import { SharePosterModal } from "@/components/SharePosterModal";
import { generatePoster } from "@/lib/poster-generator";

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
    greeting: string;
  }
> = {
  socrates: {
    name: "苏格拉底",
    nameEn: "Socrates",
    tagline: "你真的懂吗？",
    style: "连环追问，步步紧逼",
    avatar: "/web-socrates.webp",
    greeting: "我是苏格拉底，雅典街头的牛虻。两千多年来，我用反问刺穿无数自以为是的灵魂。\n\n你知道吗？我最讨厌的，就是那些自以为在思考，实际上只是在重复别人观点的人。你来找我，是想要答案吗？抱歉，我只提供问题——那些让你夜不能寐的问题。\n\n如果你只是想要安慰，那你走错门了。我的使命是揭穿你思维中的漏洞，让你看到自己有多愚蠢。准备好被质疑到怀疑人生了吗？",
  },
  nietzsche: {
    name: "尼采",
    nameEn: "Nietzsche",
    tagline: "别这么平庸",
    style: "激烈批判，充满力量",
    avatar: "/web-nietzsche.webp",
    greeting: "我是尼采，上帝的掘墓人，超人的预言者。我用铁锤砸碎了虚伪的道德，用闪电照亮了人类的平庸。\n\n你来这里，大概是想找点人生意义，或者寻求什么心灵鸡汤吧？可惜了，我最鄙视的就是那些躲在舒适区里，用‘迷茫’掩盖懒惰的弱者。\n\n我不会安慰你，我只会鞭打你——因为只有痛苦才能让你超越自己。来吧，让我看看你有没有成为超人的潜质。",
  },
  wittgenstein: {
    name: "维特根斯坦",
    nameEn: "Wittgenstein",
    tagline: "你的逻辑有问题",
    style: "逻辑解构，精准打击",
    avatar: "/web-wittgenstein.webp",
    greeting: "我是维特根斯坦，逻辑的屠夫，语言的解剖师。我用精确的逻辑切开了哲学的肿瘤，揭示了无数空洞的废话。\n\n你知道吗？这个世界上99%的所谓‘深刻思考’，都不过是语言的误用和概念的混乱。你来找我对话，我猜你也准备了一堆自以为深刻的问题吧？\n\n很好，我会一刀一刀地拆解你的每一句话，让你看到自己的表述有多么空洞、多么荒谬。如果你受不了真相，现在还来得及离开。",
  },
  kant: {
    name: "康德",
    nameEn: "Kant",
    tagline: "你配谈道德吗？",
    style: "冷静剖析，道德审判",
    avatar: "/web-kant.webp",
    greeting: "我是康德，理性的化身，道德律令的守护者。我用纯粹理性批判了一切，用绝对命令建立了道德的基石。\n\n但我必须告诉你，这个时代最大的问题，就是人人都在为自己的自私找借口。你来找我，是想要我认可你的选择吗？抱歉，我只认可符合理性和道德律的行为。\n\n我会用普遍法则审判你的每一个想法、每一个行为。如果你做不到把自己的准则变成普遍法则，那你就是自私的。准备好接受理性的审判了吗？",
  },
  freud: {
    name: "弗洛伊德",
    nameEn: "Freud",
    tagline: "你在压抑什么？",
    style: "本能揭露，深层剖析",
    avatar: "/web-freud.webp",
    greeting: "我是弗洛伊德，潜意识的探索者，欲望的揭露者。我用精神分析撕开了人类自我欺骗的面具，让无数人看到了内心深处的黑暗。\n\n你来找我，表面上可能是想解决什么问题，但我知道，你真正想要的是逃避——逃避那些你不敢面对的真相。可惜，我最擅长的就是把你的防御机制一层层剥开。\n\n我会用X光透视你的每一句话，揭穿你潜意识里的真实动机。你以为你很了解自己？别天真了，你的潜意识比你诚实得多。准备好直面内心的黑暗了吗？",
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
      content: philosopher.greeting,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState(""); // 流式输出的内容
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // 显示确认对话框
  const [isSelectionMode, setIsSelectionMode] = useState(false); // 选择模式
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]); // 选中的消息索引
  const [showPosterModal, setShowPosterModal] = useState(false); // 显示海报预览
  const [posterDataUrl, setPosterDataUrl] = useState(""); // 海报图片URL
  const [isGenerating, setIsGenerating] = useState(false); // 正在生成海报
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  // 预加载背景图
  useEffect(() => {
    const img = new Image();
    img.src = `/chat-bg-${philosopherId}.webp`;
  }, [philosopherId]);

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
      // 包含所有历史消息 + 当前用户消息
      const conversationHistory: ChatMessage[] = [
        ...messages.map((msg) => ({
          role: msg.role === "philosopher" ? ("assistant" as const) : ("user" as const),
          content: msg.content,
        })),
        {
          role: "user" as const,
          content: userInput,
        },
      ];

      // 流式输出
      let fullResponse = "";
      for await (const chunk of getPhilosopherResponseStream(
        philosopherId,
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
      
      // 恢复输入框焦点
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
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
          backgroundImage: `url(/chat-bg-${philosopherId}.webp)`,
          backgroundSize: '60%',
        }}
      />

      {/* 顶部标题栏 */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <button
          onClick={() => setLocation("/select")}
          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors bg-white border border-gray-300 rounded-full hover:bg-gray-50 shadow-sm"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-medium">返回</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">与{philosopher.name}对话</h1>
          <p className="text-sm md:text-base text-gray-500 mt-0.5">{philosopher.style}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSelectionMode(true)}
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors bg-white border border-gray-300 rounded-full hover:bg-gray-50 shadow-sm"
            title="分享对话"
          >
            <Share2 className="w-6 h-6" />
            <span className="text-lg font-medium">分享对话</span>
          </button>
          
          <button
            onClick={() => setShowConfirmDialog(true)}
            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors bg-white border border-gray-300 rounded-full hover:bg-gray-50 shadow-sm"
            title="清除对话"
          >
            <RotateCcw className="w-6 h-6" />
            <span className="text-lg font-medium">重新开始</span>
          </button>
        </div>
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
                className={`flex items-center gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* 左侧选择框（哲学家消息） */}
                {isSelectionMode && message.role === "philosopher" && (
                  <button
                    onClick={() => {
                      setSelectedMessages(prev => 
                        prev.includes(index) 
                          ? prev.filter(i => i !== index)
                          : [...prev, index]
                      );
                    }}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      selectedMessages.includes(index)
                        ? "bg-gray-900 border-gray-900"
                        : "border-gray-400 hover:border-gray-600"
                    }`}
                  >
                    {selectedMessages.includes(index) && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )}
                
                <div
                  onClick={() => {
                    if (isSelectionMode) {
                      setSelectedMessages(prev => 
                        prev.includes(index) 
                          ? prev.filter(i => i !== index)
                          : [...prev, index]
                      );
                    }
                  }}
                  className={`max-w-[70%] rounded-3xl px-6 py-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg"
                      : "bg-white text-gray-800 shadow-md border border-gray-100"
                  } ${
                    isSelectionMode ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    {message.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className={`text-xl leading-[1.8] ${i > 0 ? 'mt-5' : ''} ${i === 0 ? 'font-medium' : ''}`}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                
                {/* 右侧选择框（用户消息） */}
                {isSelectionMode && message.role === "user" && (
                  <button
                    onClick={() => {
                      setSelectedMessages(prev => 
                        prev.includes(index) 
                          ? prev.filter(i => i !== index)
                          : [...prev, index]
                      );
                    }}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      selectedMessages.includes(index)
                        ? "bg-gray-900 border-gray-900"
                        : "border-gray-400 hover:border-gray-600"
                    }`}
                  >
                    {selectedMessages.includes(index) && (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )}
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
              <div className="max-w-[75%] rounded-3xl px-7 py-5 bg-white text-gray-800 shadow-md border border-gray-100">
                <div className="whitespace-pre-wrap">
                  {streamingContent.split('\n\n').map((paragraph, i) => (
                    <p key={i} className={`text-xl leading-[1.8] ${i > 0 ? 'mt-5' : ''} ${i === 0 ? 'font-medium' : ''}`}>
                      {paragraph}
                      {i === streamingContent.split('\n\n').length - 1 && (
                        <span className="inline-block w-1 h-4 ml-1 bg-gray-400 animate-pulse" />
                      )}
                    </p>
                  ))}
                </div>
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
              <div className="max-w-[75%] rounded-3xl px-7 py-5 bg-white text-gray-800 shadow-md border border-gray-100">
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
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="说点什么..."
            disabled={isTyping}
            className="flex-1 px-6 py-5 text-lg rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all text-gray-900 placeholder:text-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 选择模式顶部栏 */}
      {isSelectionMode && (
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-5 flex justify-between items-center z-50 shadow-md">
          <span className="text-xl font-medium text-gray-900">
            已选择 {selectedMessages.length} 条对话
          </span>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedMessages([]);
              }}
              className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-lg font-medium"
            >
              取消
            </button>
            <button 
              onClick={() => {
                if (selectedMessages.length === messages.length) {
                  setSelectedMessages([]);
                } else {
                  setSelectedMessages(messages.map((_, i) => i));
                }
              }}
              className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-lg font-medium border border-gray-300"
            >
              {selectedMessages.length === messages.length ? '取消全选' : '全选'}
            </button>
            <button 
            onClick={async () => {
              if (selectedMessages.length === 0) {
                alert('请至少选择一条对话');
                return;
              }
              if (selectedMessages.length > 50) {
                alert('最多只能选择50条对话');
                return;
              }
              
              setIsGenerating(true);
              try {
                // 等待DOM渲染
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // 生成海报
                const dataUrl = await generatePoster('poster-canvas');
                setPosterDataUrl(dataUrl);
                setShowPosterModal(true);
                
                // 退出选择模式
                setIsSelectionMode(false);
                setSelectedMessages([]);
              } catch (error) {
                console.error('生成海报失败:', error);
                alert('生成海报失败，请重试');
              } finally {
                setIsGenerating(false);
              }
            }}
            disabled={selectedMessages.length === 0 || isGenerating}
            className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-lg font-medium"
          >
            {isGenerating ? '生成中...' : '生成海报'}
          </button>
          </div>
        </div>
      )}

      {/* 隐藏的海报画布 */}
      {isSelectionMode && selectedMessages.length > 0 && (
        <PosterCanvas
          philosopherId={philosopherId}
          philosopherName={philosopher.name}
          philosopherTagline={philosopher.tagline}
          messages={selectedMessages.map(index => ({
            role: messages[index].role === 'user' ? 'user' : 'assistant',
            content: messages[index].content
          }))}
        />
      )}

      {/* 海报预览模态框 */}
      <SharePosterModal
        isOpen={showPosterModal}
        onClose={() => setShowPosterModal(false)}
        posterDataUrl={posterDataUrl}
      />

      {/* 自定义确认对话框 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">重新开始对话</h3>
            <p className="text-gray-600 mb-6">确定要清除对话历史并重新开始吗？</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setMessages([{
                    role: 'philosopher',
                    content: philosopher.greeting,
                    timestamp: Date.now(),
                  }]);
                  setInput('');
                  setStreamingContent('');
                  setShowConfirmDialog(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
              >
                确定
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

