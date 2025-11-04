import domtoimage from 'dom-to-image-more';

/**
 * 生成海报图片
 * @param elementId 海报DOM元素的ID
 * @returns 图片的Data URL
 */
export async function generatePoster(elementId: string = 'poster-canvas'): Promise<string> {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error('海报元素未找到');
  }
  
  try {
    // 等待所有图片加载完成
    const images = element.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => {
            console.warn('图片加载失败:', img.src);
            resolve(); // 即使加载失败也继续
          };
        });
      })
    );
    
    // 等待一小段时间确保渲染完成
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 获取元素的实际宽高（使用scrollHeight确保获取完整高度）
    const width = element.offsetWidth || 750;
    const height = element.scrollHeight || element.offsetHeight || 1334;
    
    console.log('海报尺寸:', width, 'x', height);
    console.log('图片加载完成:', images.length, '张');
    
    // 使用dom-to-image-more将DOM转换为PNG
    const dataUrl = await domtoimage.toPng(element, {
      width: width,
      height: height,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
        width: `${width}px`,
        height: `${height}px`
      },
      quality: 0.95,
      cacheBust: true,
      imagePlaceholder: '',
      // 允许跨域图片
      filter: (node: any) => {
        // 过滤掉一些不需要的元素
        return true;
      },
    });
    
    console.log('海报生成成功，Data URL长度:', dataUrl.length);
    return dataUrl;
  } catch (error) {
    console.error('生成海报失败:', error);
    throw error;
  }
}

/**
 * 下载图片
 * @param dataUrl 图片的Data URL
 * @param filename 文件名
 */
export function downloadImage(dataUrl: string, filename: string = '毒舌哲学家分享.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 复制图片到剪贴板（现代浏览器）
 * @param dataUrl 图片的Data URL
 * @returns 是否成功
 */
export async function copyImageToClipboard(dataUrl: string): Promise<boolean> {
  try {
    // 检查浏览器是否支持Clipboard API
    if (!navigator.clipboard || !navigator.clipboard.write) {
      console.warn('浏览器不支持复制图片到剪贴板');
      return false;
    }
    
    // 将Data URL转换为Blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    // 复制到剪贴板
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    
    return true;
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
}

/**
 * 根据消息数量和内容长度计算海报高度
 * @param messages 消息列表
 * @returns 海报高度（px）
 */
export function calculatePosterHeight(messages: Array<{ content: string }>): number {
  const HEADER_HEIGHT = 150; // 顶部高度
  const FOOTER_HEIGHT = 150; // 底部高度
  const PADDING = 80; // 上下内边距
  const MESSAGE_GAP = 24; // 消息间距
  
  // 估算每条消息的高度（基于字符数）
  let totalMessageHeight = 0;
  messages.forEach(msg => {
    const charCount = msg.content.length;
    const estimatedLines = Math.ceil(charCount / 25); // 假设每行25个字符
    const messageHeight = estimatedLines * 36 + 48; // 行高36px + 内边距48px
    totalMessageHeight += messageHeight;
  });
  
  const totalHeight = HEADER_HEIGHT + FOOTER_HEIGHT + PADDING + 
                      totalMessageHeight + (messages.length - 1) * MESSAGE_GAP;
  
  // 限制高度范围
  return Math.min(Math.max(totalHeight, 1000), 2500);
}
