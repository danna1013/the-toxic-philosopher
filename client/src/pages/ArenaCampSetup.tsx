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
        className="flex flex-col items-center p-4 bg-white border border-gray-300 cursor-move hover:border-black hover:shadow-sm transition-all"
        title="拖动到其他阵营"
      >
        <img 
          src={philosopher.image} 
          alt={philosopher.name}
          className="w-20 h-20 rounded-full mb-3 object-cover"
        />
        <span className="text-base font-medium text-black mb-2">{philosopher.name}</span>
        {philosopher.aiReason && (
          <p className="text-xs text-gray-600 text-center leading-snug">{philosopher.aiReason}</p>
        )}
      </div>
    );
  };

  // 渲染用户卡片
  const renderUserCard = () => {
    return (
      <div className="flex flex-col items-center p-4 bg-white border border-black">
        <div className="w-20 h-20 rounded-full mb-3 bg-black flex items-center justify-center text-white text-3xl font-bold">
          你
        </div>
        <span className="text-base font-medium text-black">你</span>
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

    setLocation('/arena/debate/custom');
  };

  // 计算人数
  const proCount = proSide.length + (userSide === 'pro' ? 1 : 0);
  const conCount = conSide.length + (userSide === 'con' ? 1 : 0);
  const audienceCount = unassigned.length + (userSide === 'audience' ? 1 : 0);

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
        {/* 返回按钮和辩题 */}
        <div className="w-full max-w-7xl mb-12">
          <button
            onClick={() => setLocation('/arena/topic')}
            className="mb-6 px-4 py-2 border border-gray-400 text-gray-600 hover:border-black hover:text-black transition-colors text-sm"
          >
            ← 返回
          </button>
          
          <h1 className="text-4xl font-bold text-black mb-8 text-center">
            {topic}
          </h1>
        </div>

        {/* 阵营配置区 */}
        <div className="w-full max-w-7xl mb-12">
          <div className="grid grid-cols-3 gap-6">
            {/* 正方 */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropToPro}
              className={`border-2 transition-all ${
                draggedPhilosopher ? 'border-dashed border-gray-400 bg-gray-50' : 'border-black'
              }`}
            >
              <div className="bg-black text-white p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">正方</h2>
                  <span className="text-lg">({proCount})</span>
                </div>
                <p className="text-sm mt-2 opacity-90">{proStance}</p>
              </div>
              <div className="p-4 min-h-[400px] space-y-3">
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
              <div className="bg-gray-100 text-black p-4 border-b border-gray-400">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">观众席</h2>
                  <span className="text-lg">({audienceCount})</span>
                </div>
                <p className="text-sm mt-2 text-gray-600">待分配或观看</p>
              </div>
              <div className="p-4 min-h-[400px] space-y-3">
                {unassigned.map(id => renderPhilosopher(id))}
                {userSide === 'audience' && renderUserCard()}
                {unassigned.length === 0 && userSide !== 'audience' && (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    <div className="text-center">
                      <div className="text-5xl mb-3">⚖️</div>
                      <p className="text-sm">所有哲学家已分配</p>
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
                draggedPhilosopher ? 'border-dashed border-gray-400 bg-gray-50' : 'border-black'
              }`}
            >
              <div className="bg-black text-white p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">反方</h2>
                  <span className="text-lg">({conCount})</span>
                </div>
                <p className="text-sm mt-2 opacity-90">{conStance}</p>
              </div>
              <div className="p-4 min-h-[400px] space-y-3">
                {conSide.map(id => renderPhilosopher(id))}
                {userSide === 'con' && renderUserCard()}
              </div>
            </div>
          </div>
        </div>

        {/* 用户角色选择区域 */}
        <div className="w-full max-w-5xl mb-12">
          <h3 className="text-2xl font-bold text-center mb-6">选择你的角色</h3>
          <div className="border-2 border-black p-8 bg-white">
            <div className="grid grid-cols-3 gap-6">
              {/* 正方选项 */}
              <button
                onClick={() => setUserSide('pro')}
                className={`p-6 border-2 transition-all ${
                  userSide === 'pro'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-black hover:border-black'
                }`}
              >
                <div className="text-2xl font-bold mb-3">正方辩手</div>
                <div className="text-sm opacity-80">{proStance}</div>
              </button>

              {/* 观众选项 */}
              <button
                onClick={() => setUserSide('audience')}
                className={`p-6 border-2 transition-all ${
                  userSide === 'audience'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-black hover:border-black'
                }`}
              >
                <div className="text-2xl font-bold mb-3">观众</div>
                <div className="text-sm opacity-80">观看辩论不参与</div>
              </button>

              {/* 反方选项 */}
              <button
                onClick={() => setUserSide('con')}
                className={`p-6 border-2 transition-all ${
                  userSide === 'con'
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 bg-white text-black hover:border-black'
                }`}
              >
                <div className="text-2xl font-bold mb-3">反方辩手</div>
                <div className="text-sm opacity-80">{conStance}</div>
              </button>
            </div>
          </div>
        </div>

        {/* 开始辩论按钮 */}
        <div>
          <button
            onClick={handleContinue}
            className="px-16 py-5 bg-black text-white text-xl font-bold hover:bg-gray-800 transition-colors"
          >
            开始辩论
          </button>
          <p className="text-center text-sm text-gray-500 mt-3">
            正反方必须至少各有一位参赛者
          </p>
        </div>
      </div>
    </div>
  );
}
