import { useState, useEffect } from "react";
import { useLocation } from "wouter";

interface Philosopher {
  id: string;
  name: string;
  nameEn: string;
  image: string;
  aiStance?: 'pro' | 'con' | 'neutral';
  aiReason?: string;
}

const philosophers: Philosopher[] = [
  { id: 'socrates', name: '苏格拉底', nameEn: 'Socrates', image: '/web-socrates.webp' },
  { id: 'nietzsche', name: '尼采', nameEn: 'Nietzsche', image: '/web-nietzsche.webp' },
  { id: 'wittgenstein', name: '维特根斯坦', nameEn: 'Wittgenstein', image: '/web-wittgenstein.webp' },
  { id: 'kant', name: '康德', nameEn: 'Kant', image: '/web-kant.webp' },
  { id: 'freud', name: '弗洛伊德', nameEn: 'Freud', image: '/web-freud.webp' },
];

// 模拟AI判断哲学家立场（实际应该调用后端API）
const getAIStance = (philosopherId: string, topic: string): { stance: 'pro' | 'con' | 'neutral', reason: string } => {
  // 这里是简化的模拟逻辑，实际应该基于哲学家的思想和话题进行深度分析
  const stances: Record<string, { stance: 'pro' | 'con' | 'neutral', reason: string }> = {
    'socrates': { stance: 'pro', reason: '基于苏格拉底的理性主义和对真理的追求' },
    'nietzsche': { stance: 'con', reason: '尼采对传统价值的批判和个人主义倾向' },
    'wittgenstein': { stance: 'neutral', reason: '维特根斯坦更关注语言和逻辑问题' },
    'kant': { stance: 'pro', reason: '康德的理性主义和道德哲学' },
    'freud': { stance: 'con', reason: '弗洛伊德对人类无意识的深刻洞察' },
  };
  return stances[philosopherId] || { stance: 'neutral', reason: '需要更多信息判断' };
};

export default function ArenaCampSetup() {
  const [, setLocation] = useLocation();
  const [proSide, setProSide] = useState<string[]>([]);
  const [conSide, setConSide] = useState<string[]>([]);
  const [showAIRecommendation, setShowAIRecommendation] = useState(true);
  const [philosophersWithStance, setPhilosophersWithStance] = useState<Philosopher[]>(philosophers);
  
  const topic = sessionStorage.getItem('arenaTopic') || '未选择话题';
  const role = sessionStorage.getItem('arenaRole') || 'audience';

  useEffect(() => {
    // 页面加载时，AI自动判断每位哲学家的立场
    const philosophersWithAI = philosophers.map(p => {
      const { stance, reason } = getAIStance(p.id, topic);
      return { ...p, aiStance: stance, aiReason: reason };
    });
    setPhilosophersWithStance(philosophersWithAI);

    // 根据AI判断自动分配到正反方
    const proPhilosophers = philosophersWithAI.filter(p => p.aiStance === 'pro').map(p => p.id);
    const conPhilosophers = philosophersWithAI.filter(p => p.aiStance === 'con').map(p => p.id);
    setProSide(proPhilosophers);
    setConSide(conPhilosophers);
  }, [topic]);

  const handlePhilosopherClick = (id: string) => {
    if (proSide.includes(id)) {
      // 从正方移除
      setProSide(proSide.filter(p => p !== id));
    } else if (conSide.includes(id)) {
      // 从反方移除
      setConSide(conSide.filter(p => p !== id));
    } else {
      // 添加到正方
      setProSide([...proSide, id]);
    }
    setShowAIRecommendation(false);
  };

  const moveToProSide = (id: string) => {
    if (conSide.includes(id)) {
      setConSide(conSide.filter(p => p !== id));
      setProSide([...proSide, id]);
    } else if (!proSide.includes(id)) {
      setProSide([...proSide, id]);
    }
    setShowAIRecommendation(false);
  };

  const moveToConSide = (id: string) => {
    if (proSide.includes(id)) {
      setProSide(proSide.filter(p => p !== id));
      setConSide([...conSide, id]);
    } else if (!conSide.includes(id)) {
      setConSide([...conSide, id]);
    }
    setShowAIRecommendation(false);
  };

  const handleContinue = () => {
    // 至少正反方各有一人（不包括用户）
    const minProCount = role === 'debater' ? 0 : 1;
    const minConCount = role === 'debater' ? 0 : 1;
    
    if (proSide.length >= minProCount && conSide.length >= minConCount) {
      sessionStorage.setItem('arenaProSide', JSON.stringify(proSide));
      sessionStorage.setItem('arenaConSide', JSON.stringify(conSide));
      
      // 如果是辩手模式，跳过观众选择，直接进入辩论
      if (role === 'debater') {
        const sessionId = `session_${Date.now()}`;
        setLocation(`/arena/debate/${sessionId}`);
      } else {
        setLocation("/arena/audience");
      }
    }
  };

  const unassigned = philosophersWithStance.filter(p => !proSide.includes(p.id) && !conSide.includes(p.id));
  const canContinue = proSide.length >= 1 && conSide.length >= 1;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="px-8 py-5 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="text-xl md:text-2xl font-bold tracking-wide">毒舌哲学家</div>
            <div className="text-xs md:text-sm font-medium tracking-[0.2em] text-gray-500">THE TOXIC PHILOSOPHER</div>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => setLocation("/")} className="relative text-base md:text-lg text-gray-600 hover:text-black transition-colors group">
              首页
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => setLocation("/select")} className="relative text-base md:text-lg text-gray-600 hover:text-black transition-colors group">
              一对一开怼
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => setLocation("/arena/mode")} className="relative text-base md:text-lg text-black font-medium group">
              哲学"奇葩说"
              <span className="absolute bottom-0 left-0 w-full h-px bg-black"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="flex-1 flex flex-col items-center px-6 py-24">
        <div className="text-center mb-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
            配置辩论阵营
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-light mb-2">
            辩题：{topic}
          </p>
          {showAIRecommendation && (
            <p className="text-sm text-purple-600 font-medium">
              ✨ AI已根据哲学家思想自动分配阵营，你可以自由调整
            </p>
          )}
        </div>

        {/* 阵营配置区域 */}
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-3 gap-6">
            {/* 正方 */}
            <div className="border-2 border-green-500 bg-green-50 p-6 min-h-[400px]">
              <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
                正方 ({proSide.length}{role === 'debater' ? '+你' : ''})
              </h2>
              <div className="space-y-4">
                {proSide.map(id => {
                  const philosopher = philosophersWithStance.find(p => p.id === id);
                  if (!philosopher) return null;
                  return (
                    <div key={id} className="bg-white border-2 border-green-500 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-2 border-green-500 overflow-hidden">
                          <img src={philosopher.image} alt={philosopher.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">{philosopher.name}</div>
                          {philosopher.aiStance === 'pro' && (
                            <div className="text-xs text-green-600">AI推荐</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveToConSide(id)}
                          className="px-3 py-1 text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          →反方
                        </button>
                        <button
                          onClick={() => handlePhilosopherClick(id)}
                          className="px-3 py-1 text-sm border border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white transition-colors"
                        >
                          移除
                        </button>
                      </div>
                    </div>
                  );
                })}
                {role === 'debater' && (
                  <div className="bg-white border-2 border-green-500 p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-green-500 bg-green-100 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div>
                      <div className="font-bold text-lg">你</div>
                      <div className="text-xs text-green-600">辩手</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 待分配 */}
            <div className="border-2 border-gray-300 bg-gray-50 p-6 min-h-[400px]">
              <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">
                待分配 ({unassigned.length})
              </h2>
              <div className="space-y-4">
                {unassigned.map(philosopher => (
                  <div key={philosopher.id} className="bg-white border-2 border-gray-300 p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full border-2 border-gray-300 overflow-hidden">
                        <img src={philosopher.image} alt={philosopher.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">{philosopher.name}</div>
                        {philosopher.aiStance === 'neutral' && (
                          <div className="text-xs text-gray-500">AI未判断</div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveToProSide(philosopher.id)}
                        className="flex-1 px-3 py-1 text-sm border border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-colors"
                      >
                        →正方
                      </button>
                      <button
                        onClick={() => moveToConSide(philosopher.id)}
                        className="flex-1 px-3 py-1 text-sm border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        →反方
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 反方 */}
            <div className="border-2 border-red-500 bg-red-50 p-6 min-h-[400px]">
              <h2 className="text-2xl font-bold text-red-700 mb-4 text-center">
                反方 ({conSide.length})
              </h2>
              <div className="space-y-4">
                {conSide.map(id => {
                  const philosopher = philosophersWithStance.find(p => p.id === id);
                  if (!philosopher) return null;
                  return (
                    <div key={id} className="bg-white border-2 border-red-500 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-2 border-red-500 overflow-hidden">
                          <img src={philosopher.image} alt={philosopher.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">{philosopher.name}</div>
                          {philosopher.aiStance === 'con' && (
                            <div className="text-xs text-red-600">AI推荐</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveToProSide(id)}
                          className="px-3 py-1 text-sm border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                        >
                          →正方
                        </button>
                        <button
                          onClick={() => handlePhilosopherClick(id)}
                          className="px-3 py-1 text-sm border border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white transition-colors"
                        >
                          移除
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 说明文字 */}
        <div className="mt-8 text-center text-gray-600 max-w-3xl">
          <p className="text-sm">
            💡 提示：可以自由配置阵营，支持1v5、2v3等任意组合，只要正反方各至少有一人即可
          </p>
        </div>

        {/* 继续按钮 */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`px-12 py-4 border-2 border-black font-bold text-lg transition-all duration-300 ${
              canContinue
                ? 'bg-black text-white hover:bg-white hover:text-black'
                : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
          >
            继续
          </button>
          
          <button
            onClick={() => setLocation("/arena/role")}
            className="text-gray-600 hover:text-black transition-colors underline"
          >
            返回身份选择
          </button>
        </div>
      </div>
    </div>
  );
}
