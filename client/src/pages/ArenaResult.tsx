import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Trophy, Crown, ArrowRight, RotateCcw, Home, Shield, Swords, Users } from "lucide-react";
import NavBar from "@/components/NavBar";
import StarField from "@/components/StarField";

const philosopherNames: Record<string, string> = {
  'socrates': '苏格拉底', 'nietzsche': '尼采', 'wittgenstein': '维特根斯坦',
  'kant': '康德', 'freud': '弗洛伊德', 'zhuangzi': '庄子',
  'schopenhauer': '叔本华', 'sartre': '萨特', 'machiavelli': '马基雅维利',
  'diogenes': '第欧根尼', 'beauvoir': '波伏娃',
};

const philosopherColors: Record<string, string> = {
  'socrates': '#fcd34d', 'nietzsche': '#fb923c', 'wittgenstein': '#d4a574',
  'kant': '#60a5fa', 'freud': '#a78bfa', 'zhuangzi': '#34d399',
  'schopenhauer': '#94a3b8', 'sartre': '#f472b6', 'machiavelli': '#ef4444',
  'diogenes': '#a3e635', 'beauvoir': '#e879f9',
};

export default function ArenaResult() {
  const [, setLocation] = useLocation();

  const topic = sessionStorage.getItem('arenaTopic') || '未知话题';
  const proStance = sessionStorage.getItem('arenaProStance') || '正方';
  const conStance = sessionStorage.getItem('arenaConStance') || '反方';
  const proSideIds: string[] = JSON.parse(sessionStorage.getItem('arenaProSide') || '[]');
  const conSideIds: string[] = JSON.parse(sessionStorage.getItem('arenaConSide') || '[]');
  const arenaMode = sessionStorage.getItem('arenaMode') || 'basic';
  const isFullMode = arenaMode === 'full';

  const proSide = proSideIds.map(id => philosopherNames[id] || id);
  const conSide = conSideIds.map(id => philosopherNames[id] || id);

  // Simulated results
  const proVotes = 28;
  const conVotes = 22;
  const winner = proVotes > conVotes ? 'pro' : 'con';
  const winnerSide = winner === 'pro' ? proSide : conSide;
  const winnerIds = winner === 'pro' ? proSideIds : conSideIds;
  const bbKing = winnerSide[0];
  const bbKingId = winnerIds[0];
  const bbKingColor = philosopherColors[bbKingId] || '#f59e0b';

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <NavBar />
      <StarField count={200} />
      <div className="absolute inset-0 cosmic-bg pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-6 pt-28 pb-16">
        {/* Victory Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ rotate: -10, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, ${winner === 'pro' ? 'rgba(59,130,246,0.3)' : 'rgba(244,63,94,0.3)'} 0%, transparent 70%)`,
              boxShadow: `0 0 60px ${winner === 'pro' ? 'rgba(59,130,246,0.3)' : 'rgba(244,63,94,0.3)'}`,
            }}
          >
            <Trophy className="w-10 h-10" style={{ color: winner === 'pro' ? '#3b82f6' : '#f43f5e' }} />
          </motion.div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3 gradient-text">
            辩论结束
          </h1>
          <p className="text-white/40 text-base">
            {topic}
          </p>
        </motion.div>

        {/* Result Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass-card-strong p-8 max-w-2xl w-full mb-8"
        >
          {/* Winner */}
          <div className="text-center mb-8">
            <p className="text-sm text-white/40 mb-2">获胜方</p>
            <div className="flex items-center justify-center gap-3">
              {winner === 'pro' ? <Shield className="w-6 h-6 text-blue-400" /> : <Swords className="w-6 h-6 text-rose-400" />}
              <span className="text-2xl font-bold" style={{ color: winner === 'pro' ? '#3b82f6' : '#f43f5e' }}>
                {winner === 'pro' ? '正方' : '反方'}
              </span>
            </div>
            <p className="text-sm text-white/40 mt-1">{winner === 'pro' ? proStance : conStance}</p>
          </div>

          {/* Vote Bar */}
          {isFullMode && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-400">正方 {proVotes}票</span>
                <span className="text-sm font-medium text-rose-400">反方 {conVotes}票</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                <motion.div
                  initial={{ width: '50%' }}
                  animate={{ width: `${(proVotes / 50) * 100}%` }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-l-full"
                />
                <motion.div
                  initial={{ width: '50%' }}
                  animate={{ width: `${(conVotes / 50) * 100}%` }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="bg-gradient-to-r from-rose-400 to-rose-500 rounded-r-full"
                />
              </div>
              <p className="text-[10px] text-white/20 text-center mt-2">50位AI观众投票结果</p>
            </div>
          )}

          {/* BB King */}
          <div className="text-center p-6 rounded-2xl" style={{ background: `${bbKingColor}08`, border: `1px solid ${bbKingColor}20` }}>
            <Crown className="w-8 h-8 mx-auto mb-3" style={{ color: bbKingColor }} />
            <p className="text-xs text-white/40 tracking-wider uppercase mb-2">BB King · 最佳辩手</p>
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold"
              style={{ background: `${bbKingColor}20`, color: bbKingColor, border: `2px solid ${bbKingColor}40` }}>
              {bbKing?.[0] || '?'}
            </div>
            <p className="text-xl font-bold" style={{ color: bbKingColor }}>{bbKing}</p>
            <p className="text-xs text-white/30 mt-1">以犀利的论证和深刻的洞察力赢得了最佳辩手称号</p>
          </div>
        </motion.div>

        {/* Participants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="glass-card p-6 max-w-2xl w-full mb-8"
        >
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-blue-400">正方</span>
              </div>
              <div className="space-y-2">
                {proSide.map((name, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{ background: `${philosopherColors[proSideIds[i]] || '#3b82f6'}20`, color: philosopherColors[proSideIds[i]] || '#3b82f6' }}>
                      {name[0]}
                    </div>
                    <span className="text-sm text-white/60">{name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Swords className="w-4 h-4 text-rose-400" />
                <span className="text-sm font-bold text-rose-400">反方</span>
              </div>
              <div className="space-y-2">
                {conSide.map((name, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{ background: `${philosopherColors[conSideIds[i]] || '#f43f5e'}20`, color: philosopherColors[conSideIds[i]] || '#f43f5e' }}>
                      {name[0]}
                    </div>
                    <span className="text-sm text-white/60">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button onClick={() => setLocation("/arena/mode")} className="btn-apple-secondary text-sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            再来一场
          </button>
          <button onClick={() => setLocation("/")} className="btn-apple-primary text-sm">
            <Home className="w-4 h-4 mr-2" />
            返回首页
          </button>
        </motion.div>
      </div>
    </div>
  );
}
