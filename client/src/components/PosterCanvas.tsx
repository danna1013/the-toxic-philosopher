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
  const topHeight = 320; // 顶部品牌区(120px) + 哲学家信息区(180px) + padding
  
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
  const messageGap = (messages.length - 1) * 28;
  
  const bottomHeight = 180; // 底部区域高度（两行文字，增加高度）
  
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
        // 添加海报边框
        border: '8px solid #1a1a1a',
        boxShadow: '0 0 0 2px #ffffff, 0 0 0 10px #f5f5f5, 0 20px 60px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* 顶部装饰线 */}
      <div
        style={{
          height: '5px',
          background: 'linear-gradient(90deg, #000000 0%, #2a2a2a 50%, #000000 100%)',
        }}
      />

      {/* 顶部品牌区 */}
      <div
        style={{
          padding: '32px 52px 24px',
          textAlign: 'center',
          borderBottom: '1.5px solid #eeeeee',
        }}
      >
        <h1
          style={{
            fontSize: '36px',
            fontWeight: '900',
            color: '#1a1a1a',
            margin: '0 0 8px 0',
            letterSpacing: '2px',
            lineHeight: '1',
          }}
        >
          毒舌哲学家
        </h1>
        <p
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#666666',
            margin: 0,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          THE TOXIC PHILOSOPHER
        </p>
      </div>

      {/* 主内容区域 */}
      <div
        style={{
          flex: '1',
          padding: '42px 52px',
          position: 'relative',
          // 使用可重复的几何图案背景
          background: `
            linear-gradient(135deg, #f5f5f5 25%, transparent 25%),
            linear-gradient(225deg, #f5f5f5 25%, transparent 25%),
            linear-gradient(45deg, #f5f5f5 25%, transparent 25%),
            linear-gradient(315deg, #f5f5f5 25%, #ffffff 25%)
          `,
          backgroundPosition: '20px 0, 20px 0, 0 0, 0 0',
          backgroundSize: '40px 40px',
          backgroundRepeat: 'repeat',
        }}
      >
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
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '20px',
            borderRadius: '16px',
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
                    ? 'linear-gradient(to bottom right, rgb(31, 41, 55) 0%, rgb(17, 24, 39) 100%)' 
                    : '#ffffff',
                  color: message.role === 'user' ? '#ffffff' : 'rgb(31, 41, 55)',
                  borderRadius: '24px',
                  boxShadow: message.role === 'user' 
                    ? '0 8px 16px rgba(0, 0, 0, 0.15)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.08)',
                  border: message.role === 'user' ? 'none' : '1px solid #f3f4f6',
                }}
              >
                {message.content.split('\n\n').map((paragraph, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: '20px',
                      fontWeight: i === 0 ? '500' : '400',
                      lineHeight: '1.8',
                      letterSpacing: '0px',
                      margin: i > 0 ? '20px 0 0 0' : '0',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
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

      {/* 底部区域 */}
      <div
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 50%, #000000 100%)',
          padding: '32px 52px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderTop: '3px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 -6px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          position: 'relative',
          minHeight: '160px',
          gap: '16px',
        }}
      >
        {/* 顶部光晕装饰 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            filter: 'blur(2px)',
          }}
        />

        {/* Agent大赛链接 - 单行显示 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '20px',
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: '0.5px',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Agent 大赛链接</span>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '18px',
              opacity: 0.95,
            }}
          >
            teko.woa.com/event/ai-agent/246
          </span>
        </div>

        {/* 引导文案 - 强制单行 */}
        <div
          style={{
            fontSize: '19px',
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: '1px',
            textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          你的评论是我最大的动力！
        </div>

        {/* 底部微妙装饰 */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '2px',
          }}
        />
      </div>
    </div>
  );
}
