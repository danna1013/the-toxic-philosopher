export default function MobileGuide() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
        毒舌哲学家
      </h1>
      <p style={{ fontSize: '12px', color: '#999', marginBottom: '48px', letterSpacing: '0.2em' }}>
        THE TOXIC PHILOSOPHER
      </p>
      
      <div style={{
        width: '96px',
        height: '96px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #9333ea, #3b82f6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '32px'
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      </div>
      
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', lineHeight: '1.4' }}>
        请在电脑上<br />体验完整版
      </h2>
      
      <p style={{ color: '#999', fontSize: '14px', lineHeight: '1.6', marginBottom: '32px' }}>
        为了获得最佳的视觉效果和交互体验，<br />
        我们建议您使用电脑浏览器访问。
      </p>
      
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <span style={{ color: '#fcd34d', marginRight: '12px' }}>●</span>
          <span style={{ fontSize: '14px' }}>沉浸式星空选择界面</span>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <span style={{ color: '#fb923c', marginRight: '12px' }}>●</span>
          <span style={{ fontSize: '14px' }}>5位哲学家的深度对话</span>
        </div>
        <div>
          <span style={{ color: '#a78bfa', marginRight: '12px' }}>●</span>
          <span style={{ fontSize: '14px' }}>精心设计的视觉动画</span>
        </div>
      </div>
      
      <div style={{
        background: 'linear-gradient(135deg, rgba(147,51,234,0.2), rgba(59,130,246,0.2))',
        border: '1px solid rgba(147,51,234,0.3)',
        borderRadius: '12px',
        padding: '16px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>PC端访问地址</p>
        <p style={{ fontSize: '14px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
          {typeof window !== 'undefined' ? window.location.origin : ''}
        </p>
      </div>
      
      <p style={{ fontSize: '12px', color: '#666', marginTop: '32px' }}>
        移动端版本正在开发中，敬请期待
      </p>
    </div>
  );
}

