import { getFingerprint } from './fingerprint';

export interface Debate {
  id: string;
  mode: 'basic' | 'full';
  topic: string;
  topicProSide: string;
  topicConSide: string;
  userRole: 'audience' | 'debater';
  userSide?: 'pro' | 'con';
  proSidePhilosophers: string[];
  conSidePhilosophers: string[];
  status: 'preparing' | 'ongoing' | 'finished';
  votes?: { pro: number; con: number };
  statements?: Statement[];
  createdAt: string;
}

export interface Statement {
  id: string;
  debateId: string;
  roundNumber: number;
  speakerId: string;
  speakerType: 'philosopher' | 'user' | 'audience' | 'host';
  speakerName: string;
  side?: 'pro' | 'con' | 'neutral';
  content: string;
  votesChanged?: number;
  audiencesPersuaded?: string[];
  createdAt: string;
}

export interface Audience {
  id: string;
  name: string;
  occupation: string;
  avatarUrl?: string;
  initialVote: 'pro' | 'con';
  currentVote: 'pro' | 'con';
  persuasionLevel: number;
}

// 创建辩论
export async function createDebate(params: {
  mode: 'basic' | 'full';
  topic: string;
  topicProSide: string;
  topicConSide: string;
  userRole: 'audience' | 'debater';
  userSide?: 'pro' | 'con';
  proSidePhilosophers: string[];
  conSidePhilosophers: string[];
}): Promise<{ success: boolean; debate?: Debate; error?: string }> {
  try {
    const fingerprint = getFingerprint();
    const response = await fetch('/api/debate/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        userFingerprint: fingerprint
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, debate: data.debate };
  } catch (error) {
    console.error('Error creating debate:', error);
    return { success: false, error: 'Network error' };
  }
}

// 开始辩论
export async function startDebate(
  debateId: string,
  audiences: Audience[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/debate/${debateId}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audiences })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error starting debate:', error);
    return { success: false, error: 'Network error' };
  }
}

// 添加发言
export async function addStatement(
  debateId: string,
  statement: {
    roundNumber: number;
    speakerId: string;
    speakerType: 'philosopher' | 'user' | 'audience' | 'host';
    speakerName: string;
    side?: 'pro' | 'con' | 'neutral';
    content: string;
    votesChanged?: number;
    audiencesPersuaded?: string[];
  }
): Promise<{ success: boolean; statement?: Statement; error?: string }> {
  try {
    const response = await fetch(`/api/debate/${debateId}/statement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statement)
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, statement: data.statement };
  } catch (error) {
    console.error('Error adding statement:', error);
    return { success: false, error: 'Network error' };
  }
}

// 更新观众投票
export async function updateAudienceVote(
  debateId: string,
  audienceId: string,
  newVote: 'pro' | 'con',
  reason: string,
  statementId?: string
): Promise<{ success: boolean; voteChanged?: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/debate/${debateId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audienceId,
        newVote,
        reason,
        statementId
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, voteChanged: data.voteChanged };
  } catch (error) {
    console.error('Error updating vote:', error);
    return { success: false, error: 'Network error' };
  }
}

// 获取辩论状态
export async function getDebateStatus(
  debateId: string
): Promise<{ success: boolean; debate?: Debate; error?: string }> {
  try {
    const response = await fetch(`/api/debate/${debateId}/status`);
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, debate: data.debate };
  } catch (error) {
    console.error('Error getting debate status:', error);
    return { success: false, error: 'Network error' };
  }
}

// 结束辩论
export async function finishDebate(
  debateId: string
): Promise<{
  success: boolean;
  result?: { proVotes: number; conVotes: number; winner: 'pro' | 'con' };
  error?: string;
}> {
  try {
    const response = await fetch(`/api/debate/${debateId}/finish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, result: data.result };
  } catch (error) {
    console.error('Error finishing debate:', error);
    return { success: false, error: 'Network error' };
  }
}

// 获取辩论历史
export async function getDebateHistory(
  limit: number = 10,
  offset: number = 0
): Promise<{ success: boolean; debates?: Debate[]; error?: string }> {
  try {
    const fingerprint = getFingerprint();
    const response = await fetch(
      `/api/debate/history/${fingerprint}?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, debates: data.debates };
  } catch (error) {
    console.error('Error getting debate history:', error);
    return { success: false, error: 'Network error' };
  }
}
