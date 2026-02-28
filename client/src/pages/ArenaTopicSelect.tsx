import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Pen, Check, Sparkles } from "lucide-react";
import NavBar from "@/components/NavBar";
import StarField from "@/components/StarField";

const PRESET_TOPICS = [
  { id: "996-struggle-or-exploitation", title: "996是奋斗还是剥削?", category: "职场伦理", description: "互联网行业的加班文化,究竟是个人奋斗的选择还是对员工的剥削?", color: "#f59e0b" },
  { id: "programmer-35-crisis", title: "35岁程序员真的没有出路吗?", category: "职业发展", description: "35岁是程序员的职业分水岭,还是社会制造的焦虑?", color: "#3b82f6" },
  { id: "happiness-vs-meaning", title: "快乐重要还是意义重要?", category: "人生哲学", description: "在快乐与意义之间,哪个才是人生的终极追求?", color: "#a855f7" },
  { id: "social-media-loneliness", title: "社交媒体让人更孤独了吗?", category: "现代生活", description: "社交媒体是拓展了我们的社交圈,还是加剧了孤独感?", color: "#06b6d4" },
  { id: "true-love-exists", title: "真爱存在吗?", category: "爱情哲学", description: "真爱是客观存在的现象,还是浪漫化的幻想?", color: "#f43f5e" },
  { id: "rational-vs-emotional-love", title: "理性恋爱好还是感性恋爱好?", category: "恋爱观", description: "理性的恋爱更长久,还是感性的恋爱更真实?", color: "#10b981" },
];

export default function ArenaTopicSelect() {
  const [, setLocation] = useLocation();
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [customTopic, setCustomTopic] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const arenaMode = sessionStorage.getItem("arenaMode") || "basic";

  const handleContinue = () => {
    const topic = showCustomInput ? customTopic : PRESET_TOPICS.find(t => t.id === selectedTopic)?.title || "";
    if (!topic.trim()) return;
    sessionStorage.setItem('arenaTopic', topic);
    setLocation('/arena/camp');
  };

  const isReady = showCustomInput ? customTopic.trim().length > 0 : selectedTopic.length > 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <NavBar />
      <StarField count={150} />
      <div className="absolute inset-0 cosmic-bg pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-6 pt-28 pb-16">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 gradient-text">
            选择辩论话题
          </h1>
          <p className="text-white/40 text-base">
            {arenaMode === "basic" ? "从预设辩题中选择一个开始" : "预设辩题或自定义你想讨论的话题"}
          </p>
        </motion.div>

        {/* Topic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full mb-8">
          {PRESET_TOPICS.map((topic, i) => {
            const isSelected = selectedTopic === topic.id && !showCustomInput;
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                onClick={() => {
                  setSelectedTopic(topic.id);
                  setShowCustomInput(false);
                }}
                className={`glass-card p-6 cursor-pointer group transition-all duration-300 ${
                  isSelected ? 'border-white/30 ring-1 ring-white/20' : 'hover:border-white/15'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-medium tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: `${topic.color}15`, color: topic.color, border: `1px solid ${topic.color}30` }}>
                    {topic.category}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white/90 mb-2 leading-snug">{topic.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{topic.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Topic */}
        {arenaMode === "full" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-full max-w-2xl mb-8"
          >
            <button
              onClick={() => {
                setShowCustomInput(!showCustomInput);
                setSelectedTopic("");
              }}
              className={`w-full glass-card p-6 text-left transition-all duration-300 ${
                showCustomInput ? 'border-purple-500/30 ring-1 ring-purple-500/20' : 'hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Pen className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white/90">自定义话题</h3>
                  <p className="text-xs text-white/40">输入你想要辩论的任何哲学问题</p>
                </div>
                {showCustomInput && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-purple-400" />
                  </div>
                )}
              </div>
            </button>

            <AnimatePresence>
              {showCustomInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3">
                    <textarea
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="例如: 人工智能会产生意识吗？"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all resize-none"
                      rows={3}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={() => setLocation("/arena/mode")}
            className="btn-apple-secondary text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </button>
          <button
            onClick={handleContinue}
            disabled={!isReady}
            className="btn-apple-primary text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            继续
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
