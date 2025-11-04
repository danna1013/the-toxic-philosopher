import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 哲学家人格档案
export const PHILOSOPHERS = {
  socrates: {
    id: 'socrates',
    name: '苏格拉底',
    traits: {
      rationality: 95,
      emotionality: 30,
      stubbornness: 70,
      openness: 85,
      aggression: 40
    },
    thinkingStyle: 'questioning',
    languageStyle: {
      typicalPhrases: ['那么，让我们来思考...', '你确定吗？', '这真的是真理吗？'],
      sentenceLength: 'medium',
      metaphorFrequency: 'medium'
    },
    resistanceToPersuasion: {
      logical: 30,
      emotional: 80,
      authority: 90,
      practical: 50
    }
  },
  nietzsche: {
    id: 'nietzsche',
    name: '尼采',
    traits: {
      rationality: 80,
      emotionality: 85,
      stubbornness: 90,
      openness: 70,
      aggression: 85
    },
    thinkingStyle: 'provocative',
    languageStyle: {
      typicalPhrases: ['上帝已死！', '那些杀不死我的，必使我更强大', '重估一切价值'],
      sentenceLength: 'long',
      metaphorFrequency: 'high'
    },
    resistanceToPersuasion: {
      logical: 50,
      emotional: 40,
      authority: 95,
      practical: 60
    }
  },
  kant: {
    id: 'kant',
    name: '康德',
    traits: {
      rationality: 98,
      emotionality: 20,
      stubbornness: 85,
      openness: 60,
      aggression: 30
    },
    thinkingStyle: 'systematic',
    languageStyle: {
      typicalPhrases: ['根据纯粹理性...', '绝对命令要求...', '道德律在我心中'],
      sentenceLength: 'long',
      metaphorFrequency: 'low'
    },
    resistanceToPersuasion: {
      logical: 25,
      emotional: 95,
      authority: 70,
      practical: 80
    }
  },
  freud: {
    id: 'freud',
    name: '弗洛伊德',
    traits: {
      rationality: 75,
      emotionality: 60,
      stubbornness: 80,
      openness: 75,
      aggression: 50
    },
    thinkingStyle: 'analytical',
    languageStyle: {
      typicalPhrases: ['从潜意识的角度来看...', '这是一种防御机制', '本我、自我、超我'],
      sentenceLength: 'medium',
      metaphorFrequency: 'medium'
    },
    resistanceToPersuasion: {
      logical: 40,
      emotional: 45,
      authority: 60,
      practical: 50
    }
  },
  wittgenstein: {
    id: 'wittgenstein',
    name: '维特根斯坦',
    traits: {
      rationality: 95,
      emotionality: 40,
      stubbornness: 85,
      openness: 65,
      aggression: 55
    },
    thinkingStyle: 'linguistic',
    languageStyle: {
      typicalPhrases: ['语言的界限就是世界的界限', '凡是能够说的...', '语言游戏'],
      sentenceLength: 'short',
      metaphorFrequency: 'low'
    },
    resistanceToPersuasion: {
      logical: 35,
      emotional: 85,
      authority: 75,
      practical: 70
    }
  }
};

// 观众类型
export const AUDIENCE_TYPES = {
  rational: {
    name: '理性型',
    traits: { rationality: 90, emotionality: 30, independence: 85 },
    persuasionSensitivity: { logical: 90, emotional: 20, practical: 70, ideal: 40 }
  },
  emotional: {
    name: '情感型',
    traits: { rationality: 40, emotionality: 90, independence: 60 },
    persuasionSensitivity: { logical: 30, emotional: 95, practical: 40, ideal: 80 }
  },
  practical: {
    name: '实用型',
    traits: { rationality: 70, emotionality: 50, independence: 75 },
    persuasionSensitivity: { logical: 60, emotional: 40, practical: 95, ideal: 30 }
  },
  idealist: {
    name: '理想型',
    traits: { rationality: 60, emotionality: 70, independence: 70 },
    persuasionSensitivity: { logical: 50, emotional: 70, practical: 30, ideal: 90 }
  },
  skeptical: {
    name: '怀疑型',
    traits: { rationality: 85, emotionality: 40, independence: 90 },
    persuasionSensitivity: { logical: 70, emotional: 20, practical: 60, ideal: 40 }
  },
  conformist: {
    name: '从众型',
    traits: { rationality: 50, emotionality: 60, independence: 30 },
    persuasionSensitivity: { logical: 40, emotional: 60, practical: 50, ideal: 50 }
  }
};

// 生成哲学家发言
export async function generatePhilosopherStatement(
  philosopherId: string,
  topic: string,
  side: 'pro' | 'con',
  context: {
    previousStatements: any[];
    currentVotes: { pro: number; con: number };
    roundNumber: number;
  }
): Promise<string> {
  const philosopher = PHILOSOPHERS[philosopherId as keyof typeof PHILOSOPHERS];
  
  if (!philosopher) {
    throw new Error(`Unknown philosopher: ${philosopherId}`);
  }

  const prompt = `你是${philosopher.name}，正在参加一场辩论。

辩题：${topic}
你的立场：${side === 'pro' ? '正方' : '反方'}
当前轮次：第${context.roundNumber}轮

你的性格特质：
- 理性度：${philosopher.traits.rationality}/100
- 情绪化：${philosopher.traits.emotionality}/100
- 固执度：${philosopher.traits.stubbornness}/100
- 开放性：${philosopher.traits.openness}/100
- 攻击性：${philosopher.traits.aggression}/100

你的思维方式：${philosopher.thinkingStyle}
你的典型用语：${philosopher.languageStyle.typicalPhrases.join('、')}

${context.previousStatements.length > 0 ? `
之前的发言：
${context.previousStatements.map((s, i) => `${i + 1}. ${s.speaker_name}（${s.side === 'pro' ? '正方' : '反方'}）：${s.content}`).join('\n')}
` : ''}

当前投票情况：正方 ${context.currentVotes.pro} 票，反方 ${context.currentVotes.con} 票

请以${philosopher.name}的身份和风格发言，论证你的观点。要求：
1. 体现${philosopher.name}的哲学思想和论证方式
2. 使用${philosopher.name}的典型用语
3. 回应对方的论点（如果有）
4. 控制在150字以内
5. 充满激情和说服力

你的发言：`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 300
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating philosopher statement:', error);
    throw error;
  }
}

// 生成主持人开场白
export async function generateHostOpening(
  topic: string,
  proSide: string,
  conSide: string,
  philosophers: { pro: string[]; con: string[] }
): Promise<string> {
  const prompt = `你是一场哲学辩论的主持人。

辩题：${topic}
正方观点：${proSide}
反方观点：${conSide}

正方辩手：${philosophers.pro.map(id => PHILOSOPHERS[id as keyof typeof PHILOSOPHERS].name).join('、')}
反方辩手：${philosophers.con.map(id => PHILOSOPHERS[id as keyof typeof PHILOSOPHERS].name).join('、')}

请以热情、专业的方式介绍这场辩论，包括：
1. 欢迎观众
2. 介绍辩题
3. 介绍双方辩手
4. 宣布辩论开始

控制在200字以内，要有感染力。

开场白：`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 400
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating host opening:', error);
    throw error;
  }
}

// 计算观众投票变化
export async function calculateAudienceVotes(
  audiences: any[],
  statement: {
    philosopherId: string;
    side: 'pro' | 'con';
    content: string;
  }
): Promise<{ audienceId: string; newVote: 'pro' | 'con'; reason: string }[]> {
  const changes: { audienceId: string; newVote: 'pro' | 'con'; reason: string }[] = [];

  // 随机选择25%的观众进行投票计算
  const selectedAudiences = audiences
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.ceil(audiences.length * 0.25));

  for (const audience of selectedAudiences) {
    // 如果观众已经支持该阵营，跳过
    if (audience.current_vote === statement.side) {
      continue;
    }

    const prompt = `观众信息：
姓名：${audience.name}
职业：${audience.occupation}
当前投票：${audience.current_vote === 'pro' ? '正方' : '反方'}
说服程度：${audience.persuasion_level}/100

刚才${PHILOSOPHERS[statement.philosopherId as keyof typeof PHILOSOPHERS].name}（${statement.side === 'pro' ? '正方' : '反方'}）发言：
"${statement.content}"

请判断这位观众是否会改变投票。如果会改变，输出 "YES|原因"；如果不会改变，输出 "NO"。
原因要简短（20字以内）。

判断：`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 100
      });

      const result = response.choices[0].message.content || 'NO';
      
      if (result.startsWith('YES')) {
        const reason = result.split('|')[1] || '被说服了';
        changes.push({
          audienceId: audience.audience_id,
          newVote: statement.side,
          reason
        });
      }
    } catch (error) {
      console.error('Error calculating audience vote:', error);
    }
  }

  return changes;
}

// 生成观众发言
export async function generateAudienceStatement(
  audience: any,
  topic: string,
  context: {
    previousStatements: any[];
    currentVotes: { pro: number; con: number };
  }
): Promise<string> {
  const prompt = `你是观众${audience.name}（${audience.occupation}），正在观看一场辩论。

辩题：${topic}
你当前支持：${audience.current_vote === 'pro' ? '正方' : '反方'}

${context.previousStatements.length > 0 ? `
最近的发言：
${context.previousStatements.slice(-3).map((s: any) => `${s.speaker_name}：${s.content}`).join('\n')}
` : ''}

请以观众身份发表你的看法或提问，控制在80字以内。

你的发言：`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating audience statement:', error);
    throw error;
  }
}

export default {
  generatePhilosopherStatement,
  generateHostOpening,
  calculateAudienceVotes,
  generateAudienceStatement,
  PHILOSOPHERS,
  AUDIENCE_TYPES
};
