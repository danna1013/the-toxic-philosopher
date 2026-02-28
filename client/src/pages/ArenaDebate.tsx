import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Trophy, Shield, Swords, Users, Mic, MicOff } from "lucide-react";
import StarField from "@/components/StarField";

interface Message {
  id: string;
  speaker: string;
  speakerId?: string;
  role: 'host' | 'pro' | 'con' | 'user' | 'judge';
  content: string;
  timestamp: number;
  phase?: string;
}

interface Audience {
  id: string;
  name: string;
  occupation: string;
  stance: 'pro' | 'con' | 'neutral';
}

const generateAudiences = (): Audience[] => {
  const occupations = ['程序员', '诗人', 'CEO', '大学生', '教师', '医生', '律师', '艺术家', '工程师', '记者',
    '哲学系学生', '心理咨询师', '作家', '科学家', '公务员', '自由职业者', '企业家', '设计师', '音乐家', '运动员'];
  const surnames = ['张', '李', '王', '赵', '钱', '孙', '周', '吴', '郑', '陈', '林', '黄', '刘', '杨', '何', '马', '罗', '梁', '宋', '谢'];
  const names = ['明', '华', '强', '芳', '敏', '静', '磊', '洋', '勇', '娜', '伟', '秀', '军', '丽', '杰', '英', '飞', '涛', '平', '超'];

  return Array.from({ length: 50 }, (_, i) => ({
    id: `audience_${i}`,
    name: `${surnames[i % surnames.length]}${names[(i * 3 + 7) % names.length]}`,
    occupation: occupations[i % occupations.length],
    stance: Math.random() > 0.5 ? 'pro' : 'con',
  }));
};

const philosopherNames: Record<string, string> = {
  'socrates': '苏格拉底', 'nietzsche': '尼采', 'wittgenstein': '维特根斯坦',
  'kant': '康德', 'freud': '弗洛伊德', 'zhuangzi': '庄子',
  'schopenhauer': '叔本华', 'sartre': '萨特', 'machiavelli': '马基雅维利',
  'diogenes': '第欧根尼', 'beauvoir': '波伏娃',
};

const philosopherColors: Record<string, string> = {
  'socrates': '#fcd34d', 'nietzsche': '#fb923c', 'wittgenstein': '#d4a574',
  'kant': '#60a5fa', 'freud': '#a78bfa', 'zhuangzi': '#34d399',
  'schopenhauer': '#94a3b8', 'sartre': '#f472b6', 'machiavelli': '#ef4444',
  'diogenes': '#a3e635', 'beauvoir': '#e879f9',
};

const DEBATE_PHASES = ['opening', 'questioning', 'free', 'summary', 'judgment'];
const PHASE_LABELS: Record<string, string> = {
  opening: '立论阶段', questioning: '质询阶段', free: '自由辩论',
  summary: '总结陈词', judgment: '裁判判定',
};

export default function ArenaDebate() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const debateType = params?.id || 'basic';

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [audiences, setAudiences] = useState<Audience[]>(generateAudiences());
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isDebating, setIsDebating] = useState(true);
  const [currentSpeaker, setCurrentSpeaker] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const topic = sessionStorage.getItem('arenaTopic') || '未选择话题';
  const proStance = sessionStorage.getItem('arenaProStance') || '正方';
  const conStance = sessionStorage.getItem('arenaConStance') || '反方';
  const userSide = sessionStorage.getItem('arenaUserSide') || 'audience';
  const proSideIds: string[] = JSON.parse(sessionStorage.getItem('arenaProSide') || '[]');
  const conSideIds: string[] = JSON.parse(sessionStorage.getItem('arenaConSide') || '[]');
  const arenaMode = sessionStorage.getItem('arenaMode') || 'basic';
  const isFullMode = arenaMode === 'full';

  const proSide = proSideIds.map(id => philosopherNames[id] || id);
  const conSide = conSideIds.map(id => philosopherNames[id] || id);

  const proCount = audiences.filter(a => a.stance === 'pro').length;
  const conCount = audiences.filter(a => a.stance === 'con').length;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const initial: Message = {
      id: 'msg_0', speaker: '主持人', role: 'host',
      content: `欢迎来到哲学奇葩说！今天的辩题是："${topic}"\n\n正方（${proStance}）：${proSide.join('、')}${userSide === 'pro' ? '、你' : ''}\n反方（${conStance}）：${conSide.join('、')}${userSide === 'con' ? '、你' : ''}\n\n让我们开始这场精彩的辩论！首先进入【立论阶段】。`,
      timestamp: Date.now(), phase: 'opening',
    };
    setMessages([initial]);
    simulateDebate();
  }, []);

  const addMessage = (msg: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, { ...msg, id: `msg_${Date.now()}_${Math.random()}`, timestamp: Date.now() }]);
    if (msg.speaker) setCurrentSpeaker(msg.speaker);
  };

  const simulateDebate = async () => {
    // Simulate a multi-phase debate with delays
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    await delay(2500);

    // Opening - Pro
    if (proSide[0]) {
      addMessage({ speaker: proSide[0], speakerId: proSideIds[0], role: 'pro',
        content: `各位好，我是${proSide[0]}。关于"${topic}"这个问题，我坚定地站在正方立场。${proStance}——这不仅仅是一个观点，更是经过深思熟虑的哲学判断。让我从我的哲学体系出发来阐述这个立场...`,
        phase: 'opening' });
    }

    await delay(3000);

    // Opening - Con
    if (conSide[0]) {
      addMessage({ speaker: conSide[0], speakerId: conSideIds[0], role: 'con',
        content: `我是${conSide[0]}，我必须对正方的观点提出质疑。${conStance}——这才是更接近真相的立场。正方的论证看似有理，实则忽略了问题的本质...`,
        phase: 'opening' });
    }

    await delay(2500);
    updateAudienceStance();

    // Phase transition
    addMessage({ speaker: '主持人', role: 'host',
      content: '立论阶段结束。现在进入【质询阶段】，双方可以互相质疑对方的论点。',
      phase: 'questioning' });
    setCurrentPhase(1);

    await delay(3000);

    // Questioning
    if (proSide.length > 1) {
      addMessage({ speaker: proSide[1] || proSide[0], speakerId: proSideIds[1] || proSideIds[0], role: 'pro',
        content: `请问反方，你们如何解释这个明显的逻辑矛盾？如果按照你们的逻辑推演下去，岂不是会得出一个荒谬的结论？`,
        phase: 'questioning' });
    }

    await delay(3000);

    if (conSide.length > 0) {
      addMessage({ speaker: conSide[conSide.length - 1], speakerId: conSideIds[conSideIds.length - 1], role: 'con',
        content: `这个问题恰恰暴露了正方论证的薄弱之处。你们所谓的"逻辑矛盾"，不过是对我方立场的曲解。让我来纠正你的理解...`,
        phase: 'questioning' });
    }

    await delay(2500);
    updateAudienceStance();

    // Free debate
    addMessage({ speaker: '主持人', role: 'host',
      content: '质询阶段结束。现在进入【自由辩论】环节，双方可以自由交锋！',
      phase: 'free' });
    setCurrentPhase(2);

    await delay(3000);

    // Multiple exchanges in free debate
    const exchanges = [
      { side: 'pro' as const, idx: 0, content: `我要再次强调——我们讨论的核心在于人的本质。从哲学的角度来看，${proStance}是不可回避的结论。` },
      { side: 'con' as const, idx: 0, content: `恰恰相反！正是因为人的本质的复杂性，才使得${conStance}成为更合理的立场。你们的论证过于简化了。` },
      { side: 'pro' as const, idx: proSide.length > 1 ? 1 : 0, content: `简化？我们是在追求清晰。而你们的所谓"复杂性"不过是在回避问题的核心。` },
      { side: 'con' as const, idx: conSide.length > 1 ? 1 : 0, content: `回避？我们是在正视现实。现实本身就是复杂的，不是你们用一个简单的命题就能概括的。` },
    ];

    for (const ex of exchanges) {
      await delay(2800);
      const ids = ex.side === 'pro' ? proSideIds : conSideIds;
      const names = ex.side === 'pro' ? proSide : conSide;
      if (names[ex.idx]) {
        addMessage({ speaker: names[ex.idx], speakerId: ids[ex.idx], role: ex.side, content: ex.content, phase: 'free' });
      }
    }

    await delay(2000);
    updateAudienceStance();

    // Summary
    addMessage({ speaker: '主持人', role: 'host',
      content: '自由辩论结束。现在进入【总结陈词】阶段。',
      phase: 'summary' });
    setCurrentPhase(3);

    await delay(3000);

    if (proSide[0]) {
      addMessage({ speaker: proSide[0], speakerId: proSideIds[0], role: 'pro',
        content: `总结来说，我方的核心论点始终清晰且有力。${proStance}——这不仅有哲学依据，更符合人类理性的基本要求。我们期待裁判的公正判决。`,
        phase: 'summary' });
    }

    await delay(3000);

    if (conSide[0]) {
      addMessage({ speaker: conSide[0], speakerId: conSideIds[0], role: 'con',
        content: `反方在整场辩论中展现了更深刻的洞察力。${conStance}——这是经过严格论证的结论。正方的论证虽然看似有力，但在关键问题上始终无法自圆其说。`,
        phase: 'summary' });
    }

    await delay(2500);
    updateAudienceStance();

    // Judgment
    addMessage({ speaker: '主持人', role: 'host',
      content: '总结陈词结束。现在由裁判进行最终判定！',
      phase: 'judgment' });
    setCurrentPhase(4);

    await delay(3000);

    const winner = proCount >= conCount ? '正方' : '反方';
    const bbKing = proCount >= conCount ? proSide[0] : conSide[0];

    addMessage({ speaker: '裁判', role: 'judge',
      content: `经过激烈的辩论，双方都展现了精彩的论证能力。\n\n最终判定：${winner}获胜！\n\n观众投票：正方 ${proCount} 票 vs 反方 ${conCount} 票\n\n本场 BB King（最佳辩手）：${bbKing}！\n\n感谢所有参与者，这是一场精彩的思想碰撞！`,
      phase: 'judgment' });

    setIsDebating(false);
  };

  const updateAudienceStance = () => {
    setAudiences(prev => prev.map(a => {
      if (Math.random() > 0.85) {
        return { ...a, stance: a.stance === 'pro' ? 'con' : 'pro' };
      }
      return a;
    }));
  };

  const handleUserSend = () => {
    if (!userInput.trim() || userSide === 'audience') return;
    addMessage({ speaker: '你', role: 'user', content: userInput, phase: DEBATE_PHASES[currentPhase] });
    setUserInput("");
  };

  const getRoleColor = (role: string, speakerId?: string) => {
    if (role === 'host') return '#f59e0b';
    if (role === 'judge') return '#a855f7';
    if (role === 'user') return '#06b6d4';
    if (speakerId && philosopherColors[speakerId]) return philosopherColors[speakerId];
    return role === 'pro' ? '#3b82f6' : '#f43f5e';
  };

  const getRoleBg = (role: string) => {
    if (role === 'host') return 'rgba(245,158,11,0.08)';
    if (role === 'judge') return 'rgba(168,85,247,0.08)';
    if (role === 'user') return 'rgba(6,182,212,0.08)';
    return role === 'pro' ? 'rgba(59,130,246,0.08)' : 'rgba(244,63,94,0.08)';
  };

  return (
    <div className="h-screen bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
      <StarField count={80} className="opacity-20" />
      <div className="absolute inset-0 cosmic-bg pointer-events-none" />

      {/* Header */}
      <div className="relative z-20 nav-glass">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation("/arena/mode")} className="p-1.5 rounded-full hover:bg-white/5 transition-colors">
              <ArrowLeft className="w-4 h-4 text-white/60" />
            </button>
            <div>
              <p className="text-sm font-semibold text-white/90">哲学奇葩说</p>
              <p className="text-[10px] text-white/40">{PHASE_LABELS[DEBATE_PHASES[currentPhase]] || '辩论中'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Phase indicators */}
            <div className="hidden md:flex items-center gap-1">
              {DEBATE_PHASES.map((phase, i) => (
                <div key={phase} className={`w-2 h-2 rounded-full transition-all ${
                  i <= currentPhase ? 'bg-indigo-400' : 'bg-white/10'
                } ${i === currentPhase ? 'w-4' : ''}`} />
              ))}
            </div>
            {!isDebating && (
              <button onClick={() => setLocation(`/arena/result/${debateType}`)}
                className="ml-3 px-4 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-rose-500 text-white">
                <Trophy className="w-3 h-3 inline mr-1" />
                查看结果
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        {/* Left Sidebar - Pro Side */}
        <div className="hidden lg:flex flex-col w-56 border-r border-white/5 p-4 gap-3">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-400">正方</span>
            <span className="text-[10px] text-white/30 ml-auto">{proCount}票</span>
          </div>
          {proSide.map((name, i) => (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
              currentSpeaker === name ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-white/[0.02]'
            }`}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: `${philosopherColors[proSideIds[i]] || '#3b82f6'}20`, color: philosopherColors[proSideIds[i]] || '#3b82f6' }}>
                {name[0]}
              </div>
              <span className="text-xs text-white/70">{name}</span>
              {currentSpeaker === name && <Mic className="w-3 h-3 text-blue-400 ml-auto animate-pulse" />}
            </div>
          ))}
          {userSide === 'pro' && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-400">你</div>
              <span className="text-xs text-cyan-400">你（辩手）</span>
            </div>
          )}

          {/* Audience section */}
          {isFullMode && (
            <div className="mt-4 flex-1 overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-3 h-3 text-white/30" />
                <span className="text-[10px] text-white/30">AI观众 (50)</span>
              </div>
              <div className="space-y-0.5 overflow-y-auto max-h-[300px] pr-1">
                {audiences.slice(0, 25).map(a => (
                  <div key={a.id} className="flex items-center gap-1.5 py-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${a.stance === 'pro' ? 'bg-blue-400' : 'bg-rose-400'}`} />
                    <span className="text-[10px] text-white/25 truncate">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center - Debate Messages */}
        <div className="flex-1 flex flex-col">
          {/* Topic & Vote Bar */}
          <div className="px-4 md:px-6 py-3 border-b border-white/5">
            <h2 className="text-sm md:text-base font-bold text-center text-white/80 mb-2">{topic}</h2>
            {isFullMode && (
              <div className="flex items-center gap-2 max-w-md mx-auto">
                <span className="text-[10px] text-blue-400 w-8 text-right">{proCount}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden flex">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-l-full"
                    animate={{ width: `${(proCount / 50) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div
                    className="bg-gradient-to-r from-rose-400 to-rose-500 rounded-r-full ml-auto"
                    animate={{ width: `${(conCount / 50) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-[10px] text-rose-400 w-8">{conCount}</span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-3">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const color = getRoleColor(msg.role, msg.speakerId);
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'ml-auto' : ''}`}
                  >
                    {/* Phase divider */}
                    {msg.role === 'host' && msg.phase && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-[10px] text-white/20 tracking-wider">
                          {PHASE_LABELS[msg.phase] || msg.phase}
                        </span>
                        <div className="flex-1 h-px bg-white/5" />
                      </div>
                    )}

                    <div className="rounded-2xl px-4 py-3" style={{ background: getRoleBg(msg.role), border: `1px solid ${color}15` }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold" style={{ color }}>
                          {msg.speaker}
                        </span>
                        {msg.role === 'pro' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">正方</span>}
                        {msg.role === 'con' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400">反方</span>}
                        <span className="text-[10px] text-white/15 ml-auto">
                          {new Date(msg.timestamp).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* User Input (for debaters) */}
          {userSide !== 'audience' && isDebating && (
            <div className="px-4 md:px-6 py-3 border-t border-white/5">
              <div className="flex items-end gap-3 max-w-3xl mx-auto">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleUserSend(); } }}
                  placeholder="输入你的观点..."
                  rows={1}
                  className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 resize-none focus:outline-none focus:border-cyan-500/40 transition-all max-h-24"
                />
                <button
                  onClick={handleUserSend}
                  disabled={!userInput.trim()}
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: userInput.trim() ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255,255,255,0.05)' }}
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Con Side */}
        <div className="hidden lg:flex flex-col w-56 border-l border-white/5 p-4 gap-3">
          <div className="flex items-center gap-2 mb-1">
            <Swords className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-rose-400">反方</span>
            <span className="text-[10px] text-white/30 ml-auto">{conCount}票</span>
          </div>
          {conSide.map((name, i) => (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
              currentSpeaker === name ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-white/[0.02]'
            }`}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: `${philosopherColors[conSideIds[i]] || '#f43f5e'}20`, color: philosopherColors[conSideIds[i]] || '#f43f5e' }}>
                {name[0]}
              </div>
              <span className="text-xs text-white/70">{name}</span>
              {currentSpeaker === name && <Mic className="w-3 h-3 text-rose-400 ml-auto animate-pulse" />}
            </div>
          ))}
          {userSide === 'con' && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-400">你</div>
              <span className="text-xs text-cyan-400">你（辩手）</span>
            </div>
          )}

          {isFullMode && (
            <div className="mt-4 flex-1 overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-3 h-3 text-white/30" />
                <span className="text-[10px] text-white/30">AI观众</span>
              </div>
              <div className="space-y-0.5 overflow-y-auto max-h-[300px] pr-1">
                {audiences.slice(25, 50).map(a => (
                  <div key={a.id} className="flex items-center gap-1.5 py-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${a.stance === 'pro' ? 'bg-blue-400' : 'bg-rose-400'}`} />
                    <span className="text-[10px] text-white/25 truncate">{a.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
