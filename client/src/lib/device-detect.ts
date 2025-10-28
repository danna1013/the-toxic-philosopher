/**
 * 检测是否为移动设备
 */
export function isMobileDevice(): boolean {
  // 优先使用屏幕宽度判断，简单可靠
  return window.innerWidth < 768;
}

/**
 * 检测是否为平板设备
 */
export function isTabletDevice(): boolean {
  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();
  
  // 平板通常在768px-1024px之间
  const isTabletWidth = width >= 768 && width <= 1024;
  
  // 检测iPad或Android平板
  const isTabletUA = userAgent.includes('ipad') || 
    (userAgent.includes('android') && !userAgent.includes('mobile'));
  
  return isTabletWidth || isTabletUA;
}

/**
 * 获取设备类型
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (isMobileDevice() && !isTabletDevice()) {
    return 'mobile';
  }
  if (isTabletDevice()) {
    return 'tablet';
  }
  return 'desktop';
}

