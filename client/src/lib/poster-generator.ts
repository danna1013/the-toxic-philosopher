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
    console.log('开始等待图片加载:', images.length, '张');
    
    await Promise.all(
      Array.from(images).map((img, index) => {
        return new Promise((resolve) => {
          if (img.complete && img.naturalHeight !== 0) {
            console.log(`图片 ${index + 1} 已加载:`, img.src);
            resolve(null);
          } else {
            console.log(`等待图片 ${index + 1} 加载:`, img.src);
            img.onload = () => {
              console.log(`图片 ${index + 1} 加载完成:`, img.src);
              resolve(null);
            };
            img.onerror = () => {
              console.warn(`图片 ${index + 1} 加载失败:`, img.src);
              resolve(null); // 即使加载失败也继续
            };
            // 设置超时，避免无限等待
            setTimeout(() => {
              console.warn(`图片 ${index + 1} 加载超时:`, img.src);
              resolve(null);
            }, 3000);
          }
        });
      })
    );
    
    console.log('所有图片加载完成，等待渲染...');
    // 增加等待时间确保渲染完成
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    console.log('开始复制图片到剪贴板...');
    
    // 检查浏览器是否支持Clipboard API
    if (!navigator.clipboard) {
      console.warn('navigator.clipboard 不存在');
      return false;
    }
    
    if (!navigator.clipboard.write) {
      console.warn('navigator.clipboard.write 不存在');
      return false;
    }
    
    console.log('浏览器支持 Clipboard API');
    
    // 将Data URL转换为Blob
    console.log('开始将 Data URL 转换为 Blob...');
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    console.log('Blob 转换成功，大小:', blob.size, 'bytes, 类型:', blob.type);
    
    // 复制到剪贴板
    console.log('开始写入剪贴板...');
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    
    console.log('复制成功！');
    return true;
  } catch (error) {
    console.error('复制失败，错误详情:', error);
    if (error instanceof Error) {
      console.error('错误消息:', error.message);
      console.error('错误堆栈:', error.stack);
    }
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
