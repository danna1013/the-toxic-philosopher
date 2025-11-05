import { useLocation, useRoute } from 'wouter';

export default function ArenaResult() {
  const [, params] = useRoute('/arena/result/:id');
  const [, setLocation] = useLocation();

  // 模拟结果数据
  const result = {
    winner: 'con',
    topic: 'AI会取代人类吗？',
    proVotes: 22,
    conVotes: 28,
    highlights: [
      {
        speaker: '尼采',
        content: '上帝已死，AI将成为新神...',
        persuaded: 12
      },
      {
        speaker: '康德',
        content: '理性的界限在于人性本身...',
        persuaded: 15
      }
    ]
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
        {/* 结果标题 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-5xl font-bold mb-4">
            {result.winner === 'pro' ? '正方获胜！' : '反方获胜！'}
          </h1>
          <p className="text-2xl text-gray-300">
            {result.winner === 'pro' ? 'AI会取代人类' : 'AI不会取代人类'}
          </p>
        </div>

        {/* 最终投票 */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">最终投票</h2>
            
            {/* 正方 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-medium">正方: AI会取代人类</span>
                <span className="text-2xl font-bold">{result.proVotes}票 ({(result.proVotes / 50 * 100).toFixed(0)}%)</span>
              </div>
              <div className="h-12 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-end pr-4 text-white font-bold transition-all duration-1000"
                  style={{ width: `${(result.proVotes / 50 * 100)}%` }}
                >
                  {result.proVotes > 10 && `${(result.proVotes / 50 * 100).toFixed(0)}%`}
                </div>
              </div>
            </div>

            {/* 反方 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-medium">反方: AI不会取代人类</span>
                <span className="text-2xl font-bold">{result.conVotes}票 ({(result.conVotes / 50 * 100).toFixed(0)}%)</span>
              </div>
              <div className="h-12 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-end pr-4 text-white font-bold transition-all duration-1000"
                  style={{ width: `${(result.conVotes / 50 * 100)}%` }}
                >
                  {result.conVotes > 10 && `${(result.conVotes / 50 * 100).toFixed(0)}%`}
                </div>
              </div>
            </div>

            <p className="text-center text-gray-300 mt-6">
              共有 {result.proVotes + result.conVotes} 位观众参与投票
            </p>
          </div>
        </div>

        {/* 精彩回顾 */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">精彩回顾</h2>
            
            <div className="space-y-6">
              {result.highlights.map((highlight, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🌟</span>
                    <span className="text-2xl font-bold">{highlight.speaker}</span>
                  </div>
                  <p className="text-lg text-gray-200 mb-3 leading-relaxed">
                    "{highlight.content}"
                  </p>
                  <p className="text-yellow-400 font-medium">
                    说服了 {highlight.persuaded} 位观众
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => setLocation("/arena")}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-bold text-lg transition-all transform hover:scale-105"
          >
            再来一场
          </button>
          <button
            onClick={() => setLocation("/")}
            className="px-8 py-4 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-lg transition-all"
          >
            返回首页
          </button>
          <button
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-bold text-lg transition-all"
          >
            分享结果 📤
          </button>
        </div>
      </div>
    </div>
  );
}
