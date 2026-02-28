import { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkle: 'none' | 'slow' | 'fast';
  delay: number;
}

interface StarFieldProps {
  count?: number;
  className?: string;
}

export default function StarField({ count = 200, className = '' }: StarFieldProps) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const rand = Math.random();
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: rand > 0.9 ? 3 : rand > 0.6 ? 2 : 1,
        opacity: 0.3 + Math.random() * 0.7,
        twinkle: rand > 0.7 ? 'none' : rand > 0.4 ? 'slow' : 'fast',
        delay: Math.random() * 8,
      };
    });
  }, [count]);

  const meteors = useMemo(() => [
    { top: 8, left: 15, delay: 0, duration: 3 },
    { top: 25, left: 70, delay: 4, duration: 2.5 },
    { top: 45, left: 40, delay: 8, duration: 3.5 },
    { top: 65, left: 85, delay: 12, duration: 2.8 },
  ], []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full bg-white ${
            star.twinkle === 'slow' ? 'animate-twinkle-slow' :
            star.twinkle === 'fast' ? 'animate-twinkle-fast' : ''
          }`}
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: `${star.y}%`,
            left: `${star.x}%`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Nebula glow effects */}
      <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, transparent 70%)' }} />
      <div className="absolute top-[60%] right-[10%] w-[350px] h-[350px] rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[20%] left-[40%] w-[300px] h-[300px] rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)' }} />

      {/* Meteors */}
      {meteors.map((meteor, i) => (
        <div
          key={`meteor-${i}`}
          className="absolute animate-meteor"
          style={{
            top: `${meteor.top}%`,
            left: `${meteor.left}%`,
            animationDelay: `${meteor.delay}s`,
            animationDuration: `${meteor.duration}s`,
          }}
        >
          <div className="relative">
            <div className="w-2 h-2 bg-white rounded-full relative z-10"
              style={{ boxShadow: '0 0 6px 3px rgba(255,255,255,0.6), 0 0 12px 6px rgba(255,255,255,0.3)' }} />
            <div className="absolute top-1/2 right-full -translate-y-1/2"
              style={{
                width: '120px',
                height: '1.5px',
                background: 'linear-gradient(to left, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 30%, transparent 100%)',
              }} />
          </div>
        </div>
      ))}
    </div>
  );
}
