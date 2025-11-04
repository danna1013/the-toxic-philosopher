import React from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PosterCanvasProps {
  messages: Message[];
  philosopherId: string;
  philosopherName: string;
  philosopherTagline: string;
}

export const PosterCanvas: React.FC<PosterCanvasProps> = ({
  messages,
  philosopherId,
  philosopherName,
  philosopherTagline,
}) => {
  // 计算海报高度
  const topHeight = 160; // 顶部标题区域
  const philosopherInfoHeight = 150; // 哲学家信息区域
  const messageGap = 28; // 消息间距
  const bottomHeight = 180; // 底部区域

  // 估算消息内容高度
  const totalMessageHeight = messages.reduce((total, message) => {
    const charCount = message.content.length;
    const estimatedLines = Math.ceil(charCount / 23); // 每行约23个字符
    const lineHeight = 36; // 行高 (20px * 1.8)
    const padding = 48; // 上下padding (24px * 2)
    return total + (estimatedLines * lineHeight) + padding + messageGap;
  }, 0);

  const totalHeight = topHeight + philosopherInfoHeight + totalMessageHeight + messageGap + bottomHeight + 300;

  return (
    <div
      id="poster-canvas"
      style={{
        width: '750px',
        minHeight: `${totalHeight}px`,
        background: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'absolute',
        left: '-9999px',
        top: 0,
        border: '12px solid #000000',
        boxSizing: 'border-box',
      }}
    >
      {/* 背景图案 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(135deg, #f5f5f5 25%, transparent 25%),
            linear-gradient(225deg, #f5f5f5 25%, transparent 25%),
            linear-gradient(45deg, #f5f5f5 25%, transparent 25%),
            linear-gradient(315deg, #f5f5f5 25%, #ffffff 25%)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 0, 20px -20px, 0 20px',
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      {/* 顶部标题区域 */}
      <div
        style={{
          padding: '42px 52px 32px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          borderBottom: '3px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <h1
          style={{
            fontSize: '36px',
            fontWeight: '900',
            color: '#1a1a1a',
            margin: '0 0 12px 0',
            letterSpacing: '3px',
            lineHeight: '1',
          }}
        >
          毒舌哲学家
        </h1>
        <p
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#666666',
            margin: 0,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            lineHeight: '1',
          }}
        >
          THE TOXIC PHILOSOPHER
        </p>
      </div>

      {/* 内容区域 */}
      <div
        style={{
          flex: 1,
          padding: '40px 52px 16px 52px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* 哲学家信息 - 简化版，不要白色框 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '36px',
          }}
        >
          {/* 头像 */}
          <div
            style={{
              width: '86px',
              height: '86px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3.5px solid #1a1a1a',
              flexShrink: 0,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              background: '#ffffff',
            }}
          >
            <img
              src={`/poster-avatar-${philosopherId}.png`}
              alt={philosopherName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                // 如果图片加载失败，显示占位符
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>

          {/* 名字和标语 */}
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: 'rgb(17, 24, 39)',
                margin: '0 0 8px 0',
                letterSpacing: '1.2px',
                lineHeight: '1',
              }}
            >
              {philosopherName}
            </h2>
            <p
              style={{
                fontSize: '16px',
                fontWeight: '400',
                color: '#666666',
                margin: 0,
                letterSpacing: '0.5px',
                lineHeight: '1.3',
              }}
            >
              {philosopherTagline}
            </p>
          </div>
        </div>

        {/* 对话内容 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                width: '100%',
                paddingLeft: message.role === 'user' ? '80px' : '0',
                paddingRight: message.role === 'user' ? '0' : '80px',
              }}
            >
              <div
                style={{
                  padding: message.role === 'user' ? '12px 16px' : '20px 24px',
                  display: 'inline-block',
                  maxWidth: message.role === 'user' ? 'none' : '85%',
                  background: message.role === 'user' 
                    ? 'linear-gradient(to bottom right, rgb(31, 41, 55) 0%, rgb(17, 24, 39) 100%)' 
                    : '#ffffff',
                  color: message.role === 'user' ? '#ffffff' : 'rgb(31, 41, 55)',
                  borderRadius: message.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  boxShadow: message.role === 'user' 
                    ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: 'none',
                  outline: 'none',
                }}
              >
                {message.content.split('\n\n').map((paragraph, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: '18px',
                      fontWeight: i === 0 ? '500' : '400',
                      lineHeight: '1.7',
                      letterSpacing: '0px',
                      margin: i > 0 ? '16px 0 0 0' : '0',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      background: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                      padding: '0',
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部区域 - 移除所有装饰框框 */}
      <div
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 50%, #000000 100%)',
          padding: '16px 52px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Agent大赛链接 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap',
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
          }}
        >
          <span
            style={{
              fontSize: '19px',
              fontWeight: '700',
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            Agent 大赛链接
          </span>
          <span
            style={{
              fontSize: '17px',
              fontWeight: '700',
              color: '#ffffff',
              fontFamily: 'monospace',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            teko.woa.com/event/ai-agent/246
          </span>
        </div>

        {/* 评论文案 */}
        <div
          style={{
            fontSize: '19px',
            fontWeight: '700',
            color: '#ffffff',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            whiteSpace: 'nowrap',
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
          }}
        >
          你的评论是我最大的动力！
        </div>
      </div>
    </div>
  );
};
