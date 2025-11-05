import { useState } from "react";
import { useLocation } from "wouter";

const PRESET_TOPICS = [
  {
    id: "ai-replace-human",
    title: "AI会取代人类吗？",
    category: "科技哲学",
    description: "探讨人工智能的发展是否会导致人类被取代的哲学问题"
  },
  {
    id: "involution",
    title: "内卷是必然的吗？",
    category: "社会哲学",
    description: "分析社会竞争加剧的根本原因及其必然性"
  },
  {
    id: "truth-vs-happiness",
    title: "真相重要还是幸福重要？",
    category: "伦理学",
    description: "在真相与幸福之间,哪个更值得追求?"
  },
  {
    id: "free-will",
    title: "自由意志真的存在吗",
    category: "形而上学",
    description: "人类的选择是真正自由的,还是被因果链条决定的?"
  },
  {
    id: "meaning-of-life",
    title: "生命的意义是什么？",
    category: "存在主义",
    description: "在虚无的宇宙中,生命的意义从何而来?"
  },
  {
    id: "moral-relativity",
    title: "道德是相对的吗？",
    category: "伦理学",
    description: "道德标准是普遍的还是因文化而异的?"
  }
];

export default function ArenaTopicSelect() {
  const [, setLocation] = useLocation();
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [customTopic, setCustomTopic] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleContinue = () => {
    const topic = showCustomInput ? customTopic : PRESET_TOPICS.find(t => t.id === selectedTopic)?.title || "";
    if (!topic.trim()) {
      alert("请选择或输入一个辩题");
      return;
    }
    sessionStorage.setItem("arenaTopic", topic);
    setLocation("/arena/role");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-20">
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
            <button onClick={() => setLocation("/arena/mode")} className="relative text-lg md:text-xl text-black font-medium group">
              哲学"奇葩说"
              <span className="absolute bottom-0 left-0 w-full h-px bg-black"></span>
            </button>
            <button onClick={() => setLocation("/select")} className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group">
              一对一开怼
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => setLocation("/design")} className="relative text-lg md:text-xl text-gray-600 hover:text-black transition-colors group">
              设计理念
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="flex-1 flex flex-col items-center px-6 pt-32 pb-16">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-black mb-6">
            选择辩论话题
          </h1>
          <p className="text-2xl text-gray-600">
            预设辩题或自定义你感兴趣的哲学问题
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

        {/* 自定义话题 */}
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
