import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Users, Check, SkipForward } from "lucide-react";
import NavBar from "@/components/NavBar";
import StarField from "@/components/StarField";

interface Audience {
  id: string;
  name: string;
  occupation: string;
  color: string;
}

const sampleAudiences: Audience[] = [
  { id: 'a1', name: '张伟', occupation: '程序员', color: '#3b82f6' },
  { id: 'a2', name: '李娜', occupation: '诗人', color: '#a855f7' },
  { id: 'a3', name: '王强', occupation: 'CEO', color: '#f59e0b' },
  { id: 'a4', name: '刘芳', occupation: '大学生', color: '#10b981' },
  { id: 'a5', name: '陈明', occupation: '教师', color: '#6366f1' },
  { id: 'a6', name: '赵丽', occupation: '医生', color: '#ec4899' },
  { id: 'a7', name: '孙杰', occupation: '律师', color: '#f43f5e' },
  { id: 'a8', name: '周敏', occupation: '设计师', color: '#06b6d4' },
  { id: 'a9', name: '吴涛', occupation: '记者', color: '#84cc16' },
  { id: 'a10', name: '郑红', occupation: '艺术家', color: '#e879f9' },
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
    const sessionId = 'session_' + Date.now();
    setLocation(`/arena/debate/${sessionId}`);
  };

  const handleSkip = () => {
    sessionStorage.setItem('arenaSelectedAudiences', JSON.stringify([]));
    const sessionId = 'session_' + Date.now();
    setLocation(`/arena/debate/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <NavBar />
      <StarField count={150} />
      <div className="absolute inset-0 cosmic-bg pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 gradient-text">
            选择观众发言
          </h1>
          <p className="text-white/40 text-base md:text-lg max-w-lg mx-auto mb-2">
            选择 1-2 位观众在辩论中发言（可选）
          </p>
          <p className="text-sm text-white/30">
            已选择 <span className="text-indigo-400 font-medium">{selectedAudiences.length}</span> / 2 位观众
          </p>
        </motion.div>

        {/* Audience Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl w-full mb-8"
        >
          {sampleAudiences.map((audience, i) => {
            const isSelected = selectedAudiences.includes(audience.id);
            const isDisabled = !isSelected && selectedAudiences.length >= 2;

            return (
              <motion.button
                key={audience.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
                onClick={() => handleAudienceToggle(audience.id)}
                disabled={isDisabled}
                className={`relative p-4 rounded-2xl transition-all duration-300 text-center ${
                  isSelected
                    ? 'bg-white/10 border border-white/20'
                    : isDisabled
                    ? 'bg-white/[0.02] border border-white/5 opacity-40 cursor-not-allowed'
                    : 'bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] hover:border-white/15 cursor-pointer'
                }`}
              >
                {/* Selected check */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: audience.color }}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-2.5 flex items-center justify-center text-base font-bold transition-all duration-300"
                  style={{
                    background: `${audience.color}20`,
                    border: `1.5px solid ${isSelected ? audience.color + '60' : audience.color + '30'}`,
                    color: audience.color,
                  }}
                >
                  {audience.name[0]}
                </div>

                <p className="text-sm font-medium text-white/80 mb-0.5">{audience.name}</p>
                <p className="text-[10px] text-white/35">{audience.occupation}</p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-xs text-white/25 text-center max-w-lg mb-8"
        >
          实际辩论中将有 50 位 AI 观众全程观战并投票。选中的观众将在辩论过程中发言，表达观点和立场变化。
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={() => setLocation('/arena/camp')}
            className="btn-apple-secondary text-sm px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </button>
          <button
            onClick={handleSkip}
            className="btn-apple-secondary text-sm px-6 py-3"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            跳过
          </button>
          <button
            onClick={handleContinue}
            disabled={selectedAudiences.length === 0}
            className="btn-apple-primary text-sm px-8 py-3 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            开始辩论
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
