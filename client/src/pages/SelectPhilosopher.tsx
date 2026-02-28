import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Plus, X } from 'lucide-react';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';

interface Philosopher {
  id: string;
  name: string;
  nameEn: string;
  warning: string;
  description: string;
  style: string;
  image: string;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  startAngle: number;
}

const defaultPhilosophers: Philosopher[] = [
  {
    id: 'socrates', name: '苏格拉底', nameEn: 'Socrates',
    warning: '你真的懂吗?', description: '古希腊"街头杠精"，专治各种不懂装懂。用反问逼你自相矛盾。',
    style: '连环追问，步步紧逼', image: '/web-socrates.webp',
    color: '#fcd34d', orbitRadius: 90, orbitSpeed: 35, size: 52, startAngle: 0,
  },
  {
    id: 'nietzsche', name: '尼采', nameEn: 'Nietzsche',
    warning: '别这么平庸', description: '宣布"上帝已死"的哲学摇滚巨星。用鞭笞激发你的意志。',
    style: '激烈批判，充满力量', image: '/web-nietzsche.webp',
    color: '#fb923c', orbitRadius: 140, orbitSpeed: 45, size: 60, startAngle: 72,
  },
  {
    id: 'wittgenstein', name: '维特根斯坦', nameEn: 'Wittgenstein',
    warning: '你的逻辑有问题', description: '哲学界的"拆墙工"，专拆语言骗局。用逻辑精准打击。',
    style: '逻辑解构，精准打击', image: '/web-wittgenstein.webp',
    color: '#d4a574', orbitRadius: 195, orbitSpeed: 55, size: 56, startAngle: 144,
  },
  {
    id: 'kant', name: '康德', nameEn: 'Kant',
    warning: '你配谈道德吗?', description: '准时散步的"哥尼斯堡时钟"，用道德律令审判一切。',
    style: '冷静剖析，道德审判', image: '/web-kant.webp',
    color: '#60a5fa', orbitRadius: 250, orbitSpeed: 65, size: 54, startAngle: 216,
  },
  {
    id: 'freud', name: '弗洛伊德', nameEn: 'Freud',
    warning: '你在压抑什么?', description: '告诉你"你并不完全是自己的主人"。用潜意识透视真相。',
    style: '本能揭露，深层剖析', image: '/web-freud.webp',
    color: '#a78bfa', orbitRadius: 305, orbitSpeed: 75, size: 50, startAngle: 288,
  },
  {
    id: 'zhuangzi', name: '庄子', nameEn: 'Zhuangzi',
    warning: '你确定你是醒着的?', description: '梦蝶的逍遥者，用寓言和反讽消解你的执念。',
    style: '逍遥反讽，消解执念', image: '',
    color: '#34d399', orbitRadius: 130, orbitSpeed: 40, size: 48, startAngle: 36,
  },
  {
    id: 'schopenhauer', name: '叔本华', nameEn: 'Schopenhauer',
    warning: '人生本就是苦', description: '悲观主义大师，用冷酷的真相击碎你的幻想。',
    style: '悲观毒舌，冷酷真相', image: '',
    color: '#94a3b8', orbitRadius: 170, orbitSpeed: 50, size: 46, startAngle: 108,
  },
  {
    id: 'sartre', name: '萨特', nameEn: 'Sartre',
    warning: '你在逃避自由', description: '存在主义旗手，告诉你"人是被判定为自由的"。',
    style: '存在拷问，自由审判', image: '',
    color: '#f472b6', orbitRadius: 225, orbitSpeed: 60, size: 44, startAngle: 180,
  },
  {
    id: 'machiavelli', name: '马基雅维利', nameEn: 'Machiavelli',
    warning: '你太天真了', description: '《君主论》作者，用冷酷的权谋逻辑拆解你的理想主义。',
    style: '权谋冷析，现实主义', image: '',
    color: '#ef4444', orbitRadius: 280, orbitSpeed: 70, size: 42, startAngle: 252,
  },
  {
    id: 'diogenes', name: '第欧根尼', nameEn: 'Diogenes',
    warning: '别挡我的阳光', description: '住在木桶里的犬儒哲学家，用行为艺术嘲讽一切虚伪。',
    style: '犬儒嘲讽，行为艺术', image: '',
    color: '#a3e635', orbitRadius: 340, orbitSpeed: 80, size: 40, startAngle: 324,
  },
  {
    id: 'beauvoir', name: '波伏娃', nameEn: 'Beauvoir',
    warning: '你不是天生如此', description: '《第二性》作者，用女性主义视角审视你的性别偏见。',
    style: '女性主义审视', image: '',
    color: '#e879f9', orbitRadius: 160, orbitSpeed: 42, size: 46, startAngle: 160,
  },
];

export default function SelectPhilosopher() {
  const [, setLocation] = useLocation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 200);
  }, []);

  const hoveredPhil = useMemo(() => {
    if (!hoveredId) return null;
    return defaultPhilosophers.find(p => p.id === hoveredId) || null;
  }, [hoveredId]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setTimeout(() => {
      setLocation(`/chat/${id}`);
    }, 800);
  };

  const handleCustomStart = () => {
    if (!customName.trim()) return;
    const customId = `custom_${encodeURIComponent(customName)}`;
    sessionStorage.setItem('customPhilosopherName', customName);
    sessionStorage.setItem('customPhilosopherTopic', customTopic);
    setSelectedId(customId);
    setTimeout(() => {
      setLocation(`/chat/${customId}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <NavBar />
      <StarField count={300} />

      {/* Cosmic gradient */}
      <div className="absolute inset-0 cosmic-bg pointer-events-none" />

      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
        <div className="absolute inset-0 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(168, 85, 247, 0.2) 30%, transparent 70%)' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-20 pb-12 px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3 gradient-text">
            选择你的对手
          </h1>
          <p className="text-white/40 text-base md:text-lg">
            宇宙不在乎你的困惑，选一个哲学家来拷问你的灵魂
          </p>
        </motion.div>

        {/* Planet System - Solar system layout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative w-full max-w-[750px] aspect-square mx-auto"
        >
          {/* Orbit rings */}
          {[90, 130, 140, 160, 170, 195, 225, 250, 280, 305, 340].map((radius, i) => (
            <div
              key={`orbit-${i}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]"
              style={{ width: radius * 2, height: radius * 2 }}
            />
          ))}

          {/* Center sun */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(99,102,241,0.1) 50%, transparent 70%)',
                boxShadow: '0 0 40px rgba(99,102,241,0.3), 0 0 80px rgba(99,102,241,0.1)',
              }}>
              <span className="text-xs text-white/40 font-medium tracking-wider">哲</span>
            </div>
          </div>

          {/* Philosopher planets */}
          {defaultPhilosophers.map((phil, i) => {
            const angle = phil.startAngle * (Math.PI / 180);
            const x = Math.cos(angle) * phil.orbitRadius;
            const y = Math.sin(angle) * phil.orbitRadius;
            const isHovered = hoveredId === phil.id;
            const isSelected = selectedId === phil.id;
            const isOtherSelected = selectedId && selectedId !== phil.id;

            return (
              <motion.div
                key={phil.id}
                className="absolute top-1/2 left-1/2 z-20 cursor-pointer"
                style={{
                  width: phil.size,
                  height: phil.size,
                  marginLeft: -phil.size / 2,
                  marginTop: -phil.size / 2,
                }}
                initial={{ x, y, opacity: 0, scale: 0 }}
                animate={{
                  x,
                  y,
                  opacity: isOtherSelected ? 0 : 1,
                  scale: isSelected ? 2 : isHovered ? 1.25 : 1,
                }}
                transition={{
                  x: { duration: 0 },
                  y: { duration: 0 },
                  opacity: { duration: 0.5, delay: i * 0.05 },
                  scale: { duration: 0.4, type: 'spring', stiffness: 300 },
                }}
                onMouseEnter={() => setHoveredId(phil.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleSelect(phil.id)}
              >
                {/* Planet glow */}
                <div
                  className="absolute inset-[-50%] rounded-full transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle, ${phil.color}40 0%, transparent 70%)`,
                    opacity: isHovered ? 1 : 0,
                    filter: 'blur(10px)',
                  }}
                />

                {/* Planet body */}
                <div
                  className="relative w-full h-full rounded-full flex items-center justify-center overflow-hidden transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${phil.color}30 0%, ${phil.color}10 100%)`,
                    border: `1.5px solid ${isHovered ? phil.color + '60' : phil.color + '25'}`,
                    boxShadow: isHovered
                      ? `0 0 20px ${phil.color}30, inset 0 1px 0 ${phil.color}20`
                      : `inset 0 1px 0 ${phil.color}10`,
                  }}
                >
                  {phil.image ? (
                    <img
                      src={phil.image}
                      alt={phil.name}
                      className="w-[85%] h-[85%] object-cover rounded-full"
                      loading="lazy"
                    />
                  ) : (
                    <span
                      className="text-lg font-bold"
                      style={{ color: phil.color }}
                    >
                      {phil.name[0]}
                    </span>
                  )}
                </div>

                {/* Name label */}
                <div
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity duration-300"
                  style={{ opacity: isHovered ? 1 : 0.6 }}
                >
                  <span className="text-[11px] font-medium" style={{ color: phil.color }}>
                    {phil.name}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Custom planet button */}
          <motion.div
            className="absolute top-1/2 left-1/2 z-20 cursor-pointer"
            style={{
              width: 44,
              height: 44,
              marginLeft: -22,
              marginTop: -22,
            }}
            initial={{ opacity: 0 }}
            animate={{
              x: Math.cos(60 * Math.PI / 180) * 360,
              y: Math.sin(60 * Math.PI / 180) * 360,
              opacity: selectedId ? 0 : 1,
            }}
            transition={{ opacity: { duration: 0.5, delay: 0.6 } }}
            onClick={() => setShowCustom(true)}
          >
            <div className="w-full h-full rounded-full border border-dashed border-white/20 flex items-center justify-center hover:border-white/40 hover:bg-white/5 transition-all duration-300 group">
              <Plus className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-40">
              <span className="text-[10px] text-white/60">自定义</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Hovered philosopher info panel */}
        <AnimatePresence>
          {hoveredPhil && !selectedId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-card-strong px-8 py-5 max-w-md text-center"
            >
              <p className="text-base font-semibold mb-1" style={{ color: hoveredPhil.color }}>
                {hoveredPhil.name}
                <span className="text-white/30 text-sm font-normal ml-2">{hoveredPhil.nameEn}</span>
              </p>
              <p className="text-sm text-white/50 mb-2">{hoveredPhil.description}</p>
              <p className="text-xs text-white/30 italic">"{hoveredPhil.warning}"</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Philosopher Modal */}
      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={() => setShowCustom(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative glass-card-strong p-8 max-w-md w-full"
            >
              <button
                onClick={() => setShowCustom(false)}
                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white/90">自定义思想家</h3>
                  <p className="text-xs text-white/40">输入任意思想家的名字</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/50 mb-2 block">思想家名称</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="例如：孔子、柏拉图、鲁迅..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/50 mb-2 block">想聊的话题（可选）</label>
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="例如：人生的意义、爱情、自由..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  />
                </div>
                <button
                  onClick={handleCustomStart}
                  disabled={!customName.trim()}
                  className="w-full btn-apple-primary disabled:opacity-30 disabled:cursor-not-allowed mt-2"
                >
                  开始对话
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
