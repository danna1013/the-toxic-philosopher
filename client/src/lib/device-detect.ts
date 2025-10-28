/**
 * 检测是否为移动设备
 */
export function isMobileDevice(): boolean {
  // 检测屏幕宽度
  const isMobileWidth = window.innerWidth < 768;
  
  // 检测User Agent
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android',
    'webos',
    'iphone',
    'ipad',
    'ipod',
    'blackberry',
    'windows phone',
    'mobile'
  ];
  
  const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
  
  // 检测触摸支持
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // 综合判断：屏幕宽度小于768px 或 (是移动UA 且 支持触摸)
  return isMobileWidth || (isMobileUA && isTouchDevice);
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

