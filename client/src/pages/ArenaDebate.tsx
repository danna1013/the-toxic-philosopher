import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";

interface Message {
  id: string;
  speaker: string;
  role: 'host' | 'pro' | 'con' | 'user';
  content: string;
  timestamp: number;
}

interface Audience {
  id: string;
  name: string;
  occupation: string;
  stance: 'pro' | 'con' | 'neutral';
}

// 模拟50位观众
const generateAudiences = (): Audience[] => {
  const occupations = ['程序员', '诗人', 'CEO', '大学生', '教师', '医生', '律师', '艺术家', '工程师', '记者'];
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '陈十二'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `audience_${i}`,
    name: `${names[i % names.length]}${i + 1}`,
    occupation: occupations[i % occupations.length],
    stance: Math.random() > 0.5 ? 'pro' : 'con',
  }));
};

export default function ArenaDebate() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const sessionId = params.sessionId || 'unknown';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [audiences, setAudiences] = useState<Audience[]>(generateAudiences());
  const [currentSpeaker, setCurrentSpeaker] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const topic = sessionStorage.getItem('arenaTopic') || '未选择话题';
  const role = sessionStorage.getItem('arenaRole') || 'audience';
  const proSideIds = JSON.parse(sessionStorage.getItem('arenaProSide') || '[]');
  const conSideIds = JSON.parse(sessionStorage.getItem('arenaConSide') || '[]');
  
  const philosophers: Record<string, string> = {
    'socrates': '苏格拉底',
    'nietzsche': '尼采',
    'wittgenstein': '维特根斯坦',
    'kant': '康德',
    'freud': '弗洛伊德',
  };

  const proSide = proSideIds.map((id: string) => philosophers[id]);
  const conSide = conSideIds.map((id: string) => philosophers[id]);

  useEffect(() => {
    // 初始化辩论
    const initialMessage: Message = {
      id: 'msg_0',
      speaker: '主持人',
      role: 'host',
      content: `欢迎来到哲学"奇葩说"！今天的辩题是："${topic}"。正方由${proSide.join('、')}组成，反方由${conSide.join('、')}组成。让我们开始这场精彩的辩论！`,
      timestamp: Date.now(),
    };
    setMessages([initialMessage]);

    // 模拟辩论进行
    simulateDebate();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateDebate = () => {
    // 模拟辩论消息（实际应该连接WebSocket或轮询API）
    setTimeout(() => {
      addMessage(proSide[0], 'pro', '让我从理性的角度来分析这个问题...');
    }, 2000);

    setTimeout(() => {
      addMessage(conSide[0], 'con', '我必须指出，这种观点忽略了人性的复杂性...');
    }, 4000);

    setTimeout(() => {
      // 模拟观众立场变化
      updateAudienceStance();
    }, 5000);
  };

  const addMessage = (speaker: string, role: 'host' | 'pro' | 'con' | 'user', content: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      speaker,
      role,
      content,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
    setCurrentSpeaker(speaker);
  };

  const updateAudienceStance = () => {
    // 模拟部分观众改变立场
    setAudiences(prev => prev.map(a => {
      if (Math.random() > 0.9) {
        return { ...a, stance: a.stance === 'pro' ? 'con' : 'pro' };
      }
      return a;
    }));
  };

  const handleUserSend = () => {
    if (userInput.trim() && role === 'debater') {
      addMessage('你', 'user', userInput);
      setUserInput("");
      
      // 模拟AI回应
      setTimeout(() => {
        const opponent = Math.random() > 0.5 ? conSide[0] : proSide[0];
        const opponentRole = conSide.includes(opponent) ? 'con' : 'pro';
        addMessage(opponent, opponentRole, '这是一个有趣的观点，但我认为...');
      }, 2000);
    }
  };

  const handleViewResult = () => {
    setLocation(`/arena/result/${sessionId}`);
  };

  const proCount = audiences.filter(a => a.stance === 'pro').length;
  const conCount = audiences.filter(a => a.stance === 'con').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
      {/* 顶部导航 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-700">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">哲学"奇葩说"</h1>
            <span className="text-sm text-gray-400">Session: {sessionId}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/")}
              className="px-4 py-2 border border-gray-600 hover:border-white transition-colors text-sm"
            >
              退出辩论
            </button>
            <button
              onClick={handleViewResult}
              className="px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              查看结果
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="flex-1 flex pt-20 pb-6">
        {/* 左侧：正方 + 观众席（左半部分） */}
        <div className="w-1/4 flex flex-col gap-4 px-4">
          {/* 正方辩手 */}
          <div className="bg-green-900/30 border-2 border-green-500 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-green-400 mb-3 text-center">正方</h2>
            <div className="space-y-2">
              {proSide.map((name, i) => (
                <div
                  key={i}
                  className={`p-2 rounded ${currentSpeaker === name ? 'bg-green-500/50 animate-pulse' : 'bg-green-900/20'} border border-green-500/30`}
                >
                  <div className="font-medium text-sm">{name}</div>
                </div>
              ))}
              {role === 'debater' && (
                <div className="p-2 rounded bg-green-500/50 border border-green-500">
                  <div className="font-medium text-sm flex items-center gap-2">
                    <span>👤</span>
                    <span>你</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 观众席（左半部分） */}
          <div className="flex-1 bg-gray-800/50 border border-gray-600 p-4 rounded-lg overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-300 mb-2 sticky top-0 bg-gray-800/90">
              观众席 (左) - 支持正方: {Math.floor(proCount / 2)}
            </h3>
            <div className="space-y-1">
              {audiences.slice(0, 25).map(a => (
                <div
                  key={a.id}
                  className={`text-xs p-1.5 rounded flex items-center justify-between ${
                    a.stance === 'pro' ? 'bg-green-900/30 border-l-2 border-green-500' : 
                    a.stance === 'con' ? 'bg-red-900/30 border-l-2 border-red-500' : 
                    'bg-gray-700/30'
                  }`}
                >
                  <span className="truncate">{a.name}</span>
                  <span className="text-gray-400 text-xs">{a.occupation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 中间：辩论区域 */}
        <div className="flex-1 flex flex-col px-6">
          {/* 辩题和投票条 */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-center mb-4">{topic}</h2>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-green-400 w-16 text-right">正方 {proCount}</span>
              <div className="flex-1 h-8 bg-gray-700 rounded-full overflow-hidden flex">
                <div
                  className="bg-green-500 transition-all duration-500 flex items-center justify-center text-xs font-bold"
                  style={{ width: `${(proCount / 50) * 100}%` }}
                >
                  {proCount > 5 && `${proCount}`}
                </div>
                <div
                  className="bg-red-500 transition-all duration-500 flex items-center justify-center text-xs font-bold"
                  style={{ width: `${(conCount / 50) * 100}%` }}
                >
                  {conCount > 5 && `${conCount}`}
                </div>
              </div>
              <span className="text-sm text-red-400 w-16">反方 {conCount}</span>
            </div>
            <p className="text-xs text-center text-gray-400">
              💡 观众立场会随着辩论进行而改变
            </p>
          </div>

          {/* 辩论消息流 */}
          <div className="flex-1 bg-gray-800/30 border border-gray-600 rounded-lg p-6 overflow-y-auto">
            <div className="space-y-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === 'host' ? 'bg-yellow-900/30 border border-yellow-500/50' :
                      msg.role === 'pro' ? 'bg-green-900/30 border border-green-500/50' :
                      msg.role === 'con' ? 'bg-red-900/30 border border-red-500/50' :
                      'bg-blue-900/30 border border-blue-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-bold text-sm ${
                        msg.role === 'host' ? 'text-yellow-400' :
                        msg.role === 'pro' ? 'text-green-400' :
                        msg.role === 'con' ? 'text-red-400' :
                        'text-blue-400'
                      }`}>
                        {msg.speaker}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* 用户输入区（仅辩手模式） */}
          {role === 'debater' && (
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUserSend()}
                placeholder="输入你的观点..."
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:border-blue-500 outline-none text-white placeholder-gray-400"
              />
              <button
                onClick={handleUserSend}
                disabled={!userInput.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                发送
              </button>
            </div>
          )}
        </div>

        {/* 右侧：反方 + 观众席（右半部分） */}
        <div className="w-1/4 flex flex-col gap-4 px-4">
          {/* 反方辩手 */}
          <div className="bg-red-900/30 border-2 border-red-500 p-4 rounded-lg">
            <h2 className="text-lg font-bold text-red-400 mb-3 text-center">反方</h2>
            <div className="space-y-2">
              {conSide.map((name, i) => (
                <div
                  key={i}
                  className={`p-2 rounded ${currentSpeaker === name ? 'bg-red-500/50 animate-pulse' : 'bg-red-900/20'} border border-red-500/30`}
                >
                  <div className="font-medium text-sm">{name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 观众席（右半部分） */}
          <div className="flex-1 bg-gray-800/50 border border-gray-600 p-4 rounded-lg overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-300 mb-2 sticky top-0 bg-gray-800/90">
              观众席 (右) - 支持反方: {Math.ceil(conCount / 2)}
            </h3>
            <div className="space-y-1">
              {audiences.slice(25, 50).map(a => (
                <div
                  key={a.id}
                  className={`text-xs p-1.5 rounded flex items-center justify-between ${
                    a.stance === 'pro' ? 'bg-green-900/30 border-l-2 border-green-500' : 
                    a.stance === 'con' ? 'bg-red-900/30 border-l-2 border-red-500' : 
                    'bg-gray-700/30'
                  }`}
                >
                  <span className="truncate">{a.name}</span>
                  <span className="text-gray-400 text-xs">{a.occupation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
