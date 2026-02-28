import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle, Swords, Sparkles } from "lucide-react";
import NavBar from "@/components/NavBar";
import StarField from "@/components/StarField";

const philosophers = [
  { name: "苏格拉底", nameEn: "Socrates", style: "连环追问", color: "#fcd34d" },
  { name: "尼采", nameEn: "Nietzsche", style: "鞭笞激励", color: "#fb923c" },
  { name: "维特根斯坦", nameEn: "Wittgenstein", style: "逻辑解构", color: "#d4a574" },
  { name: "康德", nameEn: "Kant", style: "道德审判", color: "#60a5fa" },
  { name: "弗洛伊德", nameEn: "Freud", style: "潜意识透视", color: "#a78bfa" },
  { name: "庄子", nameEn: "Zhuangzi", style: "逍遥反讽", color: "#34d399" },
  { name: "叔本华", nameEn: "Schopenhauer", style: "悲观毒舌", color: "#94a3b8" },
  { name: "萨特", nameEn: "Sartre", style: "存在拷问", color: "#f472b6" },
  { name: "马基雅维利", nameEn: "Machiavelli", style: "权谋冷析", color: "#ef4444" },
  { name: "第欧根尼", nameEn: "Diogenes", style: "犬儒嘲讽", color: "#a3e635" },
  { name: "波伏娃", nameEn: "Beauvoir", style: "女性主义审视", color: "#e879f9" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <NavBar />
      <StarField count={250} />

      {/* Cosmic gradient overlay */}
      <div className="absolute inset-0 cosmic-bg pointer-events-none" />

      {/* ===== Hero Section ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-sm md:text-base font-medium tracking-[0.3em] text-white/40 uppercase mb-6"
          >
            不提供廉价安慰，只提供真相
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6"
          >
            <span className="gradient-text">真相往往</span>
            <br />
            <span className="gradient-text-purple">不太礼貌</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-lg md:text-xl lg:text-2xl text-white/50 font-light tracking-wide mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            与 AI 哲学家进行犀利深度对话的沉浸式应用
            <br className="hidden md:block" />
            但总比谎言有用
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <button
              onClick={() => setLocation("/select")}
              className="btn-apple-primary text-base md:text-lg group"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              一对一开怼
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setLocation("/arena/mode")}
              className="btn-apple-secondary text-base md:text-lg group"
            >
              <Swords className="w-5 h-5 mr-2" />
              哲学奇葩说
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/30 tracking-widest">SCROLL</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-bounce-gentle" />
          </div>
        </motion.div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 gradient-text">
              两种深度体验
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              选择你的哲学之旅
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Feature 1: One-on-One */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onMouseEnter={() => setHoveredFeature(0)}
              onMouseLeave={() => setHoveredFeature(null)}
              onClick={() => setLocation("/select")}
              className="glass-card p-8 md:p-10 cursor-pointer group transition-all duration-500 hover:border-indigo-500/30"
              style={{
                transform: hoveredFeature === 0 ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <MessageCircle className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white/95">一对一开怼</h3>
              <p className="text-white/50 text-base leading-relaxed mb-6">
                选择或自定义一位哲学家，进入深度对话。苏格拉底用反问逼你自相矛盾，尼采用鞭笞激发你的意志，弗洛伊德透视你话语背后的真相。
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['流式输出', '情绪感知', '四级语气调节', '海报生成'].map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-white/50 border border-white/8">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center text-indigo-400 text-sm font-medium group-hover:text-indigo-300 transition-colors">
                开始对话
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </motion.div>

            {/* Feature 2: Debate Arena */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              onMouseEnter={() => setHoveredFeature(1)}
              onMouseLeave={() => setHoveredFeature(null)}
              onClick={() => setLocation("/arena/mode")}
              className="glass-card p-8 md:p-10 cursor-pointer group transition-all duration-500 hover:border-rose-500/30"
              style={{
                transform: hoveredFeature === 1 ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Swords className="w-7 h-7 text-rose-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white/95">哲学奇葩说</h3>
              <p className="text-white/50 text-base leading-relaxed mb-6">
                多位哲学家围绕辩题展开激烈辩论。观看神仙打架，或亲自下场参与。50位 AI 观众实时投票，裁判判定胜负并评选 BB King。
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['基础/完整模式', '正反方辩论', 'AI观众投票', 'BB King评选'].map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-white/50 border border-white/8">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center text-rose-400 text-sm font-medium group-hover:text-rose-300 transition-colors">
                进入辩论场
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Philosophers Section ===== */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 gradient-text">
              11位哲学家 + 无限自定义
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              每位哲学家都有独特的毒舌风格，等你来挑战
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {philosophers.map((phil, i) => (
              <motion.div
                key={phil.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="glass-card p-4 text-center group cursor-pointer hover:border-white/20 transition-all duration-300"
                onClick={() => setLocation("/select")}
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${phil.color}30, ${phil.color}10)`,
                    border: `1px solid ${phil.color}40`,
                    color: phil.color,
                  }}
                >
                  {phil.name[0]}
                </div>
                <p className="text-sm font-medium text-white/80 mb-0.5">{phil.name}</p>
                <p className="text-[10px] text-white/30 tracking-wider">{phil.style}</p>
              </motion.div>
            ))}

            {/* Custom philosopher card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="glass-card p-4 text-center group cursor-pointer hover:border-white/20 transition-all duration-300 border-dashed"
              onClick={() => setLocation("/select")}
            >
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-lg border border-dashed border-white/20 group-hover:border-white/40 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
              </div>
              <p className="text-sm font-medium text-white/60 mb-0.5">自定义</p>
              <p className="text-[10px] text-white/30 tracking-wider">任意思想家</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Quote Section ===== */}
      <section className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-6xl md:text-8xl font-serif text-white/10 mb-4">"</div>
            <p className="text-xl md:text-2xl lg:text-3xl font-light text-white/60 leading-relaxed italic mb-8">
              未经审视的人生不值得过
            </p>
            <p className="text-sm text-white/30 tracking-[0.3em] uppercase">
              — 苏格拉底
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-sm font-medium text-white/40">毒舌哲学家</span>
            <span className="text-xs text-white/20 tracking-[0.2em] uppercase mt-1">The Toxic Philosopher</span>
          </div>
          <p className="text-xs text-white/20">
            真相往往不太礼貌，但总比谎言有用。
          </p>
        </div>
      </footer>
    </div>
  );
}
