/**
 * 时间解析工具
 * 将中文时间描述转换为Date对象
 * 
 * 注意：所有时间都按照中国时区（GMT+8）处理
 */

/**
 * 获取中国时区的当前时间
 * 返回一个Date对象，其本地时间表示中国时区的时间
 */
function getChinaTime(): Date {
  const now = new Date();
  // 获取UTC时间戳
  const utcTime = now.getTime();
  // 获取本地时区偏移（分钟）
  const localOffset = now.getTimezoneOffset();
  // 中国时区偏移：GMT+8 = -480分钟（注意：getTimezoneOffset返回的是UTC-本地的差值）
  const chinaOffset = -480;
  // 计算时区差异（分钟）
  const offsetDiff = localOffset - chinaOffset;
  // 返回调整后的时间
  return new Date(utcTime + offsetDiff * 60 * 1000);
}

/**
 * 获取中国时区的今天0点
 */
function getChinaToday(): Date {
  const now = getChinaTime();
  // 创建今天0点的Date对象（使用本地时区，但值是中国时间）
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  return today;
}

/**
 * 解析评论时间
 * @param timeStr 时间字符串，如"昨天 21:58"、"11月1日"、"2天前"等
 * @returns Date对象，如果无法解析则返回null
 */
export function parseCommentTime(timeStr: string): Date | null {
  if (!timeStr) return null;
  
  // 清理时间字符串：去除多余空格和特殊字符
  timeStr = timeStr.trim().replace(/\s+/g, ' ');
  
  const now = getChinaTime();
  const today = getChinaToday();
  
  console.log('[时间解析] 输入:', timeStr);
  console.log('[时间解析] 中国当前时间:', now.toLocaleString('zh-CN'));
  console.log('[时间解析] 中国今天0点:', today.toLocaleString('zh-CN'));
  
  try {
    // 处理"昨天 HH:MM"
    if (timeStr.includes('昨天')) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        yesterday.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]), 0, 0);
      }
      
      console.log('[时间解析] 昨天结果:', yesterday.toLocaleString('zh-CN'));
      return yesterday;
    }
    
    // 处理"今天 HH:MM" 或 "HH:MM"（默认今天）
    if (timeStr.includes('今天') || /^\d{1,2}:\d{2}$/.test(timeStr)) {
      const todayTime = new Date(today);
      
      const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        todayTime.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]), 0, 0);
      }
      
      console.log('[时间解析] 今天结果:', todayTime.toLocaleString('zh-CN'));
      return todayTime;
    }
    
    // 处理"前天 HH:MM"
    if (timeStr.includes('前天')) {
      const dayBeforeYesterday = new Date(today);
      dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
      
      const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        dayBeforeYesterday.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]), 0, 0);
      }
      
      console.log('[时间解析] 前天结果:', dayBeforeYesterday.toLocaleString('zh-CN'));
      return dayBeforeYesterday;
    }
    
    // 处理"N天前"
    const daysAgoMatch = timeStr.match(/(\d+)\s*天前/);
    if (daysAgoMatch) {
      const daysAgo = parseInt(daysAgoMatch[1]);
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      console.log(`[时间解析] ${daysAgo}天前结果:`, date.toLocaleString('zh-CN'));
      return date;
    }
    
    // 处理"N小时前"
    const hoursAgoMatch = timeStr.match(/(\d+)\s*小时前/);
    if (hoursAgoMatch) {
      const hoursAgo = parseInt(hoursAgoMatch[1]);
      const date = new Date(now);
      date.setHours(date.getHours() - hoursAgo);
      console.log(`[时间解析] ${hoursAgo}小时前结果:`, date.toLocaleString('zh-CN'));
      return date;
    }
    
    // 处理"N分钟前"
    const minutesAgoMatch = timeStr.match(/(\d+)\s*分钟前/);
    if (minutesAgoMatch) {
      const minutesAgo = parseInt(minutesAgoMatch[1]);
      const date = new Date(now);
      date.setMinutes(date.getMinutes() - minutesAgo);
      console.log(`[时间解析] ${minutesAgo}分钟前结果:`, date.toLocaleString('zh-CN'));
      return date;
    }
    
    // 处理"刚刚"
    if (timeStr.includes('刚刚')) {
      console.log('[时间解析] 刚刚结果:', now.toLocaleString('zh-CN'));
      return now;
    }
    
    // 处理"MM月DD日"
    const monthDayMatch = timeStr.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
    if (monthDayMatch) {
      const month = parseInt(monthDayMatch[1]) - 1; // 月份从0开始
      const day = parseInt(monthDayMatch[2]);
      const year = now.getFullYear();
      
      // 如果月份大于当前月份，说明是去年的
      const date = new Date(year, month, day);
      if (date > now) {
        date.setFullYear(year - 1);
      }
      
      console.log('[时间解析] MM月DD日结果:', date.toLocaleString('zh-CN'));
      return date;
    }
    
    // 处理"YYYY年MM月DD日"
    const fullDateMatch = timeStr.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
    if (fullDateMatch) {
      const year = parseInt(fullDateMatch[1]);
      const month = parseInt(fullDateMatch[2]) - 1;
      const day = parseInt(fullDateMatch[3]);
      const date = new Date(year, month, day);
      console.log('[时间解析] YYYY年MM月DD日结果:', date.toLocaleString('zh-CN'));
      return date;
    }
    
    // 处理"YYYY-MM-DD"
    const isoDateMatch = timeStr.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoDateMatch) {
      const year = parseInt(isoDateMatch[1]);
      const month = parseInt(isoDateMatch[2]) - 1;
      const day = parseInt(isoDateMatch[3]);
      const date = new Date(year, month, day);
      console.log('[时间解析] YYYY-MM-DD结果:', date.toLocaleString('zh-CN'));
      return date;
    }
    
    // 尝试直接解析
    const date = new Date(timeStr);
    if (!isNaN(date.getTime())) {
      console.log('[时间解析] 直接解析结果:', date.toLocaleString('zh-CN'));
      return date;
    }
    
    console.log('[时间解析] 无法解析');
    return null;
  } catch (error) {
    console.error('[时间解析] 解析失败:', timeStr, error);
    return null;
  }
}

/**
 * 检查评论时间是否在允许范围内
 * @param commentTime 评论时间
 * @param maxDays 最大允许天数
 * @returns 是否在允许范围内
 */
export function isCommentTimeValid(commentTime: Date | null, maxDays: number = 2): boolean {
  if (!commentTime) {
    console.log('[时间验证] 评论时间为空');
    return false;
  }
  
  const now = getChinaTime();
  const diffMs = now.getTime() - commentTime.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  console.log('[时间验证] 中国当前时间:', now.toLocaleString('zh-CN'));
  console.log('[时间验证] 评论时间:', commentTime.toLocaleString('zh-CN'));
  console.log('[时间验证] 时间差(毫秒):', diffMs);
  console.log('[时间验证] 时间差(天):', diffDays.toFixed(2));
  console.log('[时间验证] 最大允许天数:', maxDays);
  console.log('[时间验证] 是否有效:', diffDays >= 0 && diffDays <= maxDays);
  
  return diffDays >= 0 && diffDays <= maxDays;
}

/**
 * 格式化时间差
 * @param commentTime 评论时间
 * @returns 时间差描述，如"1天前"、"2小时前"等
 */
export function formatTimeDiff(commentTime: Date): string {
  const now = getChinaTime();
  const diffMs = now.getTime() - commentTime.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays > 0) {
    return `${diffDays}天前`;
  } else if (diffHours > 0) {
    return `${diffHours}小时前`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}分钟前`;
  } else {
    return '刚刚';
  }
}
