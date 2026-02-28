import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, Swords, ArrowLeft, ArrowRight, Users, MessageSquare, BarChart3, Target } from "lucide-react";
import NavBar from "@/components/NavBar";
import StarField from "@/components/StarField";

export default function ArenaRoleSelect() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<'audience' | 'debater' | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      sessionStorage.setItem('arenaRole', selectedRole);
      setLocation("/arena/camp");
    }
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
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 gradient-text">
            选择你的身份
          </h1>
          <p className="text-white/40 text-base md:text-lg max-w-lg mx-auto">
            你想以什么身份参与这场辩论？
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl w-full">
          {/* Audience Mode */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            onClick={() => setSelectedRole('audience')}
            className={`glass-card p-8 cursor-pointer group transition-all duration-500 ${
              selectedRole === 'audience'
                ? 'border-blue-500/50 bg-blue-500/10'
                : 'hover:border-blue-500/30'
            }`}
            style={{ transform: selectedRole === 'audience' ? 'translateY(-4px)' : 'translateY(0)' }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Eye className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white/90">观众</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              观看哲学家们的激烈辩论，见证 AI 说服观众的过程。
            </p>
            <ul className="space-y-2.5">
              {[
                { icon: Eye, text: '观看哲学家辩论' },
                { icon: BarChart3, text: '查看实时投票变化' },
                { icon: Users, text: '选择观众发言' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-xs text-white/40">
                  <Icon className="w-3.5 h-3.5 text-blue-400/60" />
                  {text}
                </li>
              ))}
            </ul>
            {selectedRole === 'audience' && (
              <div className="mt-4 flex items-center gap-1.5 text-blue-400 text-xs font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                已选择
              </div>
            )}
          </motion.div>

          {/* Debater Mode */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            onClick={() => setSelectedRole('debater')}
            className={`glass-card p-8 cursor-pointer group transition-all duration-500 relative ${
              selectedRole === 'debater'
                ? 'border-rose-500/50 bg-rose-500/10'
                : 'hover:border-rose-500/30'
            }`}
            style={{ transform: selectedRole === 'debater' ? 'translateY(-4px)' : 'translateY(0)' }}
          >
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #f59e0b)', color: 'white' }}>
              推荐
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Swords className="w-7 h-7 text-rose-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white/90">辩手</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              与哲学家同台竞技，挑战 AI 辩论能力，影响观众投票。
            </p>
            <ul className="space-y-2.5">
              {[
                { icon: Swords, text: '与哲学家同台辩论' },
                { icon: MessageSquare, text: '发表你的观点' },
                { icon: Target, text: '影响观众投票' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-xs text-white/40">
                  <Icon className="w-3.5 h-3.5 text-rose-400/60" />
                  {text}
                </li>
              ))}
            </ul>
            {selectedRole === 'debater' && (
              <div className="mt-4 flex items-center gap-1.5 text-rose-400 text-xs font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                已选择
              </div>
            )}
          </motion.div>
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center gap-4 mt-10"
        >
          <button
            onClick={() => setLocation('/arena/topic')}
            className="btn-apple-secondary text-sm px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="btn-apple-primary text-sm px-8 py-3 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            继续
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
