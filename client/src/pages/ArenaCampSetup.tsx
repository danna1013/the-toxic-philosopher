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
  { id: 'socrates', name: '苏格拉底', nameEn: 'Socrates', image: '/philosopher-socrates-simple.png' },
  { id: 'nietzsche', name: '尼采', nameEn: 'Nietzsche', image: '/philosopher-nietzsche-simple.png' },
  { id: 'wittgenstein', name: '维特根斯坦', nameEn: 'Wittgenstein', image: '/philosopher-wittgenstein-simple.png' },
  { id: 'kant', name: '康德', nameEn: 'Kant', image: '/philosopher-kant-simple.png' },
  { id: 'freud', name: '弗洛伊德', nameEn: 'Freud', image: '/philosopher-freud-simple.png' },
];

// 预设辩题的正反方定义
const topicStances: Record<string, { pro: string, con: string }> = {
  '996是奋斗还是剥削?': { pro: '996是奋斗的必经之路', con: '996是对员工的剥削' },
  '35岁程序员真的没有出路吗?': { pro: '35岁是程序员的职业分水岭', con: '35岁焦虑是伪命题' },
  '快乐重要还是意义重要?': { pro: '快乐是人生的终极目标', con: '有意义的人生比快乐更重要' },
  '社交媒体让人更孤独了吗?': { pro: '社交媒体加剧了孤独感', con: '社交媒体拓展了社交圈' },
  '真爱存在吗?': { pro: '真爱是客观存在的', con: '真爱只是浪漫化的幻想' },
  '理性恋爱好还是感性恋爱好?': { pro: '理性恋爱更长久', con: '感性恋爱更真实' },
};

// AI生成的哲学家立场数据
const philosopherStances: Record<string, Record<string, { stance: 'pro' | 'con', reason: string }>> = {
  '996是奋斗还是剥削?': {
    'socrates': { stance: 'con', reason: '认识自己，方知何为美德，强求非德即为剥削' },
    'nietzsche': { stance: 'pro', reason: '超越自我需要极致的努力与奋斗精神' },
    'wittgenstein': { stance: 'con', reason: '语言界定生活，996暴露剥削的现实语境' },
    'kant': { stance: 'con', reason: '人不可作为工具，996违背普遍道德律' },
    'freud': { stance: 'con', reason: '无意识压抑导致痛苦，996剥夺心理健康' },
  },
  '35岁程序员真的没有出路吗?': {
    'socrates': { stance: 'con', reason: '认识自己，持续学习，方能超越年龄限制' },
    'nietzsche': { stance: 'con', reason: '人生的价值由创造意志定义，非年龄束缚' },
    'wittgenstein': { stance: 'con', reason: '35岁只是语言游戏中的标签非绝对界限' },
    'kant': { stance: 'con', reason: '每个人皆可自为目的，不应被年龄限制' },
    'freud': { stance: 'pro', reason: '年龄焦虑反映了社会超我对本我的压抑' },
  },
  '快乐重要还是意义重要?': {
    'socrates': { stance: 'con', reason: '认识自我与追求意义方能导向真正的幸福' },
    'nietzsche': { stance: 'con', reason: '意义超越瞬间快乐，彰显个体创造价值' },
    'wittgenstein': { stance: 'con', reason: '意义构成生活的形式与世界的边界' },
    'kant': { stance: 'con', reason: '道德法则赋予人生普遍意义，超越快乐' },
    'freud': { stance: 'pro', reason: '快乐原则是本我的基本驱动力' },
  },
  '社交媒体让人更孤独了吗?': {
    'socrates': { stance: 'pro', reason: '真实的自我连接胜于虚拟互动' },
    'nietzsche': { stance: 'pro', reason: '虚拟连接掩盖真实孤独，削弱深刻关系' },
    'wittgenstein': { stance: 'pro', reason: '虚拟互动难以填补真实生活的孤独感' },
    'kant': { stance: 'pro', reason: '虚拟交流不能取代真实人际关系' },
    'freud': { stance: 'con', reason: '社交媒体提供了新的欲望满足渠道' },
  },
  '真爱存在吗?': {
    'socrates': { stance: 'pro', reason: '认识自己方能识真爱，真爱必客观存在' },
    'nietzsche': { stance: 'con', reason: '真爱是权力意志的投射，非客观实在' },
    'wittgenstein': { stance: 'con', reason: '真爱不过是语言游戏中的概念幻象' },
    'kant': { stance: 'pro', reason: '真爱体现理性道德法则，人为目的非工具' },
    'freud': { stance: 'pro', reason: '真爱体现本我与自我的和谐融合' },
  },
  '理性恋爱好还是感性恋爱好?': {
    'socrates': { stance: 'pro', reason: '通过理性认识自己与他人，恋爱方能长久' },
    'nietzsche': { stance: 'con', reason: '真理源于激情，感性激发生命创造力' },
    'wittgenstein': { stance: 'con', reason: '感性是生活形式中的真实表达' },
    'kant': { stance: 'pro', reason: '理性为恋爱赋予普遍道德法则' },
    'freud': { stance: 'con', reason: '无意识情感驱动真实关系，感性更真实' },
  },
};

// 获取哲学家对辩题的立场,确保阵营平衡
const getAIStance = (philosopherId: string, topic: string): { stance: 'pro' | 'con', reason: string } => {
  const topicData = philosopherStances[topic];
  if (topicData && topicData[philosopherId]) {
    return topicData[philosopherId];
  }

  // 默认随机分配
  return {
    stance: Math.random() > 0.5 ? 'pro' : 'con',
    reason: '基于其哲学思想倾向'
  };
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
  
  // 检查是否为基础模式
  const arenaMode = sessionStorage.getItem('arenaMode') || 'basic';
  const isBasicMode = arenaMode === 'basic';

  useEffect(() => {
    const initializeStances = async () => {
      const userTopic = sessionStorage.getItem('arenaTopic') || '';
      
      // 检查是否是预设辩题
      if (topicStances[userTopic]) {
        // 预设辩题,立即显示标题
        setTopic(userTopic);
        // 预设辩题,直接使用预定义的立场
        setProStance(topicStances[userTopic].pro);
        setConStance(topicStances[userTopic].con);

        // AI自动判断每位哲学家的立场并分配
        const philosophersWithAI = philosophers.map(p => {
          const { stance, reason } = getAIStance(p.id, userTopic);
          return { ...p, aiStance: stance, aiReason: reason };
        });
        setPhilosophersWithStance(philosophersWithAI);

        // 根据AI判断自动分配初始阵营
        const pro: string[] = [];
        const con: string[] = [];

        philosophersWithAI.forEach(p => {
          if (p.aiStance === 'pro') {
            pro.push(p.id);
          } else {
            con.push(p.id);
          }
        });

        setProSide(pro);
        setConSide(con);
        setUnassigned([]);
      } else {
        // 自定义辩题,需要AI生成
        await generateCustomTopicStances();
      }
    };

    initializeStances();
  }, []);

  // AI生成自定义辩题的立场和哲学家观点
  const generateCustomTopicStances = async () => {
    setIsGenerating(true);
    const userTopic = sessionStorage.getItem('arenaTopic') || '';
    
    try {
      const response = await fetch('/api/generate-stances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: userTopic }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate stances');
      }

      const data = await response.json();
      
      // 使用AI凝练后的标题
      if (data.topic) {
        setTopic(data.topic);
        sessionStorage.setItem('arenaTopic', data.topic);
      }
      
      // 设置正反方立场
      setProStance(data.pro_stance);
      setConStance(data.con_stance);

      // 设置哲学家观点和立场
      const philosophersWithAI = philosophers.map(p => {
        const philosopherData = data.philosophers.find((pd: any) => pd.id === p.id);
        if (philosopherData) {
          return {
            ...p,
            aiStance: philosopherData.stance as 'pro' | 'con',
            aiReason: philosopherData.reason
          };
        }
        return p;
      });
      
      setPhilosophersWithStance(philosophersWithAI);

      // 根据AI生成的立场分配初始阵营
      const pro: string[] = [];
      const con: string[] = [];

      philosophersWithAI.forEach(p => {
        if (p.aiStance === 'pro') {
          pro.push(p.id);
        } else if (p.aiStance === 'con') {
          con.push(p.id);
        }
      });

      setProSide(pro);
      setConSide(con);
      setUnassigned([]);
    } catch (error) {
      console.error('AI生成失败:', error);
      // 失败时使用简化处理
      setProStance(`支持: ${topic}`);
      setConStance(`反对: ${topic}`);

      const philosophersWithAI = philosophers.map(p => {
        const stance = Math.random() > 0.5 ? 'pro' : 'con';
        return { 
          ...p, 
          aiStance: stance as 'pro' | 'con', 
          aiReason: '基于其哲学思想倾向' 
        };
      });
      
      setPhilosophersWithStance(philosophersWithAI);

      const pro: string[] = [];
      const con: string[] = [];

      philosophersWithAI.forEach(p => {
        if (p.aiStance === 'pro') {
          pro.push(p.id);
        } else {
          con.push(p.id);
        }
      });

      setProSide(pro);
      setConSide(con);
      setUnassigned([]);
    } finally {
      setIsGenerating(false);
    }
  };

  // 拖拽处理函数
  const handleDragStart = (philosopherId: string) => {
    setDraggedPhilosopher(philosopherId);
  };

  const handleDragEnd = () => {
    setDraggedPhilosopher(null);
  };

  const handleDropToPro = () => {
    if (!draggedPhilosopher) return;
    setConSide(prev => prev.filter(id => id !== draggedPhilosopher));
    setUnassigned(prev => prev.filter(id => id !== draggedPhilosopher));
    setProSide(prev => prev.includes(draggedPhilosopher) ? prev : [...prev, draggedPhilosopher]);
    setDraggedPhilosopher(null);
  };

  const handleDropToCon = () => {
    if (!draggedPhilosopher) return;
    setProSide(prev => prev.filter(id => id !== draggedPhilosopher));
    setUnassigned(prev => prev.filter(id => id !== draggedPhilosopher));
    setConSide(prev => prev.includes(draggedPhilosopher) ? prev : [...prev, draggedPhilosopher]);
    setDraggedPhilosopher(null);
  };

  const handleDropToUnassigned = () => {
    if (!draggedPhilosopher) return;
    setProSide(prev => prev.filter(id => id !== draggedPhilosopher));
    setConSide(prev => prev.filter(id => id !== draggedPhilosopher));
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
        draggable={!isBasicMode}
        onDragStart={!isBasicMode ? () => handleDragStart(id) : undefined}
        onDragEnd={!isBasicMode ? handleDragEnd : undefined}
        className={`flex flex-col items-center p-5 bg-white border border-gray-300 transition-all ${
          !isBasicMode ? 'cursor-move hover:border-black hover:shadow-sm' : 'cursor-default'
        }`}
        title={!isBasicMode ? "拖动到其他阵营" : ""}
      >
        <img 
          src={philosopher.image} 
          alt={philosopher.name}
          className="w-24 h-24 rounded-full mb-4 object-cover"
        />
        <span className="text-lg font-medium text-black mb-3">{philosopher.name}</span>
        {philosopher.aiReason && !isGenerating && (
          <p className="text-sm text-gray-600 text-center leading-relaxed">{philosopher.aiReason}</p>
        )}
      </div>
    );
  };

  // 渲染用户卡片
  const renderUserCard = () => {
    return (
      <div className="flex flex-col items-center p-5 bg-white border-2 border-black">
        <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center text-white text-4xl font-bold">
          你
        </div>
      </div>
    );
  };

  const handleContinue = () => {
    // 检查正反方是否至少各有一人(哲学家或用户)
    const proCount = proSide.length + (userSide === 'pro' ? 1 : 0);
    const conCount = conSide.length + (userSide === 'con' ? 1 : 0);

    if (proCount === 0 || conCount === 0) {
      alert('正方和反方必须至少各有一位参赛者(哲学家或你)!');
      return;
    }

    sessionStorage.setItem('arenaProSide', JSON.stringify(proSide));
    sessionStorage.setItem('arenaConSide', JSON.stringify(conSide));
    sessionStorage.setItem('arenaProStance', proStance);
    sessionStorage.setItem('arenaConStance', conStance);
    sessionStorage.setItem('arenaUnassigned', JSON.stringify(unassigned));
    sessionStorage.setItem('arenaUserSide', userSide);

    // 根据模式跳转到不同的辩论页
    if (isBasicMode) {
      setLocation('/arena/debate/basic');
    } else {
      setLocation('/arena/debate/custom');
    }
  };

  // 计算人数
  const proCount = proSide.length + (userSide === 'pro' ? 1 : 0);
  const conCount = conSide.length + (userSide === 'con' ? 1 : 0);
  const audienceCount = unassigned.length + (userSide === 'audience' ? 1 : 0);

  // 检查是否满足开始条件
  const canStart = proCount > 0 && conCount > 0 && !isGenerating;

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
              一对一开怼
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
            <button onClick={() => setLocation("/arena/mode")} className="relative text-lg md:text-xl text-black font-medium group">
              哲学"奇葩说"
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
        {/* 辩题 */}
        {!isGenerating && topic && (
          <div className="w-full max-w-7xl mb-8">
            <h1 className="text-5xl font-bold text-black text-center">
              {topic}
            </h1>
            <p className="text-sm text-gray-500 text-center mt-3">
              立场由哲学家本人观点和生平经历所决定
            </p>
          </div>
        )}

        {/* AI生成中的提示 */}
        {isGenerating && (
          <div className="w-full max-w-7xl mb-8 p-6 bg-gray-50 border border-gray-200 text-center">
            <div className="text-4xl mb-4 animate-pulse">🤔</div>
            <p className="text-xl text-black font-bold mb-2">AI正在分析辩题</p>
            <p className="text-base text-gray-600">生成正反方立场和哲学家观点...</p>
          </div>
        )}

        {/* 拖拽说明 (只在完整模式显示) */}
        {!isGenerating && !isBasicMode && (
          <div className="w-full max-w-7xl mb-8">
            <p className="text-lg text-gray-600 text-center">
              💡 提示:拖动哲学家卡片到不同阵营,自由配置辩论双方
            </p>
          </div>
        )}

        {/* 阵营配置区 */}
        <div className="w-full max-w-7xl mb-12">
          <div className="grid grid-cols-3 gap-6">
            {/* 正方 */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropToPro}
              className={`border-2 transition-all ${
                draggedPhilosopher ? 'border-dashed border-green-400 bg-green-50' : 'border-green-600'
              }`}
            >
              <div className="bg-green-600 text-white p-5 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold">正方</h2>
                  <span className="text-2xl">({proCount})</span>
                </div>
                <p className="text-base mt-2 opacity-90">{proStance || '生成中...'}</p>
              </div>
              <div className="p-5 min-h-[450px] space-y-4">
                {proSide.map(id => renderPhilosopher(id))}
                {userSide === 'pro' && renderUserCard()}
              </div>
            </div>

            {/* 观众席 */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropToUnassigned}
              className={`border-2 transition-all ${
                draggedPhilosopher ? 'border-dashed border-gray-400 bg-gray-50' : 'border-gray-400'
              }`}
            >
              <div className="bg-gray-100 text-black p-5 border-b border-gray-400 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold">观众席</h2>
                  <span className="text-2xl">({audienceCount})</span>
                </div>
                <p className="text-base mt-2 text-gray-600">待分配或观看</p>
              </div>
              <div className="p-5 min-h-[450px] space-y-4">
                {unassigned.map(id => renderPhilosopher(id))}
                {userSide === 'audience' && renderUserCard()}
                {unassigned.length === 0 && userSide !== 'audience' && (
                  <div className="flex items-center justify-center h-80 text-gray-400">
                    <div className="text-center">
                      <div className="text-6xl mb-4">⚖️</div>
                      <p className="text-base">所有哲学家已分配</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 反方 */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropToCon}
              className={`border-2 transition-all ${
                draggedPhilosopher ? 'border-dashed border-red-400 bg-red-50' : 'border-red-600'
              }`}
            >
              <div className="bg-red-600 text-white p-5 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold">反方</h2>
                  <span className="text-2xl">({conCount})</span>
                </div>
                <p className="text-base mt-2 opacity-90">{conStance || '生成中...'}</p>
              </div>
              <div className="p-5 min-h-[450px] space-y-4">
                {conSide.map(id => renderPhilosopher(id))}
                {userSide === 'con' && renderUserCard()}
              </div>
            </div>
          </div>
        </div>

        {/* 用户角色选择区域 (只在完整模式显示) */}
        {!isBasicMode && (
        <div className="w-full max-w-7xl mb-12">
          <h3 className="text-2xl font-bold text-black text-center mb-6">选择你的角色</h3>
          <div className="border-2 border-black p-8 bg-white">
            <div className="grid grid-cols-3 gap-6">
              {/* 正方选项 */}
              <button
                onClick={() => setUserSide('pro')}
                disabled={isGenerating}
                className={`p-8 border-2 transition-all ${
                  userSide === 'pro'
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-300 bg-white text-black hover:border-green-600'
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-2xl font-bold mb-3">正方辩手</div>
                <div className="text-base opacity-80">{proStance || '立场生成中...'}</div>
              </button>

              {/* 观众选项 */}
              <button
                onClick={() => setUserSide('audience')}
                disabled={isGenerating}
                className={`p-8 border-2 transition-all ${
                  userSide === 'audience'
                    ? 'border-gray-600 bg-gray-600 text-white'
                    : 'border-gray-300 bg-white text-black hover:border-gray-600'
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-2xl font-bold mb-3">观众</div>
                <div className="text-base opacity-80">观看辩论不参与</div>
              </button>

              {/* 反方选项 */}
              <button
                onClick={() => setUserSide('con')}
                disabled={isGenerating}
                className={`p-8 border-2 transition-all ${
                  userSide === 'con'
                    ? 'border-red-600 bg-red-600 text-white'
                    : 'border-gray-300 bg-white text-black hover:border-red-600'
                } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-2xl font-bold mb-3">反方辩手</div>
                <div className="text-base opacity-80">{conStance || '立场生成中...'}</div>
              </button>
            </div>
          </div>
        </div>
        )}

        {/* 底部按钮区 */}
        <div className="w-full max-w-7xl flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setLocation('/arena/topic')}
              className="px-10 py-4 border-2 border-gray-400 text-gray-600 hover:border-black hover:text-black transition-colors text-xl font-medium"
            >
              ← 返回
            </button>
            
            <button
              onClick={handleContinue}
              disabled={!canStart}
              className={`px-20 py-4 text-xl font-bold transition-colors ${
                canStart 
                  ? 'bg-black text-white hover:bg-gray-800 cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              开始辩论
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
