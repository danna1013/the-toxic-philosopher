import { Router, Request, Response } from 'express';
import { query } from '../utils/db.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// 创建辩论
router.post('/create', async (req: Request, res: Response) => {
  try {
    const {
      userFingerprint,
      mode,
      topic,
      topicProSide,
      topicConSide,
      userRole,
      userSide,
      proSidePhilosophers,
      conSidePhilosophers
    } = req.body;

    // 验证必填字段
    if (!userFingerprint || !mode || !topic || !topicProSide || !topicConSide || !userRole) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 验证模式
    if (!['basic', 'full'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    // 验证用户角色
    if (!['audience', 'debater'].includes(userRole)) {
      return res.status(400).json({ error: 'Invalid user role' });
    }

    // 如果用户是辩手，必须指定阵营
    if (userRole === 'debater' && !userSide) {
      return res.status(400).json({ error: 'User side is required for debater role' });
    }

    // 创建辩论记录
    const debateResult = await query(
      `INSERT INTO debates (
        user_fingerprint, mode, topic, topic_pro_side, topic_con_side,
        user_role, user_side, pro_side_philosophers, con_side_philosophers, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        userFingerprint,
        mode,
        topic,
        topicProSide,
        topicConSide,
        userRole,
        userSide,
        proSidePhilosophers,
        conSidePhilosophers,
        'preparing'
      ]
    );

    const debate = debateResult.rows[0];

    res.json({
      success: true,
      debate: {
        id: debate.id,
        mode: debate.mode,
        topic: debate.topic,
        topicProSide: debate.topic_pro_side,
        topicConSide: debate.topic_con_side,
        userRole: debate.user_role,
        userSide: debate.user_side,
        proSidePhilosophers: debate.pro_side_philosophers,
        conSidePhilosophers: debate.con_side_philosophers,
        status: debate.status,
        createdAt: debate.created_at
      }
    });
  } catch (error) {
    console.error('Error creating debate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 开始辩论（初始化观众）
router.post('/:debateId/start', async (req: Request, res: Response) => {
  try {
    const { debateId } = req.params;
    const { audiences } = req.body;

    if (!audiences || !Array.isArray(audiences)) {
      return res.status(400).json({ error: 'Audiences array is required' });
    }

    // 更新辩论状态
    await query(
      'UPDATE debates SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['ongoing', debateId]
    );

    // 插入观众数据
    for (const audience of audiences) {
      await query(
        `INSERT INTO debate_audiences (
          debate_id, audience_id, name, occupation, avatar_url,
          initial_vote, current_vote, persuasion_level
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          debateId,
          audience.id,
          audience.name,
          audience.occupation,
          audience.avatarUrl,
          audience.initialVote,
          audience.initialVote,
          audience.persuasionLevel || 50
        ]
      );
    }

    res.json({
      success: true,
      message: 'Debate started successfully'
    });
  } catch (error) {
    console.error('Error starting debate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 添加发言
router.post('/:debateId/statement', async (req: Request, res: Response) => {
  try {
    const { debateId } = req.params;
    const {
      roundNumber,
      speakerId,
      speakerType,
      speakerName,
      side,
      content,
      votesChanged,
      audiencesPersuaded
    } = req.body;

    if (!roundNumber || !speakerId || !speakerType || !speakerName || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const statementResult = await query(
      `INSERT INTO debate_statements (
        debate_id, round_number, speaker_id, speaker_type, speaker_name,
        side, content, votes_changed, audiences_persuaded
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        debateId,
        roundNumber,
        speakerId,
        speakerType,
        speakerName,
        side,
        content,
        votesChanged || 0,
        audiencesPersuaded || []
      ]
    );

    res.json({
      success: true,
      statement: statementResult.rows[0]
    });
  } catch (error) {
    console.error('Error adding statement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 更新观众投票
router.post('/:debateId/vote', async (req: Request, res: Response) => {
  try {
    const { debateId } = req.params;
    const { audienceId, newVote, reason, statementId } = req.body;

    if (!audienceId || !newVote) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 获取当前投票
    const audienceResult = await query(
      'SELECT * FROM debate_audiences WHERE debate_id = $1 AND audience_id = $2',
      [debateId, audienceId]
    );

    if (audienceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Audience not found' });
    }

    const audience = audienceResult.rows[0];
    const oldVote = audience.current_vote;

    // 如果投票改变了
    if (oldVote !== newVote) {
      // 更新观众投票
      await query(
        `UPDATE debate_audiences 
         SET current_vote = $1, vote_changed_count = vote_changed_count + 1
         WHERE debate_id = $2 AND audience_id = $3`,
        [newVote, debateId, audienceId]
      );

      // 记录投票历史
      await query(
        `INSERT INTO debate_vote_history (
          debate_id, statement_id, audience_id, old_vote, new_vote, reason
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [debateId, statementId, audienceId, oldVote, newVote, reason]
      );
    }

    res.json({
      success: true,
      voteChanged: oldVote !== newVote
    });
  } catch (error) {
    console.error('Error updating vote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取辩论当前状态
router.get('/:debateId/status', async (req: Request, res: Response) => {
  try {
    const { debateId } = req.params;

    // 获取辩论信息
    const debateResult = await query(
      'SELECT * FROM debates WHERE id = $1',
      [debateId]
    );

    if (debateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Debate not found' });
    }

    const debate = debateResult.rows[0];

    // 获取观众投票统计
    const voteResult = await query(
      `SELECT current_vote, COUNT(*) as count
       FROM debate_audiences
       WHERE debate_id = $1
       GROUP BY current_vote`,
      [debateId]
    );

    const votes = {
      pro: 0,
      con: 0
    };

    voteResult.rows.forEach((row: any) => {
      if (row.current_vote === 'pro') votes.pro = parseInt(row.count);
      if (row.current_vote === 'con') votes.con = parseInt(row.count);
    });

    // 获取发言记录
    const statementsResult = await query(
      'SELECT * FROM debate_statements WHERE debate_id = $1 ORDER BY round_number, created_at',
      [debateId]
    );

    res.json({
      success: true,
      debate: {
        id: debate.id,
        mode: debate.mode,
        topic: debate.topic,
        topicProSide: debate.topic_pro_side,
        topicConSide: debate.topic_con_side,
        userRole: debate.user_role,
        userSide: debate.user_side,
        proSidePhilosophers: debate.pro_side_philosophers,
        conSidePhilosophers: debate.con_side_philosophers,
        status: debate.status,
        votes,
        statements: statementsResult.rows
      }
    });
  } catch (error) {
    console.error('Error getting debate status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 结束辩论
router.post('/:debateId/finish', async (req: Request, res: Response) => {
  try {
    const { debateId } = req.params;

    // 获取最终投票结果
    const voteResult = await query(
      `SELECT current_vote, COUNT(*) as count
       FROM debate_audiences
       WHERE debate_id = $1
       GROUP BY current_vote`,
      [debateId]
    );

    let proVotes = 0;
    let conVotes = 0;

    voteResult.rows.forEach((row: any) => {
      if (row.current_vote === 'pro') proVotes = parseInt(row.count);
      if (row.current_vote === 'con') conVotes = parseInt(row.count);
    });

    const winner = proVotes > conVotes ? 'pro' : 'con';

    // 更新辩论状态
    await query(
      `UPDATE debates 
       SET status = $1, final_pro_votes = $2, final_con_votes = $3, 
           winner = $4, finished_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5`,
      ['finished', proVotes, conVotes, winner, debateId]
    );

    res.json({
      success: true,
      result: {
        proVotes,
        conVotes,
        winner
      }
    });
  } catch (error) {
    console.error('Error finishing debate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 获取用户的辩论历史
router.get('/history/:fingerprint', async (req: Request, res: Response) => {
  try {
    const { fingerprint } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const result = await query(
      `SELECT * FROM debates 
       WHERE user_fingerprint = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [fingerprint, limit, offset]
    );

    res.json({
      success: true,
      debates: result.rows
    });
  } catch (error) {
    console.error('Error getting debate history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
