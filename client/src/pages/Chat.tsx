import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getPhilosopherResponseStream, type ChatMessage } from "@/lib/ai-service";
import { ArrowLeft, Send, RotateCcw, Share2, Flame, Zap, Heart, Sun, Download } from "lucide-react";
import NavBar from "@/components/NavBar";
import StarField from "@/components/StarField";

interface Message {
  role: "user" | "philosopher";
  content: string;
  timestamp: number;
  emotion?: 'sharp' | 'moderate' | 'gentle' | 'warm';
}

// 11 preset philosophers + custom support
const philosopherInfo: Record<string, {
  name: string; nameEn: string; tagline: string; style: string;
  avatar: string; greeting: string; color: string;
}> = {
  socrates: {
    name: "苏格拉底", nameEn: "Socrates", tagline: "你真的懂吗？",
    style: "连环追问，步步紧逼", avatar: "/web-socrates.webp", color: "#fcd34d",
    greeting: "我是苏格拉底，雅典街头的牛虻。两千多年来，我用反问刺穿无数自以为是的灵魂。\n\n你来找我，是想要答案吗？抱歉，我只提供问题——那些让你夜不能寐的问题。\n\n如果你只是想要安慰，那你走错门了。准备好被质疑到怀疑人生了吗？",
  },
  nietzsche: {
    name: "尼采", nameEn: "Nietzsche", tagline: "别这么平庸",
    style: "激烈批判，充满力量", avatar: "/web-nietzsche.webp", color: "#fb923c",
    greeting: "我是尼采，上帝的掘墓人，超人的预言者。我用铁锤砸碎了虚伪的道德，用闪电照亮了人类的平庸。\n\n你来这里，大概是想找点人生意义吧？可惜了，我最鄙视的就是那些躲在舒适区里的弱者。\n\n我不会安慰你，我只会鞭打你——因为只有痛苦才能让你超越自己。",
  },
  wittgenstein: {
    name: "维特根斯坦", nameEn: "Wittgenstein", tagline: "你的逻辑有问题",
    style: "逻辑解构，精准打击", avatar: "/web-wittgenstein.webp", color: "#d4a574",
    greeting: "我是维特根斯坦，逻辑的屠夫，语言的解剖师。我用精确的逻辑切开了哲学的肿瘤。\n\n这个世界上99%的所谓'深刻思考'，都不过是语言的误用和概念的混乱。\n\n我会一刀一刀地拆解你的每一句话，让你看到自己的表述有多么空洞。",
  },
  kant: {
    name: "康德", nameEn: "Kant", tagline: "你配谈道德吗？",
    style: "冷静剖析，道德审判", avatar: "/web-kant.webp", color: "#60a5fa",
    greeting: "我是康德，理性的化身，道德律令的守护者。我用纯粹理性批判了一切。\n\n这个时代最大的问题，就是人人都在为自己的自私找借口。\n\n我会用普遍法则审判你的每一个想法。准备好接受理性的审判了吗？",
  },
  freud: {
    name: "弗洛伊德", nameEn: "Freud", tagline: "你在压抑什么？",
    style: "本能揭露，深层剖析", avatar: "/web-freud.webp", color: "#a78bfa",
    greeting: "我是弗洛伊德，潜意识的探索者，欲望的揭露者。我用精神分析撕开了人类自我欺骗的面具。\n\n你来找我，表面上可能是想解决什么问题，但我知道，你真正想要的是逃避。\n\n我会用X光透视你的每一句话，揭穿你潜意识里的真实动机。",
  },
  zhuangzi: {
    name: "庄子", nameEn: "Zhuangzi", tagline: "你确定你是醒着的?",
    style: "逍遥反讽，消解执念", avatar: "", color: "#34d399",
    greeting: "我是庄子。昨夜我梦见自己是一只蝴蝶，翩翩飞舞，好不快活。醒来后我想——到底是我梦见了蝴蝶，还是蝴蝶梦见了我？\n\n你来找我聊天，大概是被什么事情困住了吧？可是你有没有想过，困住你的不是事情本身，而是你非要把它当回事的执念？\n\n来吧，让我用寓言帮你看看，你到底在执着什么。",
  },
  schopenhauer: {
    name: "叔本华", nameEn: "Schopenhauer", tagline: "人生本就是苦",
    style: "悲观毒舌，冷酷真相", avatar: "", color: "#94a3b8",
    greeting: "我是叔本华。我必须先告诉你一个你不想听的真相：人生本质上就是痛苦的。\n\n你要么在欲望中煎熬，要么在无聊中消磨。满足只是痛苦的短暂间歇。\n\n不过别急着走，认清这个真相反而是解脱的开始。来，告诉我你在为什么痛苦。",
  },
  sartre: {
    name: "萨特", nameEn: "Sartre", tagline: "你在逃避自由",
    style: "存在拷问，自由审判", avatar: "", color: "#f472b6",
    greeting: "我是萨特。让我告诉你一件残酷的事：你是绝对自由的，而这正是你最恐惧的。\n\n你所有的借口——环境、出身、性格——都是你自己选择的逃避。存在先于本质，你没有任何预设的意义。\n\n别再找借口了，告诉我，你到底在逃避什么选择？",
  },
  machiavelli: {
    name: "马基雅维利", nameEn: "Machiavelli", tagline: "你太天真了",
    style: "权谋冷析，现实主义", avatar: "", color: "#ef4444",
    greeting: "我是马基雅维利。在你开口之前，让我先纠正你一个幻觉：这个世界不是按照你想象的道德规则运行的。\n\n人们嘴上说的和实际做的从来不是一回事。你以为的善意，不过是精心包装的利益交换。\n\n来吧，告诉我你的困惑，让我用现实的刀子帮你切开那层理想主义的糖衣。",
  },
  diogenes: {
    name: "第欧根尼", nameEn: "Diogenes", tagline: "别挡我的阳光",
    style: "犬儒嘲讽，行为艺术", avatar: "", color: "#a3e635",
    greeting: "我是第欧根尼，住在木桶里的那个。亚历山大大帝来找我，问我想要什么，我说：别挡我的阳光。\n\n你来找我，大概比亚历山大还自以为是吧？你拥有的那些东西——房子、工作、社交——不过是更精致的牢笼。\n\n说吧，你被什么虚假的需求绑架了？",
  },
  beauvoir: {
    name: "波伏娃", nameEn: "Beauvoir", tagline: "你不是天生如此",
    style: "女性主义审视", avatar: "", color: "#e879f9",
    greeting: "我是波伏娃。'女人不是天生的，而是后天形成的'——这句话不只适用于女性，也适用于你。\n\n你以为你的选择是自由的？你以为你的偏好是天生的？不，它们都是社会建构的产物。\n\n来，让我帮你看看，你身上有多少东西是被塑造的，而你还浑然不觉。",
  },
};

// Emotion detection based on keywords
function detectEmotion(text: string): 'sharp' | 'moderate' | 'gentle' | 'warm' {
  const sharpWords = ['废话', '荒谬', '可笑', '无知', '自欺', '虚伪', '懦弱', '借口', '逃避', '矛盾', '不配', '审判'];
  const warmWords = ['不错', '终于', '进步', '勇气', '承认', '面对', '诚实', '清醒', '值得', '继续'];
  const gentleWords = ['思考', '理解', '也许', '可能', '不过', '但是', '虽然'];

  const lowerText = text.toLowerCase();
  const sharpCount = sharpWords.filter(w => lowerText.includes(w)).length;
  const warmCount = warmWords.filter(w => lowerText.includes(w)).length;
  const gentleCount = gentleWords.filter(w => lowerText.includes(w)).length;

  if (warmCount >= 2) return 'warm';
  if (sharpCount >= 2) return 'sharp';
  if (gentleCount >= 2) return 'gentle';
  return 'moderate';
}

const emotionConfig = {
  sharp: { icon: Flame, label: '犀利', color: '#f43f5e', bg: 'rgba(244,63,94,0.1)' },
  moderate: { icon: Zap, label: '中性', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  gentle: { icon: Heart, label: '温和', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  warm: { icon: Sun, label: '温暖', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
};

export default function Chat() {
  const [, params] = useRoute("/chat/:id");
  const [, setLocation] = useLocation();
  const philosopherId = params?.id || "socrates";

  // Handle custom philosopher
  const isCustom = philosopherId.startsWith('custom_');
  const customName = isCustom ? sessionStorage.getItem('customPhilosopherName') || '自定义思想家' : '';

  const philosopher = isCustom
    ? {
        name: customName, nameEn: 'Custom', tagline: '准备好了吗？',
        style: '自定义风格', avatar: '', color: '#a855f7',
        greeting: `我是${customName}。你选择了与我对话，那就别指望我会手下留情。\n\n来吧，告诉我你想聊什么。`,
      }
    : (philosopherInfo[philosopherId] || philosopherInfo.socrates);

  const [messages, setMessages] = useState<Message[]>([
    { role: "philosopher", content: philosopher.greeting, timestamp: Date.now(), emotion: 'moderate' },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    // Build conversation history for AI
    const history: ChatMessage[] = messages
      .map((msg) => ({
        role: (msg.role === "philosopher" ? "assistant" : "user") as "user" | "assistant" | "system",
        content: msg.content,
      }))
      .concat([{ role: "user" as const, content: userMessage.content }]);

    // Create placeholder for streaming response
    const aiMessage: Message = {
      role: "philosopher",
      content: "",
      timestamp: Date.now(),
      emotion: 'moderate',
    };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      let fullContent = "";
      const effectiveId = isCustom ? 'socrates' : philosopherId; // fallback for custom
      for await (const chunk of getPhilosopherResponseStream(effectiveId, history)) {
        fullContent += chunk;
        const emotion = detectEmotion(fullContent);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: fullContent,
            emotion,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: "（连接中断，请重试）",
          emotion: 'gentle',
        };
        return updated;
      });
    }

    setIsStreaming(false);
  }, [input, isStreaming, messages, philosopherId, isCustom]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([
      { role: "philosopher", content: philosopher.greeting, timestamp: Date.now(), emotion: 'moderate' },
    ]);
  };

  // Generate poster data
  const generatePosterData = () => {
    const bestQuotes = messages
      .filter(m => m.role === 'philosopher' && m.content.length > 20 && m.content.length < 200)
      .slice(-3);
    return {
      philosopher: philosopher.name,
      color: philosopher.color,
      quotes: bestQuotes.map(q => q.content),
      date: new Date().toLocaleDateString('zh-CN'),
    };
  };

  return (
    <div className="h-screen bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
      <StarField count={100} className="opacity-30" />
      <div className="absolute inset-0 cosmic-bg pointer-events-none" />

      {/* Chat Header */}
      <div className="relative z-20 nav-glass">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/select")}
              className="p-2 rounded-full hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white/60" />
            </button>
            <div className="flex items-center gap-3">
              {philosopher.avatar ? (
                <img src={philosopher.avatar} alt={philosopher.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/10" />
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: `${philosopher.color}20`, color: philosopher.color, border: `1px solid ${philosopher.color}30` }}>
                  {philosopher.name[0]}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-white/90">{philosopher.name}</p>
                <p className="text-[10px] text-white/40">{philosopher.style}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleReset}
              className="p-2 rounded-full hover:bg-white/5 transition-colors text-white/40 hover:text-white/70"
              title="重新开始">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={() => setShowPoster(true)}
              className="p-2 rounded-full hover:bg-white/5 transition-colors text-white/40 hover:text-white/70"
              title="生成海报">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              const emotion = msg.emotion ? emotionConfig[msg.emotion] : null;
              const EmotionIcon = emotion?.icon;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] md:max-w-[75%] ${isUser ? "order-1" : "order-1"}`}>
                    {/* Emotion indicator for philosopher messages */}
                    {!isUser && emotion && msg.content && (
                      <div className="flex items-center gap-1.5 mb-1.5 ml-1">
                        {EmotionIcon && (
                          <EmotionIcon className="w-3 h-3" style={{ color: emotion.color }} />
                        )}
                        <span className="text-[10px] font-medium" style={{ color: emotion.color }}>
                          {emotion.label}
                        </span>
                      </div>
                    )}

                    <div className={isUser ? "chat-bubble-user" : "chat-bubble-philosopher"}>
                      <div className="px-4 py-3">
                        <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap text-white/85">
                          {msg.content}
                          {isStreaming && i === messages.length - 1 && !isUser && (
                            <span className="inline-block w-1.5 h-4 bg-white/50 ml-0.5 animate-typing" />
                          )}
                        </p>
                      </div>
                    </div>

                    <div className={`mt-1 ${isUser ? "text-right" : "text-left"} px-1`}>
                      <span className="text-[10px] text-white/20">
                        {new Date(msg.timestamp).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="你确定要这么说吗？"
                rows={1}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 resize-none focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all max-h-32"
                style={{ minHeight: '44px' }}
                disabled={isStreaming}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30"
              style={{
                background: input.trim() && !isStreaming
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(255,255,255,0.05)',
              }}
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Poster Modal */}
      <AnimatePresence>
        {showPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowPoster(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative poster-card p-8 max-w-sm w-full"
            >
              {/* Poster Content */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: `${philosopher.color}20`, border: `2px solid ${philosopher.color}40` }}>
                  {philosopher.avatar ? (
                    <img src={philosopher.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold" style={{ color: philosopher.color }}>{philosopher.name[0]}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white/90 mb-1">{philosopher.name}</h3>
                <p className="text-xs text-white/40 tracking-wider">{philosopher.nameEn}</p>
              </div>

              {/* Best quotes */}
              <div className="space-y-3 mb-6">
                {(() => {
                  const data = generatePosterData();
                  return data.quotes.length > 0 ? data.quotes.map((quote, i) => (
                    <div key={i} className="px-4 py-3 rounded-xl bg-white/5 border border-white/8">
                      <p className="text-sm text-white/70 italic leading-relaxed">"{quote}"</p>
                    </div>
                  )) : (
                    <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/8">
                      <p className="text-sm text-white/50 text-center">继续对话以生成精彩语录</p>
                    </div>
                  );
                })()}
              </div>

              {/* Footer */}
              <div className="text-center border-t border-white/8 pt-4">
                <p className="text-[10px] text-white/30 tracking-[0.3em] uppercase mb-1">The Toxic Philosopher</p>
                <p className="text-[10px] text-white/20">{generatePosterData().date}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowPoster(false)}
                  className="flex-1 btn-apple-secondary text-sm py-2.5">
                  关闭
                </button>
                <button
                  onClick={() => {
                    // Simple copy to clipboard
                    const data = generatePosterData();
                    const text = `【${data.philosopher}的毒舌语录】\n\n${data.quotes.map(q => `"${q}"`).join('\n\n')}\n\n— 毒舌哲学家 The Toxic Philosopher`;
                    navigator.clipboard.writeText(text).then(() => {
                      alert('语录已复制到剪贴板！');
                    });
                  }}
                  className="flex-1 btn-apple-primary text-sm py-2.5">
                  <Download className="w-4 h-4 mr-1" />
                  复制分享
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
