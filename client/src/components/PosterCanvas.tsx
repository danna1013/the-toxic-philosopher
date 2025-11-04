import React from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PosterCanvasProps {
  philosopherId: string;
  philosopherName: string;
  philosopherTagline: string;
  messages: Message[];
}

export function PosterCanvas({ 
  philosopherId,
  philosopherName, 
  philosopherTagline,
  messages 
}: PosterCanvasProps) {
  // 计算内容高度 - 根据实际消息长度动态计算
  const topHeight = 260; // 顶部装饰线(5px) + 哲学家信息区(180px) + padding(56px) + 分隔线(1.5px) + 间距
  
  // 根据消息内容长度计算高度
  let totalMessageHeight = 0;
  messages.forEach(msg => {
    const charCount = msg.content.length;
    // 容器宽度：750px * 70% - padding(24*2) = 525 - 48 = 477px
    // 字号20px，中文字符宽度约20px，每行约23个字符
    const estimatedLines = Math.ceil(charCount / 23);
    // 行高 = 字号 * 行高系数 = 20 * 1.8 = 36px
    const contentHeight = estimatedLines * 36;
    // 加上内边距 24px * 2 = 48px
    const messageHeight = contentHeight + 48;
    totalMessageHeight += messageHeight;
  });
  
  // 消息间距
  const messageGap = (messages.length - 1) * 24;
  
  const bottomHeight = 180; // 底部区域：padding(42px*2) + 品牌名(29px) + 投票区域(60px)
  
  const totalHeight = topHeight + totalMessageHeight + messageGap + bottomHeight + 300; // 额外加300px缓冲确保底部不被截断

  return (
    <div 
      id="poster-canvas" 
      style={{
        position: 'absolute',
        left: '-9999px',
        width: '750px',
        height: `${totalHeight}px`,
        background: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", "Noto Sans CJK SC", sans-serif',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        padding: '0',
        margin: '0',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
      }}
    >
      {/* 顶部装饰线 */}
      <div
        style={{
          height: '5px',
          background: 'linear-gradient(90deg, #000000 0%, #2a2a2a 50%, #000000 100%)',
        }}
      />

      {/* 主内容区域 */}
      <div
        style={{
          flex: '1',
          padding: '56px 52px 42px',
          position: 'relative',
          backgroundImage: `/chat-bg-${philosopherId}.webp` ? `url(/chat-bg-${philosopherId}.webp)` : 'none',
          backgroundSize: '460px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 1,
        }}
      >
        {/* 背景水印 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `/chat-bg-${philosopherId}.webp` ? `url(/chat-bg-${philosopherId}.webp)` : 'none',
            backgroundSize: '460px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.09,
            pointerEvents: 'none',
          }}
        />

        {/* 哲学家信息区 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '38px',
            paddingBottom: '28px',
            borderBottom: '1.5px solid #eeeeee',
            position: 'relative',
            zIndex: 1,
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
            />
          </div>

          {/* 名字和标语 */}
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: '41px',
                fontWeight: '900',
                color: '#1a1a1a',
                margin: '0 0 8px 0',
                letterSpacing: '1.4px',
                lineHeight: '1',
              }}
            >
              {philosopherName}
            </h1>
            <p
              style={{
                fontSize: '17.5px',
                fontWeight: '400',
                color: '#666666',
                margin: 0,
                letterSpacing: '0.7px',
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
            gap: '28px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '24px',
                  background: message.role === 'user' 
                    ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' 
                    : '#ffffff',
                  color: message.role === 'user' ? '#ffffff' : '#1f2937',
                  borderRadius: '24px',
                  fontSize: '20px',
                  fontWeight: '400',
                  lineHeight: '1.8',
                  letterSpacing: '0px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  boxShadow: message.role === 'user' 
                    ? '0 8px 16px rgba(0, 0, 0, 0.15)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.08)',
                  border: message.role === 'user' ? 'none' : '1px solid #f3f4f6',
                }}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部区域 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2b2b2b 0%, #0d0d0d 45%, #000000 100%)',
          padding: '42px 52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '2px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 -4px 18px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          minHeight: '150px',
        }}
      >
        {/* 顶部装饰线 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '110px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)',
          }}
        />

        {/* 左侧：品牌名 */}
        <div>
          <h2
            style={{
              fontSize: '29px',
              fontWeight: '500',
              color: '#ffffff',
              margin: 0,
              letterSpacing: '1.4px',
              lineHeight: '1',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2)',
            }}
          >
            毒舌哲学家
          </h2>
        </div>

        {/* 右侧：投票信息（上下排列） */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#ffffff',
              letterSpacing: '0.8px',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            为我投票
          </div>
          <div
            style={{
              fontSize: '13.5px',
              fontWeight: '400',
              color: '#cccccc',
              letterSpacing: '0.5px',
              fontFamily: 'monospace',
            }}
          >
            teko.woa.com/event/ai-agent/246
          </div>
        </div>
      </div>
    </div>
  );
}
