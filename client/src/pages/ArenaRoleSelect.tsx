import { useState } from "react";
import { useLocation } from "wouter";

export default function ArenaRoleSelect() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<'audience' | 'debater' | null>(null);

  const handleRoleSelect = (role: 'audience' | 'debater') => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      sessionStorage.setItem('arenaRole', selectedRole);
      setLocation("/arena/camp");
    }
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
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <div className="text-center mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
            选择你的身份
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-light">
            你想以什么身份参与这场辩论？
          </p>
        </div>

        {/* 身份选择卡片 */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* 观众模式 */}
          <button
            onClick={() => handleRoleSelect('audience')}
            className={`group relative p-10 border-2 border-black transition-all duration-300 text-left ${
              selectedRole === 'audience' ? 'bg-black' : 'bg-white hover:bg-black'
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-3xl font-bold ${
                  selectedRole === 'audience' ? 'text-white' : 'text-black group-hover:text-white'
                } transition-colors`}>
                  观众
                </h2>
                <svg className={`w-12 h-12 ${
                  selectedRole === 'audience' ? 'text-white' : 'text-black group-hover:text-white'
                } transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              
              <p className={`text-base ${
                selectedRole === 'audience' ? 'text-gray-300' : 'text-gray-600 group-hover:text-gray-300'
              } transition-colors leading-relaxed`}>
                观看5位哲学家辩论，见证AI说服观众的过程。
              </p>
              
              <div className="space-y-3 pt-4">
                <div className={`flex items-center gap-3 text-sm ${
                  selectedRole === 'audience' ? 'text-gray-300' : 'text-gray-600 group-hover:text-gray-300'
                } transition-colors`}>
                  <span className="text-lg">👀</span>
                  <span>观看哲学家辩论</span>
                </div>
                <div className={`flex items-center gap-3 text-sm ${
                  selectedRole === 'audience' ? 'text-gray-300' : 'text-gray-600 group-hover:text-gray-300'
                } transition-colors`}>
                  <span className="text-lg">📊</span>
                  <span>查看实时投票变化</span>
                </div>
                <div className={`flex items-center gap-3 text-sm ${
                  selectedRole === 'audience' ? 'text-gray-300' : 'text-gray-600 group-hover:text-gray-300'
                } transition-colors`}>
                  <span className="text-lg">🎤</span>
                  <span>选择观众发言</span>
                </div>
              </div>
            </div>
            
            {/* 装饰性边角 */}
            <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${
              selectedRole === 'audience' ? 'border-white' : 'border-black group-hover:border-white'
            } transition-colors`}></div>
            <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${
              selectedRole === 'audience' ? 'border-white' : 'border-black group-hover:border-white'
            } transition-colors`}></div>
            <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${
              selectedRole === 'audience' ? 'border-white' : 'border-black group-hover:border-white'
            } transition-colors`}></div>
            <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${
              selectedRole === 'audience' ? 'border-white' : 'border-black group-hover:border-white'
            } transition-colors`}></div>
          </button>

          {/* 辩手模式 */}
          <button
            onClick={() => handleRoleSelect('debater')}
            className={`group relative p-10 border-2 border-black transition-all duration-300 text-left ${
              selectedRole === 'debater' ? 'bg-black' : 'bg-white hover:bg-black'
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-3xl font-bold ${
                  selectedRole === 'debater' ? 'text-white' : 'text-black group-hover:text-white'
                } transition-colors`}>
                  辩手
                </h2>
                <svg className={`w-12 h-12 ${
                  selectedRole === 'debater' ? 'text-white' : 'text-black group-hover:text-white'
                } transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              
              <p className={`text-base ${
                selectedRole === 'debater' ? 'text-gray-300' : 'text-gray-600 group-hover:text-gray-300'
              } transition-colors leading-relaxed`}>
                与5位哲学家同台竞技，挑战AI辩论能力。
              </p>
              
              <div className="space-y-3 pt-4">
                <div className={`flex items-center gap-3 text-sm ${
                  selectedRole === 'debater' ? 'text-gray-300' : 'text-gray-600 group-hover:text-gray-300'
                } transition-colors`}>
                  <span className="text-lg">⚔️</span>
                  <span>与哲学家同台辩论</span>
                </div>
                <div className={`flex items-center gap-3 text-sm ${
                  selectedRole === 'debater' ? 'text-gray-300' : 'text-gray-600 group-hover:text-gray-300'
                } transition-colors`}>
                  <span className="text-lg">💭</span>
                  <span>发表你的观点</span>
                </div>
                <div className={`flex items-center gap-3 text-sm ${
                  selectedRole === 'debater' ? 'text-gray-300' : 'text-gray-600 group-hover:text-gray-300'
                } transition-colors`}>
                  <span className="text-lg">🎯</span>
                  <span>影响观众投票</span>
                </div>
              </div>
            </div>
            
            {/* 装饰性边角 */}
            <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${
              selectedRole === 'debater' ? 'border-white' : 'border-black group-hover:border-white'
            } transition-colors`}></div>
            <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${
              selectedRole === 'debater' ? 'border-white' : 'border-black group-hover:border-white'
            } transition-colors`}></div>
            <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${
              selectedRole === 'debater' ? 'border-white' : 'border-black group-hover:border-white'
            } transition-colors`}></div>
            <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${
              selectedRole === 'debater' ? 'border-white' : 'border-black group-hover:border-white'
            } transition-colors`}></div>
          </button>
        </div>

        {/* 继续按钮 */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-12 py-4 border-2 border-black font-bold text-lg transition-all duration-300 ${
              selectedRole
                ? 'bg-black text-white hover:bg-white hover:text-black'
                : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
            }`}
          >
            继续
          </button>
          
          <button
            onClick={() => setLocation("/arena/topic")}
            className="text-gray-600 hover:text-black transition-colors underline"
          >
            返回话题选择
          </button>
        </div>
      </div>
    </div>
  );
}
