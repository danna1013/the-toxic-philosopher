import { useEffect, useState } from 'react';

export default function MobileDetector({ children }: { children: React.ReactNode }) {
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      setShowMobileWarning(isMobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!showMobileWarning) {
    return <>{children}</>;
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
      zIndex: 9999
    }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>
        毒舌哲学家
      </h1>
      <p style={{ fontSize: '11px', color: '#666', marginBottom: '40px', letterSpacing: '0.2em' }}>
        THE TOXIC PHILOSOPHER
      </p>
      
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #9333ea, #3b82f6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </div>
      
      <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px', lineHeight: '1.4' }}>
        请在电脑上体验
      </h2>
      
      <p style={{ color: '#999', fontSize: '13px', lineHeight: '1.6', marginBottom: '24px', maxWidth: '300px' }}>
        为了获得最佳的视觉效果和交互体验，请使用电脑浏览器访问
      </p>
      
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '13px',
        maxWidth: '320px'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <span style={{ color: '#fcd34d', marginRight: '8px' }}>●</span>
          沉浸式星空选择界面
        </div>
        <div style={{ marginBottom: '12px' }}>
          <span style={{ color: '#fb923c', marginRight: '8px' }}>●</span>
          5位哲学家的深度对话
        </div>
        <div>
          <span style={{ color: '#a78bfa', marginRight: '8px' }}>●</span>
          精心设计的视觉动画
        </div>
      </div>
      
      <p style={{ fontSize: '11px', color: '#666', marginTop: '24px' }}>
        移动端版本正在开发中
      </p>
    </div>
  );
}

