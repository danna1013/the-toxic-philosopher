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
  { id: 'socrates', name: '苏格拉底', nameEn: 'Socrates', image: '/web-socrates-bw.jpg' },
  { id: 'nietzsche', name: '尼采', nameEn: 'Nietzsche', image: '/web-nietzsche-bw.jpg' },
  { id: 'wittgenstein', name: '维特根斯坦', nameEn: 'Wittgenstein', image: '/web-wittgenstein-bw.jpg' },
  { id: 'kant', name: '康德', nameEn: 'Kant', image: '/web-kant-bw.jpg' },
  { id: 'freud', name: '弗洛伊德', nameEn: 'Freud', image: '/web-freud-bw.jpg' },
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
    'socrates': { stance: 'con', reason: '认识自己，方知何为美德，强求非德即为剥削。' },
    'nietzsche': { stance: 'con', reason: '奴役意志非真自由，强迫劳动乃精神枷锁。' },
    'wittgenstein': { stance: 'con', reason: '语言界定生活，996暴露剥削的现实语境。' },
    'kant': { stance: 'con', reason: '人不可作为工具，996违背普遍道德律。' },
    'freud': { stance: 'con', reason: '无意识压抑导致痛苦，996剥夺个体自由与心理健康。' },
  },
  '35岁程序员真的没有出路吗?': {
    'socrates': { stance: 'con', reason: '认识自己，持续学习，方能超越年龄限制。' },
    'nietzsche': { stance: 'con', reason: '人生的价值由创造意志定义，非年龄限制所束缚。' },
    'wittgenstein': { stance: 'con', reason: '语言界限塑造焦虑，35岁只是语言游戏中的标签而非绝对界限' },
    'kant': { stance: 'con', reason: '理性普遍法则表明，每个人皆可自为目的，不应被年龄限制' },
    'freud': { stance: 'con', reason: '无意识驱动行为，焦虑源于内心压抑非年龄界限' },
  },
  '快乐重要还是意义重要?': {
    'socrates': { stance: 'con', reason: '认识自我与追求意义方能导向真正的美德与幸福。' },
    'nietzsche': { stance: 'con', reason: '意义超越瞬间快乐，彰显个体创造的生命价值。' },
    'wittgenstein': { stance: 'con', reason: '语言界定意义，意义构成生活的形式与世界的边界' },
    'kant': { stance: 'con', reason: '道德法则赋予人生普遍意义，超越单纯快乐追求。' },
    'freud': { stance: 'con', reason: '无意识欲望需超我引导，意义超越短暂快乐更持久' },
  },
  '社交媒体让人更孤独了吗?': {
    'socrates': { stance: 'pro', reason: '真实的自我连接胜于虚拟互动，虚拟或加深孤独。' },
    'nietzsche': { stance: 'pro', reason: '虚拟连接掩盖真实孤独，削弱个体深刻自我与他人关系。' },
    'wittgenstein': { stance: 'pro', reason: '语言界限限制交流，虚拟互动难以填补真实生活的孤独感。' },
    'kant': { stance: 'pro', reason: '虚拟交流不能取代理性且普遍的真实人际关系。' },
    'freud': { stance: 'pro', reason: '无意识欲望得不到满足，社交媒体加剧内心孤独感。' },
  },
  '真爱存在吗?': {
    'socrates': { stance: 'pro', reason: '认识自己方能识真爱，因美德即知，真爱必客观存在。' },
    'nietzsche': { stance: 'con', reason: '真爱是权力意志的投射，非客观实在，而是意志的创造。' },
    'wittgenstein': { stance: 'con', reason: '语言界限决定意义，真爱不过是语言游戏中的概念幻象。' },
    'kant': { stance: 'pro', reason: '真爱体现理性普遍道德法则，人作为目的不可被工具化。' },
    'freud': { stance: 'pro', reason: '无意识驱动的深层情感，真爱体现本我与自我的和谐融合。' },
  },
  '理性恋爱好还是感性恋爱好?': {
    'socrates': { stance: 'pro', reason: '通过理性认识自己与他人，恋爱方能长久且有真知。' },
    'nietzsche': { stance: 'con', reason: '真理源于激情，感性激发生命的创造力与力量意志。' },
    'wittgenstein': { stance: 'con', reason: '语言界限决定理解，感性是生活形式中的真实表达。' },
    'kant': { stance: 'pro', reason: '理性为恋爱赋予普遍道德法则与尊重他人之目的性。' },
    'freud': { stance: 'con', reason: '无意识情感驱动真实关系，感性恋爱更贴近本我需求。' },
  },
};

// 获取哲学家对辩题的立场
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
  const [userRole, setUserRole] = useState<'audience' | 'debater'>('audience');
  
  const topic = sessionStorage.getItem('arenaTopic') || '未选择话题';

  useEffect(() => {
    // 设置正反方立场
    if (topicStances[topic]) {
      setProStance(topicStances[topic].pro);
      setConStance(topicStances[topic].con);
    } else {
      // 自定义辩题,需要AI生成(这里暂时简化处理)
      setProStance(`支持: ${topic}`);
      setConStance(`反对: ${topic}`);
    }

    // AI自动判断每位哲学家的立场并分配
    const philosophersWithAI = philosophers.map(p => {
      const { stance, reason } = getAIStance(p.id, topic);
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
    setUnassigned([]); // 初始时所有人都被分配
  }, [topic]);

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
        draggable
        onDragStart={() => handleDragStart(id)}
        onDragEnd={handleDragEnd}
        className="flex flex-col items-center p-4 bg-white border-2 border-gray-300 rounded cursor-move hover:border-black hover:shadow-lg transition-all group"
        title="拖动我到其他阵营"
      >
        <div className="relative">
          <img 
            src={philosopher.image} 
            alt={philosopher.name}
            className="w-20 h-20 rounded-full mb-2 object-cover grayscale"
          />
          {/* 拖拽图标提示 */}
          <div className="absolute top-0 right-0 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            ⇄
          </div>
        </div>
        <span className="text-sm font-bold text-black mb-1">{philosopher.name}</span>
        {philosopher.aiReason && (
          <p className="text-xs text-gray-600 text-center leading-tight">{philosopher.aiReason}</p>
        )}
      </div>
    );
  };

  const handleContinue = () => {
    if (proSide.length === 0 || conSide.length === 0) {
      alert('每方至少需要1位辩手!');
      return;
    }

    sessionStorage.setItem('arenaProSide', JSON.stringify(proSide));
    sessionStorage.setItem('arenaConSide', JSON.stringify(conSide));
    sessionStorage.setItem('arenaProStance', proStance);
    sessionStorage.setItem('arenaConStance', conStance);
    sessionStorage.setItem('arenaUnassigned', JSON.stringify(unassigned));
    sessionStorage.setItem('arenaUserRole', userRole);

    setLocation('/arena/debate/custom');
  };

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
            <button className="relative text-lg md:text-xl text-black font-medium group">
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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-black mb-4">
            {topic}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            配置辩论阵营
          </p>
          <p className="text-base text-gray-500">
            💡 拖动哲学家头像到正方或反方,自由配置阵营
          </p>
        </div>

        {/* 用户角色选择 */}
        <div className="mb-8 flex items-center gap-4">
          <span className="text-lg font-medium text-gray-700">你的角色:</span>
          <button
            onClick={() => setUserRole('audience')}
            className={`px-6 py-2 border-2 transition-all ${
              userRole === 'audience'
                ? 'border-black bg-black text-white'
                : 'border-gray-300 bg-white text-black hover:border-black'
            }`}
          >
            观众
          </button>
          <button
            onClick={() => setUserRole('debater')}
            className={`px-6 py-2 border-2 transition-all ${
              userRole === 'debater'
                ? 'border-black bg-black text-white'
                : 'border-gray-300 bg-white text-black hover:border-black'
            }`}
          >
            参与辩论
          </button>
        </div>

        {/* 阵营配置区 */}
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-3 gap-8">
            {/* 正方 */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropToPro}
              className={`border-4 p-8 min-h-[500px] transition-all ${
                draggedPhilosopher ? 'border-dashed border-green-500 bg-green-50' : 'border-black bg-white'
              }`}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-3xl font-bold text-black">正方</h2>
                  <span className="text-lg text-gray-600">({proSide.length}人)</span>
                </div>
                <p className="text-lg text-green-600 font-medium leading-relaxed">{proStance}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {proSide.map(id => renderPhilosopher(id))}
              </div>
              {draggedPhilosopher && !proSide.includes(draggedPhilosopher) && (
                <div className="mt-4 text-center text-green-600 font-medium">
                  ↓ 拖到这里加入正方
                </div>
              )}
            </div>

            {/* 待分配 */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropToUnassigned}
              className={`border-4 p-8 min-h-[500px] transition-all ${
                draggedPhilosopher ? 'border-dashed border-gray-500 bg-gray-50' : 'border-gray-300 bg-white'
              }`}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-3xl font-bold text-gray-700">待分配</h2>
                  <span className="text-lg text-gray-600">({unassigned.length}人)</span>
                </div>
                <p className="text-base text-gray-500">将哲学家拖动到此</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {unassigned.map(id => renderPhilosopher(id))}
              </div>
              {unassigned.length === 0 && !draggedPhilosopher && (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⚖️</div>
                    <p>所有哲学家已分配完毕</p>
                  </div>
                </div>
              )}
            </div>

            {/* 反方 */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropToCon}
              className={`border-4 p-8 min-h-[500px] transition-all ${
                draggedPhilosopher ? 'border-dashed border-red-500 bg-red-50' : 'border-black bg-white'
              }`}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-3xl font-bold text-black">反方</h2>
                  <span className="text-lg text-gray-600">({conSide.length}人)</span>
                </div>
                <p className="text-lg text-red-600 font-medium leading-relaxed">{conStance}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {conSide.map(id => renderPhilosopher(id))}
              </div>
              {draggedPhilosopher && !conSide.includes(draggedPhilosopher) && (
                <div className="mt-4 text-center text-red-600 font-medium">
                  ↓ 拖到这里加入反方
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 开始辩论按钮 */}
        <div className="mt-12">
          <button
            onClick={handleContinue}
            disabled={proSide.length === 0 || conSide.length === 0}
            className="px-12 py-4 bg-black text-white text-xl font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            开始辩论
          </button>
        </div>
      </div>
    </div>
  );
}
