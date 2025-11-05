import { useState } from "react";
import { useLocation } from "wouter";

interface Audience {
  id: string;
  name: string;
  occupation: string;
  stance: 'pro' | 'con' | 'neutral';
}

// 简化版：只展示部分观众作为示例
const sampleAudiences: Audience[] = [
  { id: 'a1', name: '张伟', occupation: '程序员', stance: 'neutral' },
  { id: 'a2', name: '李娜', occupation: '诗人', stance: 'neutral' },
  { id: 'a3', name: '王强', occupation: 'CEO', stance: 'neutral' },
  { id: 'a4', name: '刘芳', occupation: '大学生', stance: 'neutral' },
  { id: 'a5', name: '陈明', occupation: '教师', stance: 'neutral' },
  { id: 'a6', name: '赵丽', occupation: '医生', stance: 'neutral' },
  { id: 'a7', name: '孙杰', occupation: '律师', stance: 'neutral' },
  { id: 'a8', name: '周敏', occupation: '设计师', stance: 'neutral' },
  { id: 'a9', name: '吴涛', occupation: '记者', stance: 'neutral' },
  { id: 'a10', name: '郑红', occupation: '艺术家', stance: 'neutral' },
];

export default function ArenaAudienceSelect() {
  const [, setLocation] = useLocation();
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);

  const handleAudienceToggle = (id: string) => {
    if (selectedAudiences.includes(id)) {
      setSelectedAudiences(selectedAudiences.filter(a => a !== id));
    } else {
      if (selectedAudiences.length < 2) {
        setSelectedAudiences([...selectedAudiences, id]);
      }
    }
  };

  const handleContinue = () => {
    sessionStorage.setItem('arenaSelectedAudiences', JSON.stringify(selectedAudiences));
    // 生成一个随机的session ID
    const sessionId = 'session_' + Date.now();
    setLocation(`/arena/debate/${sessionId}`);
  };

  const handleSkip = () => {
    sessionStorage.setItem('arenaSelectedAudiences', JSON.stringify([]));
    const sessionId = 'session_' + Date.now();
    setLocation(`/arena/debate/${sessionId}`);
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
            <button onClick={() => setLocation("/arena/mode")} className="relative text-base md:text-lg text-black font-medium group">
              哲学"奇葩说"
              <span className="absolute bottom-0 left-0 w-full h-px bg-black"></span>
            </button>
            <button onClick={() => setLocation("/select")} className="relative text-base md:text-lg text-gray-600 hover:text-black transition-colors group">
              一对一开怼
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <div className="flex-1 flex flex-col items-center px-6 py-24">
        <div className="text-center mb-12 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
            选择观众发言
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-light mb-2">
            选择1-2位观众在辩论中发言（可选）
          </p>
          <p className="text-sm text-gray-500">
            已选择 {selectedAudiences.length} / 2 位观众
          </p>
        </div>

        {/* 观众网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl w-full mb-8">
          {sampleAudiences.map((audience) => (
            <button
              key={audience.id}
              onClick={() => handleAudienceToggle(audience.id)}
              disabled={!selectedAudiences.includes(audience.id) && selectedAudiences.length >= 2}
              className={`group relative p-4 border-2 transition-all duration-300 ${
                selectedAudiences.includes(audience.id)
                  ? 'border-black bg-black'
                  : selectedAudiences.length >= 2
                  ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                  : 'border-gray-300 bg-white hover:border-black'
              }`}
            >
              <div className="space-y-2">
                {/* 头像占位符 */}
                <div className={`w-16 h-16 mx-auto rounded-full border-2 flex items-center justify-center text-2xl ${
                  selectedAudiences.includes(audience.id)
                    ? 'border-white bg-white text-black'
                    : 'border-gray-400 bg-gray-200 text-gray-600'
                }`}>
                  {audience.name.charAt(0)}
                </div>
                
                <div className="text-center">
                  <div className={`font-bold text-sm ${
                    selectedAudiences.includes(audience.id) ? 'text-white' : 'text-black'
                  }`}>
                    {audience.name}
                  </div>
                  <div className={`text-xs ${
                    selectedAudiences.includes(audience.id) ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {audience.occupation}
                  </div>
                </div>
                
                {/* 选中指示器 */}
                {selectedAudiences.includes(audience.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-black text-sm font-bold">✓</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* 说明 */}
        <div className="text-center text-sm text-gray-600 mb-8 max-w-2xl">
          <p className="mb-2">
            💡 提示：这里展示的是部分观众示例。实际辩论中将有50位AI观众全程观战并投票。
          </p>
          <p>
            选中的观众将在辩论过程中发言，表达他们的观点和立场变化。
          </p>
        </div>

        {/* 按钮组 */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <button
              onClick={handleSkip}
              className="px-8 py-3 border-2 border-gray-400 bg-white text-gray-700 hover:border-black hover:text-black font-medium transition-all duration-300"
            >
              跳过此步骤
            </button>
            
            <button
              onClick={handleContinue}
              disabled={selectedAudiences.length === 0}
              className={`px-12 py-3 border-2 border-black font-bold transition-all duration-300 ${
                selectedAudiences.length > 0
                  ? 'bg-black text-white hover:bg-white hover:text-black'
                  : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
              }`}
            >
              开始辩论
            </button>
          </div>
          
          <button
            onClick={() => setLocation("/arena/camp")}
            className="text-gray-600 hover:text-black transition-colors underline"
          >
            返回阵营配置
          </button>
        </div>
      </div>
    </div>
  );
}
