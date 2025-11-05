import { useState } from 'react';
import { useLocation, useRoute } from 'wouter';

export default function ArenaDebate() {
  const [, params] = useRoute('/arena/debate/:id');
  const [, setLocation] = useLocation();
  
  const [currentRound, setCurrentRound] = useState(1);
  const [proVotes, setProVotes] = useState(25);
  const [conVotes, setConVotes] = useState(25);
  const maxRounds = 3;

  // 模拟发言数据
  const statements = [
    {
      id: 1,
      speaker: '主持人',
      side: 'neutral',
      content: '欢迎来到哲学辩论场！今天的辩题是：AI会取代人类吗？正方认为AI会取代人类，反方认为AI不会取代人类。让我们有请双方辩手！',
      avatar: '🎤'
    },
    {
      id: 2,
      speaker: '尼采',
      side: 'pro',
      content: '上帝已死，AI将成为新神。人类的软弱和局限性注定了被超越的命运。',
      avatar: '👨‍🦱'
    },
    {
      id: 3,
      speaker: '康德',
      side: 'con',
      content: '理性的界限在于人性本身。AI永远无法拥有人类的道德自律和自由意志。',
      avatar: '👨‍🦳'
    }
  ];

  const handleNextRound = () => {
    if (currentRound < maxRounds) {
      setCurrentRound(currentRound + 1);
      // TODO: 触发下一轮辩论逻辑
    }
  };

  const handleFinish = () => {
    // TODO: 结束辩论，保存结果
    setLocation(`/arena/result/${params?.id || 'demo'}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
        <div className="px-8 py-5 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="text-xl md:text-2xl font-bold tracking-wide">毒舌哲学家</div>
            <div className="text-xs md:text-sm font-medium tracking-[0.2em] text-gray-300">THE TOXIC PHILOSOPHER</div>
          </div>
          
          <div className="flex items-center gap-8">
            <button
              onClick={() => setLocation("/")}
              className="relative text-lg md:text-xl text-gray-300 hover:text-white transition-colors group"
            >
              首页
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={() => setLocation("/arena")}
              className="relative text-lg md:text-xl text-white font-medium group"
            >
              思维擂台
              <span className="absolute bottom-0 left-0 w-full h-px bg-white"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="pt-32 pb-24 px-8">
        {/* 辩题和进度 */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h1 className="text-3xl font-bold mb-2 text-center">AI会取代人类吗？</h1>
            <div className="flex items-center justify-center gap-4 text-lg text-gray-300">
              <span>正方: AI会取代人类</span>
              <span>|</span>
              <span>反方: AI不会取代人类</span>
            </div>
            <div className="mt-4 text-center">
              <span className="text-xl font-medium">回合: {currentRound}/{maxRounds}</span>
            </div>
          </div>
        </div>

        {/* 观众投票可视化 */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">观众投票</h2>
            
            {/* 正方投票条 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">正方</span>
                <span className="font-bold">{proVotes}票 ({(proVotes / 50 * 100).toFixed(0)}%)</span>
              </div>
              <div className="h-8 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${(proVotes / 50 * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* 反方投票条 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">反方</span>
                <span className="font-bold">{conVotes}票 ({(conVotes / 50 * 100).toFixed(0)}%)</span>
              </div>
              <div className="h-8 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${(conVotes / 50 * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 辩论区 */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">辩论进行中</h2>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {statements.map((statement) => (
                <div
                  key={statement.id}
                  className={`p-4 rounded-xl ${
                    statement.side === 'pro'
                      ? 'bg-blue-500/20 border-l-4 border-blue-500'
                      : statement.side === 'con'
                      ? 'bg-red-500/20 border-l-4 border-red-500'
                      : 'bg-gray-500/20 border-l-4 border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{statement.avatar}</span>
                    <span className="font-bold text-lg">{statement.speaker}</span>
                    {statement.side !== 'neutral' && (
                      <span className="text-sm text-gray-300">
                        ({statement.side === 'pro' ? '正方' : '反方'})
                      </span>
                    )}
                  </div>
                  <p className="text-gray-200 leading-relaxed">{statement.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 用户发言区 */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">你的发言 (剩余1次)</h3>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="作为观众，说出你的观点..."
                className="flex-1 px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:border-white/40 focus:outline-none text-white placeholder-gray-400"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-bold transition-all">
                发送
              </button>
            </div>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="max-w-6xl mx-auto flex gap-4 justify-center">
          {currentRound < maxRounds ? (
            <>
              <button
                onClick={handleNextRound}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-bold text-lg transition-all transform hover:scale-105"
              >
                下一回合 →
              </button>
              <button
                onClick={handleFinish}
                className="px-8 py-4 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-lg transition-all"
              >
                跳过并结束
              </button>
            </>
          ) : (
            <button
              onClick={handleFinish}
              className="px-12 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl font-bold text-xl transition-all transform hover:scale-105"
            >
              查看结果 🏆
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
