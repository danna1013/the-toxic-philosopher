import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, User, Shield, Swords } from "lucide-react";
import NavBar from "@/components/NavBar";
import StarField from "@/components/StarField";

interface Philosopher {
  id: string;
  name: string;
  nameEn: string;
  image: string;
  color: string;
  aiStance?: 'pro' | 'con' | 'neutral';
  aiReason?: string;
}

const philosophers: Philosopher[] = [
  { id: 'socrates', name: '苏格拉底', nameEn: 'Socrates', image: '/web-socrates.webp', color: '#fcd34d' },
  { id: 'nietzsche', name: '尼采', nameEn: 'Nietzsche', image: '/web-nietzsche.webp', color: '#fb923c' },
  { id: 'wittgenstein', name: '维特根斯坦', nameEn: 'Wittgenstein', image: '/web-wittgenstein.webp', color: '#d4a574' },
  { id: 'kant', name: '康德', nameEn: 'Kant', image: '/web-kant.webp', color: '#60a5fa' },
  { id: 'freud', name: '弗洛伊德', nameEn: 'Freud', image: '/web-freud.webp', color: '#a78bfa' },
];

const topicStances: Record<string, { pro: string, con: string }> = {
  '996是奋斗还是剥削?': { pro: '996是奋斗的必经之路', con: '996是对员工的剥削' },
  '35岁程序员真的没有出路吗?': { pro: '35岁是程序员的职业分水岭', con: '35岁焦虑是伪命题' },
  '快乐重要还是意义重要?': { pro: '快乐是人生的终极目标', con: '有意义的人生比快乐更重要' },
  '社交媒体让人更孤独了吗?': { pro: '社交媒体加剧了孤独感', con: '社交媒体拓展了社交圈' },
  '真爱存在吗?': { pro: '真爱是客观存在的', con: '真爱只是浪漫化的幻想' },
  '理性恋爱好还是感性恋爱好?': { pro: '理性恋爱更长久', con: '感性恋爱更真实' },
};

const philosopherStances: Record<string, Record<string, { stance: 'pro' | 'con', reason: string }>> = {
  '996是奋斗还是剥削?': {
    'socrates': { stance: 'con', reason: '认识自己，方知何为美德' },
    'nietzsche': { stance: 'pro', reason: '超越自我需要极致努力' },
    'wittgenstein': { stance: 'con', reason: '语言界定生活的边界' },
    'kant': { stance: 'con', reason: '人不可作为工具使用' },
    'freud': { stance: 'con', reason: '压抑导致心理疾病' },
  },
  '35岁程序员真的没有出路吗?': {
    'socrates': { stance: 'con', reason: '持续学习超越年龄限制' },
    'nietzsche': { stance: 'con', reason: '价值由创造意志定义' },
    'wittgenstein': { stance: 'con', reason: '35岁只是语言游戏标签' },
    'kant': { stance: 'con', reason: '每个人皆可自为目的' },
    'freud': { stance: 'pro', reason: '年龄焦虑反映社会超我' },
  },
  '快乐重要还是意义重要?': {
    'socrates': { stance: 'con', reason: '认识自我方能导向幸福' },
    'nietzsche': { stance: 'con', reason: '意义超越瞬间快乐' },
    'wittgenstein': { stance: 'con', reason: '意义构成生活的形式' },
    'kant': { stance: 'con', reason: '道德法则赋予普遍意义' },
    'freud': { stance: 'pro', reason: '快乐原则是基本驱动力' },
  },
  '社交媒体让人更孤独了吗?': {
    'socrates': { stance: 'pro', reason: '真实连接胜于虚拟互动' },
    'nietzsche': { stance: 'pro', reason: '虚拟连接掩盖真实孤独' },
    'wittgenstein': { stance: 'pro', reason: '虚拟互动难填真实孤独' },
    'kant': { stance: 'pro', reason: '虚拟交流不能取代真实' },
    'freud': { stance: 'con', reason: '提供新的欲望满足渠道' },
  },
  '真爱存在吗?': {
    'socrates': { stance: 'pro', reason: '认识自己方能识真爱' },
    'nietzsche': { stance: 'con', reason: '真爱是权力意志的投射' },
    'wittgenstein': { stance: 'con', reason: '真爱是语言游戏的幻象' },
    'kant': { stance: 'pro', reason: '真爱体现理性道德法则' },
    'freud': { stance: 'pro', reason: '真爱是本我与自我的融合' },
  },
  '理性恋爱好还是感性恋爱好?': {
    'socrates': { stance: 'pro', reason: '理性认识自己与他人' },
    'nietzsche': { stance: 'con', reason: '感性激发生命创造力' },
    'wittgenstein': { stance: 'con', reason: '感性是生活的真实表达' },
    'kant': { stance: 'pro', reason: '理性赋予普遍道德法则' },
    'freud': { stance: 'con', reason: '无意识情感驱动真实关系' },
  },
};

const getAIStance = (philosopherId: string, topic: string): { stance: 'pro' | 'con', reason: string } => {
  const topicData = philosopherStances[topic];
  if (topicData && topicData[philosopherId]) return topicData[philosopherId];
  return { stance: Math.random() > 0.5 ? 'pro' : 'con', reason: '基于其哲学思想倾向' };
};

export default function ArenaCampSetup() {
  const [, setLocation] = useLocation();
  const [proSide, setProSide] = useState<string[]>([]);
  const [conSide, setConSide] = useState<string[]>([]);
  const [unassigned, setUnassigned] = useState<string[]>([]);
  const [philosophersWithStance, setPhilosophersWithStance] = useState<Philosopher[]>(philosophers);
  const [draggedPhilosopher, setDraggedPhilosopher] = useState<string | null>(null);
  const [proStance, setProStance] = useState<string>('');
  const [conStance, setConStance] = useState<string>('');
  const [userSide, setUserSide] = useState<'pro' | 'con' | 'audience'>('audience');
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState<string>('');

  const arenaMode = sessionStorage.getItem('arenaMode') || 'basic';
  const isBasicMode = arenaMode === 'basic';

  useEffect(() => {
    const initializeStances = async () => {
      const userTopic = sessionStorage.getItem('arenaTopic') || '';
      if (topicStances[userTopic]) {
        setTopic(userTopic);
        setProStance(topicStances[userTopic].pro);
        setConStance(topicStances[userTopic].con);
        const philosophersWithAI = philosophers.map(p => {
          const { stance, reason } = getAIStance(p.id, userTopic);
          return { ...p, aiStance: stance, aiReason: reason };
        });
        setPhilosophersWithStance(philosophersWithAI);
        const pro: string[] = [], con: string[] = [];
        philosophersWithAI.forEach(p => { (p.aiStance === 'pro' ? pro : con).push(p.id); });
        setProSide(pro);
        setConSide(con);
      } else {
        await generateCustomTopicStances();
      }
    };
    initializeStances();
  }, []);

  const generateCustomTopicStances = async () => {
    setIsGenerating(true);
    const userTopic = sessionStorage.getItem('arenaTopic') || '';
    try {
      const response = await fetch('/api/generate-stances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: userTopic }),
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (data.topic) { setTopic(data.topic); sessionStorage.setItem('arenaTopic', data.topic); }
      setProStance(data.pro_stance);
      setConStance(data.con_stance);
      const philosophersWithAI = philosophers.map(p => {
        const pd = data.philosophers.find((x: any) => x.id === p.id);
        return pd ? { ...p, aiStance: pd.stance as 'pro' | 'con', aiReason: pd.reason } : p;
      });
      setPhilosophersWithStance(philosophersWithAI);
      const pro: string[] = [], con: string[] = [];
      philosophersWithAI.forEach(p => { if (p.aiStance === 'pro') pro.push(p.id); else if (p.aiStance === 'con') con.push(p.id); });
      setProSide(pro); setConSide(con);
    } catch {
      setTopic(userTopic);
      setProStance(`支持: ${userTopic}`);
      setConStance(`反对: ${userTopic}`);
      const philosophersWithAI = philosophers.map(p => ({
        ...p, aiStance: (Math.random() > 0.5 ? 'pro' : 'con') as 'pro' | 'con', aiReason: '基于其哲学思想倾向'
      }));
      setPhilosophersWithStance(philosophersWithAI);
      const pro: string[] = [], con: string[] = [];
      philosophersWithAI.forEach(p => { (p.aiStance === 'pro' ? pro : con).push(p.id); });
      setProSide(pro); setConSide(con);
    } finally { setIsGenerating(false); }
  };

  const handleDragStart = (id: string) => setDraggedPhilosopher(id);
  const handleDragEnd = () => setDraggedPhilosopher(null);

  const moveTo = (target: 'pro' | 'con' | 'unassigned') => {
    if (!draggedPhilosopher) return;
    const id = draggedPhilosopher;
    setProSide(prev => prev.filter(x => x !== id));
    setConSide(prev => prev.filter(x => x !== id));
    setUnassigned(prev => prev.filter(x => x !== id));
    if (target === 'pro') setProSide(prev => [...prev, id]);
    else if (target === 'con') setConSide(prev => [...prev, id]);
    else setUnassigned(prev => [...prev, id]);
    setDraggedPhilosopher(null);
  };

  const handleContinue = () => {
    const proCount = proSide.length + (userSide === 'pro' ? 1 : 0);
    const conCount = conSide.length + (userSide === 'con' ? 1 : 0);
    if (proCount === 0 || conCount === 0) { alert('正方和反方必须至少各有一位参赛者!'); return; }
    sessionStorage.setItem('arenaProSide', JSON.stringify(proSide));
    sessionStorage.setItem('arenaConSide', JSON.stringify(conSide));
    sessionStorage.setItem('arenaProStance', proStance);
    sessionStorage.setItem('arenaConStance', conStance);
    sessionStorage.setItem('arenaUnassigned', JSON.stringify(unassigned));
    sessionStorage.setItem('arenaUserSide', userSide);
    setLocation(isBasicMode ? '/arena/debate/basic' : '/arena/debate/custom');
  };

  const proCount = proSide.length + (userSide === 'pro' ? 1 : 0);
  const conCount = conSide.length + (userSide === 'con' ? 1 : 0);
  const canStart = proCount > 0 && conCount > 0 && !isGenerating;

  const renderPhilosopher = (id: string) => {
    const phil = philosophersWithStance.find(p => p.id === id);
    if (!phil) return null;
    return (
      <div
        key={id}
        draggable={!isBasicMode}
        onDragStart={!isBasicMode ? () => handleDragStart(id) : undefined}
        onDragEnd={!isBasicMode ? handleDragEnd : undefined}
        className={`flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8 transition-all ${
          !isBasicMode ? 'cursor-move hover:bg-white/8 hover:border-white/15' : ''
        }`}
      >
        {phil.image ? (
          <img src={phil.image} alt={phil.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: `${phil.color}20`, color: phil.color, border: `1px solid ${phil.color}30` }}>
            {phil.name[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/80">{phil.name}</p>
          {phil.aiReason && <p className="text-[11px] text-white/35 truncate">{phil.aiReason}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <NavBar />
      <StarField count={120} />
      <div className="absolute inset-0 cosmic-bg pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-6 pt-28 pb-16">
        {/* Topic Title */}
        {!isGenerating && topic && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight gradient-text mb-2">{topic}</h1>
            <p className="text-xs text-white/30">立场由哲学家本人观点和生平经历所决定</p>
          </motion.div>
        )}

        {isGenerating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8 glass-card p-8">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-4" />
            <p className="text-lg font-bold text-white/80 mb-1">AI 正在分析辩题</p>
            <p className="text-sm text-white/40">生成正反方立场和哲学家观点...</p>
          </motion.div>
        )}

        {!isBasicMode && !isGenerating && (
          <p className="text-sm text-white/30 mb-6">拖动哲学家卡片到不同阵营，自由配置辩论双方</p>
        )}

        {/* Camp Layout */}
        <div className="w-full max-w-5xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pro Side */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => moveTo('pro')}
              className={`glass-card overflow-hidden transition-all ${
                draggedPhilosopher ? 'border-blue-500/30 ring-1 ring-blue-500/20' : ''
              }`}
            >
              <div className="px-5 py-4 border-b border-white/8" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, transparent 100%)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold text-blue-400">正方</span>
                    <span className="text-xs text-white/30">({proCount})</span>
                  </div>
                </div>
                <p className="text-xs text-white/40 mt-1 truncate">{proStance || '生成中...'}</p>
              </div>
              <div className="p-4 space-y-2 min-h-[200px]">
                {proSide.map(id => renderPhilosopher(id))}
                {userSide === 'pro' && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-blue-400">你</span>
                  </div>
                )}
              </div>
            </div>

            {/* Audience / Unassigned */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => moveTo('unassigned')}
              className={`glass-card overflow-hidden transition-all ${
                draggedPhilosopher ? 'border-white/20 ring-1 ring-white/10' : ''
              }`}
            >
              <div className="px-5 py-4 border-b border-white/8 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white/50">观众席</span>
                  <span className="text-xs text-white/20">({unassigned.length + (userSide === 'audience' ? 1 : 0)})</span>
                </div>
                <p className="text-xs text-white/25 mt-1">待分配或观看</p>
              </div>
              <div className="p-4 space-y-2 min-h-[200px]">
                {unassigned.map(id => renderPhilosopher(id))}
                {userSide === 'audience' && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-white/50" />
                    </div>
                    <span className="text-sm font-medium text-white/50">你（观众）</span>
                  </div>
                )}
                {unassigned.length === 0 && userSide !== 'audience' && (
                  <div className="flex items-center justify-center h-32 text-white/20 text-sm">
                    所有哲学家已分配
                  </div>
                )}
              </div>
            </div>

            {/* Con Side */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => moveTo('con')}
              className={`glass-card overflow-hidden transition-all ${
                draggedPhilosopher ? 'border-rose-500/30 ring-1 ring-rose-500/20' : ''
              }`}
            >
              <div className="px-5 py-4 border-b border-white/8" style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.15) 0%, transparent 100%)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Swords className="w-4 h-4 text-rose-400" />
                    <span className="text-sm font-bold text-rose-400">反方</span>
                    <span className="text-xs text-white/30">({conCount})</span>
                  </div>
                </div>
                <p className="text-xs text-white/40 mt-1 truncate">{conStance || '生成中...'}</p>
              </div>
              <div className="p-4 space-y-2 min-h-[200px]">
                {conSide.map(id => renderPhilosopher(id))}
                {userSide === 'con' && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-rose-400" />
                    </div>
                    <span className="text-sm font-medium text-rose-400">你</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Role Selection (Full mode only) */}
        {!isBasicMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-3xl mb-8"
          >
            <p className="text-sm font-medium text-white/50 text-center mb-4">选择你的角色</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'pro' as const, label: '正方辩手', desc: proStance, color: '#3b82f6' },
                { key: 'audience' as const, label: '观众', desc: '观看辩论不参与', color: '#6b7280' },
                { key: 'con' as const, label: '反方辩手', desc: conStance, color: '#f43f5e' },
              ].map(({ key, label, desc, color }) => (
                <button
                  key={key}
                  onClick={() => setUserSide(key)}
                  disabled={isGenerating}
                  className={`p-4 rounded-xl text-left transition-all duration-300 ${
                    userSide === key
                      ? 'ring-1'
                      : 'bg-white/5 border border-white/8 hover:border-white/15'
                  }`}
                  style={userSide === key ? {
                    background: `${color}15`,
                    borderColor: `${color}40`,
                    boxShadow: `0 0 20px ${color}10`,
                    border: `1px solid ${color}40`,
                    ringColor: `${color}30`,
                  } : {}}
                >
                  <p className="text-sm font-bold mb-1" style={{ color: userSide === key ? color : 'rgba(255,255,255,0.7)' }}>
                    {label}
                  </p>
                  <p className="text-[11px] text-white/35 truncate">{desc || '生成中...'}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button onClick={() => setLocation('/arena/topic')} className="btn-apple-secondary text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </button>
          <button
            onClick={handleContinue}
            disabled={!canStart}
            className="btn-apple-primary text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            开始辩论
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
