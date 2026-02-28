import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Eye, Swords, Users, ArrowRight, Crown, Vote } from 'lucide-react';
import NavBar from '@/components/NavBar';
import StarField from '@/components/StarField';

export default function ArenaMode() {
  const [, setLocation] = useLocation();
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);

  const handleSelectMode = (mode: 'basic' | 'full') => {
    sessionStorage.setItem('arenaMode', mode);
    setLocation('/arena/topic');
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
            哲学奇葩说
          </h1>
          <p className="text-white/40 text-base md:text-lg max-w-lg mx-auto">
            神仙打架的辩论场，选择你的参与方式
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl w-full">
          {/* Basic Mode */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            onMouseEnter={() => setHoveredMode('basic')}
            onMouseLeave={() => setHoveredMode(null)}
            onClick={() => handleSelectMode('basic')}
            className="glass-card p-8 cursor-pointer group transition-all duration-500 hover:border-blue-500/30"
            style={{ transform: hoveredMode === 'basic' ? 'translateY(-4px)' : 'translateY(0)' }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Eye className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white/90">基础模式</h3>
            <p className="text-sm text-white/30 mb-4">观看辩论</p>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              作为观众旁观哲学家们的激烈辩论。选择辩题，分配正反方阵营，观看 AI 哲学家们唇枪舌剑。
            </p>
            <ul className="space-y-2 mb-6">
              {['选择/自定义辩题', '分配正反方哲学家', '观看完整辩论流程', '裁判判定胜负'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-white/40">
                  <div className="w-1 h-1 rounded-full bg-blue-400" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
              进入观战
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </motion.div>

          {/* Full Mode */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            onMouseEnter={() => setHoveredMode('full')}
            onMouseLeave={() => setHoveredMode(null)}
            onClick={() => handleSelectMode('full')}
            className="glass-card p-8 cursor-pointer group transition-all duration-500 hover:border-rose-500/30 relative"
            style={{ transform: hoveredMode === 'full' ? 'translateY(-4px)' : 'translateY(0)' }}
          >
            {/* Recommended badge */}
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #f59e0b)', color: 'white' }}>
              推荐
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Swords className="w-7 h-7 text-rose-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white/90">完整模式</h3>
            <p className="text-sm text-white/30 mb-4">参与辩论 + AI 观众投票</p>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              不只是旁观——你可以作为辩手亲自下场参与辩论。50位不同背景的 AI 观众实时投票，最终评选 BB King。
            </p>
            <ul className="space-y-2 mb-6">
              {[
                { icon: Swords, text: '作为辩手参与辩论' },
                { icon: Users, text: '50位AI观众实时投票' },
                { icon: Crown, text: 'BB King 评选' },
                { icon: Vote, text: '立论\u2192质询\u2192自由辩论\u2192总结\u2192裁判' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-xs text-white/40">
                  <Icon className="w-3 h-3 text-rose-400/60" />
                  {text}
                </li>
              ))}
            </ul>
            <div className="flex items-center text-rose-400 text-sm font-medium group-hover:text-rose-300 transition-colors">
              进入辩论场
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
