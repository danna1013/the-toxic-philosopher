import { Router, Request, Response } from 'express';
import { query } from '../utils/db.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// 激活邀请码
router.post('/activate', async (req: Request, res: Response) => {
  try {
    const { code, fingerprint, ipAddress, userAgent } = req.body;

    if (!code || !fingerprint) {
      return res.status(400).json({ error: 'Code and fingerprint are required' });
    }

    // 检查邀请码是否存在且有效
    const codeResult = await query(
      'SELECT * FROM invitation_codes WHERE code = $1 AND is_active = true',
      [code]
    );

    if (codeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid or inactive invitation code' });
    }

    const invitationCode = codeResult.rows[0];

    // 检查是否已过期
    if (invitationCode.expires_at && new Date(invitationCode.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Invitation code has expired' });
    }

    // 检查使用次数
    if (invitationCode.max_uses !== -1 && invitationCode.current_uses >= invitationCode.max_uses) {
      return res.status(400).json({ error: 'Invitation code has reached maximum uses' });
    }

    // 检查该指纹是否已激活过此邀请码
    const activationResult = await query(
      'SELECT * FROM invitation_activations WHERE code = $1 AND fingerprint = $2',
      [code, fingerprint]
    );

    if (activationResult.rows.length > 0) {
      // 已激活，更新最后使用时间
      await query(
        'UPDATE invitation_activations SET last_used_at = CURRENT_TIMESTAMP WHERE code = $1 AND fingerprint = $2',
        [code, fingerprint]
      );

      return res.json({
        success: true,
        message: 'Invitation code already activated',
        features: invitationCode.features,
        type: invitationCode.type
      });
    }

    // 创建新的激活记录
    await query(
      'INSERT INTO invitation_activations (code, fingerprint, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
      [code, fingerprint, ipAddress, userAgent]
    );

    // 更新邀请码使用次数
    await query(
      'UPDATE invitation_codes SET current_uses = current_uses + 1 WHERE code = $1',
      [code]
    );

    res.json({
      success: true,
      message: 'Invitation code activated successfully',
      features: invitationCode.features,
      type: invitationCode.type
    });
  } catch (error) {
    console.error('Error activating invitation code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 验证用户权限
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { fingerprint } = req.body;

    if (!fingerprint) {
      return res.status(400).json({ error: 'Fingerprint is required' });
    }

    // 查找该指纹激活的邀请码
    const activationResult = await query(
      `SELECT ia.*, ic.type, ic.features, ic.is_active, ic.expires_at
       FROM invitation_activations ia
       JOIN invitation_codes ic ON ia.code = ic.code
       WHERE ia.fingerprint = $1 AND ic.is_active = true
       ORDER BY ia.activated_at DESC
       LIMIT 1`,
      [fingerprint]
    );

    if (activationResult.rows.length === 0) {
      // 免费用户
      return res.json({
        userType: 'free',
        features: {
          fullMode: false,
          maxDebatesPerDay: 3,
          audienceSpeakLimit: 1,
          customTopic: false
        }
      });
    }

    const activation = activationResult.rows[0];

    // 检查是否过期
    if (activation.expires_at && new Date(activation.expires_at) < new Date()) {
      return res.json({
        userType: 'free',
        features: {
          fullMode: false,
          maxDebatesPerDay: 3,
          audienceSpeakLimit: 1,
          customTopic: false
        }
      });
    }

    res.json({
      userType: activation.type,
      features: activation.features,
      activatedAt: activation.activated_at
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 生成邀请码（管理员功能）
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { type, maxUses, expiresInDays, createdBy } = req.body;

    if (!type || !['beta', 'vip', 'trial'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type' });
    }

    // 生成邀请码
    const code = `DEBATE-2024-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 设置特性
    let features: any = {};
    if (type === 'beta') {
      features = {
        fullMode: true,
        maxDebatesPerDay: 10,
        audienceSpeakLimit: 3,
        customTopic: true
      };
    } else if (type === 'vip') {
      features = {
        fullMode: true,
        maxDebatesPerDay: -1,
        audienceSpeakLimit: 5,
        customTopic: true
      };
    } else if (type === 'trial') {
      features = {
        fullMode: true,
        maxDebatesPerDay: 5,
        audienceSpeakLimit: 2,
        customTopic: true
      };
    }

    // 计算过期时间
    let expiresAt = null;
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    await query(
      'INSERT INTO invitation_codes (code, type, max_uses, features, expires_at, created_by) VALUES ($1, $2, $3, $4, $5, $6)',
      [code, type, maxUses || -1, JSON.stringify(features), expiresAt, createdBy || 'system']
    );

    res.json({
      success: true,
      code,
      type,
      features,
      maxUses: maxUses || -1,
      expiresAt
    });
  } catch (error) {
    console.error('Error generating invitation code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 检查今日使用次数
router.post('/check-usage', async (req: Request, res: Response) => {
  try {
    const { fingerprint } = req.body;

    if (!fingerprint) {
      return res.status(400).json({ error: 'Fingerprint is required' });
    }

    // 获取用户权限
    const verifyResult = await query(
      `SELECT ia.*, ic.type, ic.features
       FROM invitation_activations ia
       JOIN invitation_codes ic ON ia.code = ic.code
       WHERE ia.fingerprint = $1 AND ic.is_active = true
       ORDER BY ia.activated_at DESC
       LIMIT 1`,
      [fingerprint]
    );

    let maxDebatesPerDay = 3; // 默认免费用户
    if (verifyResult.rows.length > 0) {
      const features = verifyResult.rows[0].features;
      maxDebatesPerDay = features.maxDebatesPerDay || 3;
    }

    // 查询今日已使用次数
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usageResult = await query(
      'SELECT COUNT(*) as count FROM debates WHERE user_fingerprint = $1 AND created_at >= $2',
      [fingerprint, today]
    );

    const usedToday = parseInt(usageResult.rows[0].count);

    res.json({
      maxDebatesPerDay,
      usedToday,
      remaining: maxDebatesPerDay === -1 ? -1 : Math.max(0, maxDebatesPerDay - usedToday),
      canCreateDebate: maxDebatesPerDay === -1 || usedToday < maxDebatesPerDay
    });
  } catch (error) {
    console.error('Error checking usage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
