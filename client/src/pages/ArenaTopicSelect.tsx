import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const PRESET_TOPICS = [
  {
    id: "996-struggle-or-exploitation",
    title: "996是奋斗还是剥削?",
    category: "职场伦理",
    description: "互联网行业的加班文化,究竟是个人奋斗的选择还是对员工的剥削?"
  },
  {
    id: "programmer-35-crisis",
    title: "35岁程序员真的没有出路吗?",
    category: "职业发展",
    description: "35岁是程序员的职业分水岭,还是社会制造的焦虑?"
  },
  {
    id: "happiness-vs-meaning",
    title: "快乐重要还是意义重要?",
    category: "人生哲学",
    description: "在快乐与意义之间,哪个才是人生的终极追求?"
  },
  {
    id: "social-media-loneliness",
    title: "社交媒体让人更孤独了吗?",
    category: "现代生活",
    description: "社交媒体是拓展了我们的社交圈,还是加剧了孤独感?"
  },
  {
    id: "true-love-exists",
    title: "真爱存在吗?",
    category: "爱情哲学",
    description: "真爱是客观存在的现象,还是浪漫化的幻想?"
  },
  {
    id: "rational-vs-emotional-love",
    title: "理性恋爱好还是感性恋爱好?",
    category: "恋爱观",
    description: "理性的恋爱更长久,还是感性的恋爱更真实?"
  }
];

export default function ArenaTopicSelect() {
  const [, setLocation] = useLocation();
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [customTopic, setCustomTopic] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [containerHeight, setContainerHeight] = useState('100vh');
  
  // 检查是否为基础模式
  const arenaMode = sessionStorage.getItem("arenaMode") || "basic";

  useEffect(() => {
    // 检测浏览器对zoom的支持：Chrome/Edge需要166.67vh，Safari使用00vh
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isEdge = /Edg/.test(navigator.userAgent);
    if (isChrome || isEdge) {
      setContainerHeight('166.67vh');
    }
  }, []);

  const handleContinue = () => {
    const topic = showCustomInput ? customTopic : PRESET_TOPICS.find(t => t.id === selectedTopic)?.title || "";
    if (!topic.trim()) {
      alert("请选择或输入辩题!");
      return;
    }

    sessionStorage.setItem('arenaTopic', topic);
    
    // 立即跳转到阵营配置页
    setLocation('/arena/camp');
  };

  return (
    <div className="bg-white flex flex-col pt-20" style={{ height: containerHeight, overflow: 'auto' }}>
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="px-8 py-5 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="text-xl md:text-2xl font-bold tracking-wide">毒舌哲学家</div>
            <div className="text-xs md:text-sm font-medium tracking-[0.2em] text-gray-500">THE TOXIC PHILOSOPHER</div>
          </div>
          
          <div className="flex items-center gap-8">
            <button onClick={() => setLocation("/")} className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group">
              首页
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => setLocation("/select")} className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group">
              一对一开怀
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => setLocation("/arena/mode")} className="relative text-lg md:text-xl text-black font-medium group">
              哲学“奇葩说”
              <span className="absolute bottom-0 left-0 w-full h-px bg-black"></span>
            </button>
            <button onClick={() => setLocation("/design")} className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group">
              设计理念
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => window.open("https://forms.gle/feedback", "_blank")} className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group">
              意见反馈
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => window.open("https://forms.gle/review", "_blank")} className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group">
              求点赞评论
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="flex-1 flex flex-col items-center px-6 pt-32 pb-16">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold text-black mb-6">
            选择辩论话题
          </h1>
          <p className="text-4xl text-gray-600">
            {arenaMode === "basic" ? "从预设辩题中选择一个开始" : "预设辩题或自定义你想讨论的话题"}
          </p>
        </div>

        {/* 辩题卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mb-8">
          {PRESET_TOPICS.map((topic) => (
            <div
              key={topic.id}
              onClick={() => {
                setSelectedTopic(topic.id);
                setShowCustomInput(false);
              }}
              className={`border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selectedTopic === topic.id && !showCustomInput
                  ? "border-black bg-black"
                  : "border-gray-300 hover:border-black bg-white"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className={`text-xl font-bold ${
                  selectedTopic === topic.id && !showCustomInput ? "text-white" : "text-black"
                }`}>{topic.title}</h3>
                {selectedTopic === topic.id && !showCustomInput && (
                  <span className="text-white text-xl">✓</span>
                )}
              </div>
              <p className={`text-sm mb-3 ${
                selectedTopic === topic.id && !showCustomInput ? "text-gray-300" : "text-gray-500"
              }`}>{topic.category}</p>
              <p className={`text-sm leading-relaxed ${
                selectedTopic === topic.id && !showCustomInput ? "text-gray-200" : "text-gray-600"
              }`}>{topic.description}</p>
            </div>
          ))}
        </div>

        {/* 自定义话题 - 仅完整模式显示 */}
        {arenaMode === "full" && (
        <div className="w-full max-w-2xl mb-8">
          <button
            onClick={() => {
              setShowCustomInput(!showCustomInput);
              setSelectedTopic("");
            }}
            className={`w-full border-2 p-6 transition-all duration-300 hover:shadow-xl ${
              showCustomInput ? "border-black bg-black" : "border-gray-300 hover:border-black bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className={`text-xl font-bold mb-2 ${
                  showCustomInput ? "text-white" : "text-black"
                }`}>自定义话题</h3>
                <p className={`text-sm ${
                  showCustomInput ? "text-gray-200" : "text-gray-600"
                }`}>输入你想要辩论的任何哲学问题</p>
              </div>
              {showCustomInput && <span className="text-white text-xl">✓</span>}
            </div>
          </button>

          {showCustomInput && (
            <div className="mt-4">
              <textarea
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="例如: 人工智能会产生意识吗？"
                className="w-full border-2 border-black p-4 text-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                rows={3}
              />
            </div>
          )}
        </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <button
            onClick={() => setLocation("/arena/mode")}
            className="px-8 py-3 border-2 border-black text-black hover:bg-gray-100 transition-colors"
          >
            返回
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedTopic && !customTopic.trim()}
            className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            继续
          </button>
        </div>
      </div>
    </div>
  );
}
