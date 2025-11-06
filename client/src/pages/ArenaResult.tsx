import { useState } from "react";
import { useLocation, useParams } from "wouter";

interface Audience {
  id: string;
  name: string;
  occupation: string;
  stance: 'pro' | 'con';
  reason: string;
}

// 模拟观众数据
const mockAudiences: Audience[] = [
  { id: '1', name: '张三', occupation: '程序员', stance: 'pro', reason: '从技术发展的角度来看，正方的论点更有说服力。' },
  { id: '2', name: '李四', occupation: '诗人', stance: 'con', reason: '反方对人性的理解更深刻，触动了我的内心。' },
  { id: '3', name: '王五', occupation: 'CEO', stance: 'pro', reason: '正方的逻辑更严密，更符合商业实践。' },
  { id: '4', name: '赵六', occupation: '大学生', stance: 'con', reason: '反方的观点让我重新思考了这个问题。' },
  { id: '5', name: '钱七', occupation: '教师', stance: 'pro', reason: '正方的论证更有教育意义。' },
  { id: '6', name: '孙八', occupation: '医生', stance: 'con', reason: '从医学伦理的角度，反方的立场更合理。' },
  { id: '7', name: '周九', occupation: '律师', stance: 'pro', reason: '正方的法律论证更充分。' },
  { id: '8', name: '吴十', occupation: '艺术家', stance: 'con', reason: '反方的表达更有艺术感染力。' },
];

export default function ArenaResult() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const sessionId = params.sessionId || 'unknown';
  
  const [topic] = useState(sessionStorage.getItem('arenaTopic') || '未知话题');
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);
  const [showAudienceSpeeches, setShowAudienceSpeeches] = useState(false);
  
  // 模拟结果数据
  const finalProVotes = 28;
  const finalConVotes = 22;
  const winner = finalProVotes > finalConVotes ? 'pro' : 'con';

  const handleAudienceSelect = (audienceId: string) => {
    if (selectedAudiences.includes(audienceId)) {
      setSelectedAudiences(selectedAudiences.filter(id => id !== audienceId));
    } else if (selectedAudiences.length < 2) {
      setSelectedAudiences([...selectedAudiences, audienceId]);
    }
  };

  const handleShowSpeeches = () => {
    if (selectedAudiences.length > 0) {
      setShowAudienceSpeeches(true);
    }
  };

  const handlePlayAgain = () => {
    // 清除session数据
    sessionStorage.removeItem('arenaTopic');
    sessionStorage.removeItem('arenaRole');
    sessionStorage.removeItem('arenaProSide');
    sessionStorage.removeItem('arenaConSide');
    sessionStorage.removeItem('arenaSelectedAudiences');
    sessionStorage.removeItem('arenaMode');
    setLocation("/arena/mode");
  };

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
      <div className="flex-1 flex flex-col items-center px-6 py-24 pb-32">
        <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
            辩论结束
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light mb-4">
            辩题：{topic}
          </p>
          <p className="text-sm text-gray-500">Session ID: {sessionId}</p>
        </div>

        {/* 结果展示 */}
        <div className="w-full max-w-5xl space-y-8">
          {/* 胜负结果 */}
          <div className="text-center p-12 border-4 border-black bg-gray-50">
            <h2 className="text-4xl font-bold mb-4">
              {winner === 'pro' ? (
                <span className="text-green-600">正方获胜！</span>
              ) : (
                <span className="text-red-600">反方获胜！</span>
              )}
            </h2>
            <p className="text-xl text-gray-600">
              最终投票：正方 {finalProVotes} vs {finalConVotes} 反方
            </p>
          </div>

          {/* 投票条 */}
          <div className="p-6 border-2 border-black">
            <h3 className="text-xl font-bold mb-4 text-center">观众投票分布</h3>
            <div className="h-12 bg-gray-200 rounded-full overflow-hidden flex">
              <div 
                className="bg-green-500 flex items-center justify-center text-white font-bold"
                style={{ width: `${(finalProVotes / 50) * 100}%` }}
              >
                {finalProVotes}
              </div>
              <div 
                className="bg-red-500 flex items-center justify-center text-white font-bold"
                style={{ width: `${(finalConVotes / 50) * 100}%` }}
              >
                {finalConVotes}
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>正方 ({((finalProVotes / 50) * 100).toFixed(1)}%)</span>
              <span>反方 ({((finalConVotes / 50) * 100).toFixed(1)}%)</span>
            </div>
          </div>

          {/* 观众发言选择 */}
          {!showAudienceSpeeches && (
            <div className="p-6 border-2 border-black">
              <h3 className="text-xl font-bold mb-4 text-center">邀请观众发言</h3>
              <p className="text-center text-gray-600 mb-6">
                选择1-2位观众，听听他们为什么选择这一方
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {mockAudiences.map(audience => (
                  <button
                    key={audience.id}
                    onClick={() => handleAudienceSelect(audience.id)}
                    className={`p-4 border-2 transition-all text-left ${
                      selectedAudiences.includes(audience.id)
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">{audience.name}</span>
                      <span className={`text-xs px-2 py-1 border ${
                        audience.stance === 'pro' ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'
                      } ${selectedAudiences.includes(audience.id) ? 'border-white text-white' : ''}`}>
                        {audience.stance === 'pro' ? '支持正方' : '支持反方'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{audience.occupation}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleShowSpeeches}
                  disabled={selectedAudiences.length === 0}
                  className={`px-8 py-3 border-2 border-black font-bold transition-all ${
                    selectedAudiences.length > 0
                      ? 'bg-black text-white hover:bg-white hover:text-black'
                      : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                  }`}
                >
                  听听他们的想法 ({selectedAudiences.length}/2)
                </button>
                <button
                  onClick={() => setShowAudienceSpeeches(true)}
                  className="px-8 py-3 border-2 border-gray-400 text-gray-600 hover:border-black hover:text-black transition-all"
                >
                  跳过
                </button>
              </div>
            </div>
          )}

          {/* 观众发言展示 */}
          {showAudienceSpeeches && (
            <div className="p-6 border-2 border-black bg-gray-50">
              <h3 className="text-xl font-bold mb-6 text-center">观众发言</h3>
              {selectedAudiences.length > 0 ? (
                <div className="space-y-6">
                  {selectedAudiences.map(id => {
                    const audience = mockAudiences.find(a => a.id === id);
                    if (!audience) return null;
                    return (
                      <div key={id} className="p-6 bg-white border-2 border-gray-300">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold">{audience.name}</h4>
                            <p className="text-sm text-gray-600">{audience.occupation}</p>
                          </div>
                          <span className={`text-sm px-3 py-1 border-2 font-medium ${
                            audience.stance === 'pro' 
                              ? 'border-green-500 text-green-600 bg-green-50' 
                              : 'border-red-500 text-red-600 bg-red-50'
                          }`}>
                            {audience.stance === 'pro' ? '支持正方' : '支持反方'}
                          </span>
                        </div>
                        <p className="text-base leading-relaxed text-gray-700">
                          "{audience.reason}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500">未选择观众发言</p>
              )}
            </div>
          )}

          {/* 精彩回顾（占位） */}
          <div className="p-6 border-2 border-gray-300 bg-gray-50">
            <h3 className="text-xl font-bold mb-4 text-center">精彩回顾</h3>
            <p className="text-center text-gray-500">
              [辩论精彩片段回顾，待实现]<br/>
              将展示辩论中最精彩的几轮交锋
            </p>
          </div>

          {/* 观众立场变化（占位） */}
          <div className="p-6 border-2 border-gray-300 bg-gray-50">
            <h3 className="text-xl font-bold mb-4 text-center">观众立场变化</h3>
            <p className="text-center text-gray-500">
              [观众立场变化统计，待实现]<br/>
              将展示辩论过程中观众立场的动态变化
            </p>
          </div>
         </div>
        </div>
        {/* 操作按钮 */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <button
              onClick={handlePlayAgain}
              className="px-12 py-4 border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-all font-bold text-lg"
            >
              再来一局
            </button>
            <button
              onClick={() => setLocation("/")}
              className="px-12 py-4 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all font-bold text-lg"
            >
              返回首页
            </button>
          </div>
          
          <button
            onClick={() => alert('分享功能待实现')}
            className="px-8 py-3 border border-gray-400 text-gray-600 hover:border-black hover:text-black transition-all"
          >
            分享结果
          </button>
        </div>
      </div>
    </div>
  );
}
