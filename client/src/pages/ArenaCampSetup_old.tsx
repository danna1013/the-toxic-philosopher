import { useState, useEffect } from "react";
import { useLocation } from "wouter";

interface Philosopher {
  id: string;
  name: string;
  nameEn: string;
  image: string;
  bwImage: string; // 黑白头像
  aiStance?: 'pro' | 'con' | 'neutral';
  aiReason?: string;
}

const philosophers: Philosopher[] = [
  { 
    id: 'socrates', 
    name: '苏格拉底', 
    nameEn: 'Socrates', 
    image: '/web-socrates.webp',
    bwImage: '/web-socrates.webp' // 暂时使用原图,后续添加黑白头像
  },
  { 
    id: 'nietzsche', 
    name: '尼采', 
    nameEn: 'Nietzsche', 
    image: '/web-nietzsche.webp',
    bwImage: '/web-nietzsche.webp'
  },
  { 
    id: 'wittgenstein', 
    name: '维特根斯坦', 
    nameEn: 'Wittgenstein', 
    image: '/web-wittgenstein.webp',
    bwImage: '/web-wittgenstein.webp'
  },
  { 
    id: 'kant', 
    name: '康德', 
    nameEn: 'Kant', 
    image: '/web-kant.webp',
    bwImage: '/web-kant.webp'
  },
  { 
    id: 'freud', 
    name: '弗洛伊德', 
    nameEn: 'Freud', 
    image: '/web-freud.webp',
    bwImage: '/web-freud.webp'
  },
];

// 模拟AI判断哲学家立场
const getAIStance = (philosopherId: string, topic: string): { stance: 'pro' | 'con' | 'neutral', reason: string } => {
  const stances: Record<string, { stance: 'pro' | 'con' | 'neutral', reason: string }> = {
    'socrates': { stance: 'pro', reason: '基于理性主义和对真理的追求,苏格拉底倾向于支持这一观点' },
    'nietzsche': { stance: 'con', reason: '尼采对传统价值的批判和个人主义倾向,使他反对这一观点' },
    'wittgenstein': { stance: 'neutral', reason: '维特根斯坦更关注语言和逻辑问题,对此话题持中立态度' },
    'kant': { stance: 'pro', reason: '康德的理性主义和道德哲学支持这一立场' },
    'freud': { stance: 'con', reason: '弗洛伊德对人类无意识的深刻洞察,使他倾向于反对' },
  };
  return stances[philosopherId] || { stance: 'neutral', reason: '需要更多信息判断' };
};

export default function ArenaCampSetup() {
  const [, setLocation] = useLocation();
  const [proSide, setProSide] = useState<string[]>([]);
  const [conSide, setConSide] = useState<string[]>([]);
  const [unassigned, setUnassigned] = useState<string[]>([]);
  const [userSide, setUserSide] = useState<'pro' | 'con' | 'unassigned'>('unassigned');
  const [philosophersWithStance, setPhilosophersWithStance] = useState<Philosopher[]>(philosophers);
  const [draggedPhilosopher, setDraggedPhilosopher] = useState<string | null>(null);
  
  const topic = sessionStorage.getItem('arenaTopic') || '未选择话题';

  useEffect(() => {
    // AI自动判断每位哲学家的立场并分配
    const philosophersWithAI = philosophers.map(p => {
      const { stance, reason } = getAIStance(p.id, topic);
      return { ...p, aiStance: stance, aiReason: reason };
    });
    setPhilosophersWithStance(philosophersWithAI);

    // 根据AI判断自动分配初始阵营
    const pro: string[] = [];
    const con: string[] = [];
    const neutral: string[] = [];

    philosophersWithAI.forEach(p => {
      if (p.aiStance === 'pro') {
        pro.push(p.id);
      } else if (p.aiStance === 'con') {
        con.push(p.id);
      } else {
        neutral.push(p.id);
      }
    });

    setProSide(pro);
    setConSide(con);
    setUnassigned(neutral);
  }, [topic]);

  // 拖拽开始
  const handleDragStart = (philosopherId: string) => {
    setDraggedPhilosopher(philosopherId);
  };

  // 拖拽结束
  const handleDragEnd = () => {
    setDraggedPhilosopher(null);
  };

  // 放置到正方
  const handleDropToPro = () => {
    if (!draggedPhilosopher) return;
    
    // 从其他阵营移除
    setConSide(prev => prev.filter(id => id !== draggedPhilosopher));
    setUnassigned(prev => prev.filter(id => id !== draggedPhilosopher));
    
    // 添加到正方(如果不存在)
    setProSide(prev => prev.includes(draggedPhilosopher) ? prev : [...prev, draggedPhilosopher]);
    setDraggedPhilosopher(null);
  };

  // 放置到反方
  const handleDropToCon = () => {
    if (!draggedPhilosopher) return;
    
    // 从其他阵营移除
    setProSide(prev => prev.filter(id => id !== draggedPhilosopher));
    setUnassigned(prev => prev.filter(id => id !== draggedPhilosopher));
    
    // 添加到反方(如果不存在)
    setConSide(prev => prev.includes(draggedPhilosopher) ? prev : [...prev, draggedPhilosopher]);
    setDraggedPhilosopher(null);
  };

  // 放置到待分配
  const handleDropToUnassigned = () => {
    if (!draggedPhilosopher) return;
    
    // 从其他阵营移除
    setProSide(prev => prev.filter(id => id !== draggedPhilosopher));
    setConSide(prev => prev.filter(id => id !== draggedPhilosopher));
    
    // 添加到待分配(如果不存在)
    setUnassigned(prev => prev.includes(draggedPhilosopher) ? prev : [...prev, draggedPhilosopher]);
    setDraggedPhilosopher(null);
  };

  // 渲染哲学家卡片
  const renderPhilosopher = (id: string) => {
    const philosopher = philosophersWithStance.find(p => p.id === id);
    if (!philosopher) return null;

    return (
      <div
        key={id}
        draggable
        onDragStart={() => handleDragStart(id)}
        onDragEnd={handleDragEnd}
        className="flex flex-col items-center p-3 bg-white border-2 border-gray-300 rounded cursor-move hover:border-black transition-all"
      >
        <img 
          src={philosopher.bwImage} 
          alt={philosopher.name}
          className="w-16 h-16 rounded-full mb-2 object-cover grayscale"
        />
        <span className="text-sm font-medium text-black">{philosopher.name}</span>
        {philosopher.aiReason && (
          <p className="text-xs text-gray-600 mt-1 text-center">{philosopher.aiReason}</p>
        )}
      </div>
    );
  };

  const handleContinue = () => {
    // 验证至少每方有1人
    if (proSide.length === 0 || conSide.length === 0) {
      alert('每方至少需要1位辩手!');
      return;
    }

    // 保存配置
    sessionStorage.setItem('arenaProSide', JSON.stringify(proSide));
    sessionStorage.setItem('arenaConSide', JSON.stringify(conSide));
    sessionStorage.setItem('arenaUnassigned', JSON.stringify(unassigned));
    sessionStorage.setItem('arenaUserSide', userSide);

    // 跳转到辩论页面
    setLocation('/arena/debate/custom');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-32">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="px-8 py-5 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-lg font-bold text-black">毒舌哲学家</h1>
            <p className="text-xs text-gray-500">THE TOXIC PHILOSOPHER</p>
          </div>
          <div className="flex gap-6">
            <button onClick={() => setLocation('/')} className="text-black hover:text-gray-600 transition-colors">首页</button>
            <button onClick={() => setLocation('/select')} className="text-black hover:text-gray-600 transition-colors">一对一开怼</button>
            <button className="text-black font-medium underline">哲学"奇葩说"</button>
            <button onClick={() => setLocation('/design')} className="text-black hover:text-gray-600 transition-colors">设计理念</button>
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
      <div className="flex-1 flex flex-col items-center px-6 pb-16">
        {/* 辩题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-black mb-4">
            {topic}
          </h1>
          <p className="text-xl text-gray-600">
            拖动哲学家到正方或反方,配置辩论阵营
          </p>
        </div>

        {/* 阵营配置区 */}
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-3 gap-8">
            {/* 正方 */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropToPro}
              className="border-2 border-black p-6 min-h-[400px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-black">正方</h2>
                <span className="text-sm text-gray-600">({proSide.length}人)</span>
              </div>
              <p className="text-gray-600 mb-6">支持该观点的辩手</p>
              <div className="grid grid-cols-2 gap-4">
                {proSide.map(id => renderPhilosopher(id))}
                {userSide === 'pro' && (
                  <div className="flex flex-col items-center p-3 bg-blue-50 border-2 border-blue-300 rounded">
                    <div className="w-16 h-16 rounded-full mb-2 bg-blue-200 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <span className="text-sm font-medium text-black">你</span>
                  </div>
                )}
              </div>
            </div>

            {/* 待分配(观众) */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropToUnassigned}
              className="border-2 border-gray-300 p-6 min-h-[400px] bg-gray-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-700">待分配(观众)</h2>
                <span className="text-sm text-gray-600">({unassigned.length}人)</span>
              </div>
              <p className="text-gray-600 mb-6">作为观众观看辩论</p>
              <div className="grid grid-cols-2 gap-4">
                {unassigned.map(id => renderPhilosopher(id))}
                {userSide === 'unassigned' && (
                  <div className="flex flex-col items-center p-3 bg-gray-100 border-2 border-gray-400 rounded">
                    <div className="w-16 h-16 rounded-full mb-2 bg-gray-300 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <span className="text-sm font-medium text-black">你</span>
                  </div>
                )}
              </div>
            </div>

            {/* 反方 */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropToCon}
              className="border-2 border-black p-6 min-h-[400px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-black">反方</h2>
                <span className="text-sm text-gray-600">({conSide.length}人)</span>
              </div>
              <p className="text-gray-600 mb-6">反对该观点的辩手</p>
              <div className="grid grid-cols-2 gap-4">
                {conSide.map(id => renderPhilosopher(id))}
                {userSide === 'con' && (
                  <div className="flex flex-col items-center p-3 bg-red-50 border-2 border-red-300 rounded">
                    <div className="w-16 h-16 rounded-full mb-2 bg-red-200 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <span className="text-sm font-medium text-black">你</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 用户身份选择 */}
          <div className="mt-8 p-6 border-2 border-gray-300 bg-gray-50">
            <h3 className="text-xl font-bold text-black mb-4">选择你的身份</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setUserSide('pro')}
                className={`flex-1 py-3 border-2 transition-all ${
                  userSide === 'pro' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 bg-white text-gray-700 hover:border-black'
                }`}
              >
                加入正方辩手
              </button>
              <button
                onClick={() => setUserSide('unassigned')}
                className={`flex-1 py-3 border-2 transition-all ${
                  userSide === 'unassigned' 
                    ? 'border-gray-500 bg-gray-100 text-gray-700' 
                    : 'border-gray-300 bg-white text-gray-700 hover:border-black'
                }`}
              >
                作为观众观看
              </button>
              <button
                onClick={() => setUserSide('con')}
                className={`flex-1 py-3 border-2 transition-all ${
                  userSide === 'con' 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-gray-300 bg-white text-gray-700 hover:border-black'
                }`}
              >
                加入反方辩手
              </button>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setLocation('/arena/topic')}
              className="px-8 py-3 border-2 border-black text-black hover:bg-gray-100 transition-colors"
            >
              返回
            </button>
            <button
              onClick={handleContinue}
              disabled={proSide.length === 0 || conSide.length === 0}
              className="flex-1 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              开始辩论
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
