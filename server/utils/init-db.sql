-- 创建辩论数据库表

-- 1. 邀请码表
CREATE TABLE IF NOT EXISTS invitation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('beta', 'vip', 'trial')),
  max_uses INTEGER NOT NULL DEFAULT -1,
  current_uses INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP,
  features JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_invitation_codes_code ON invitation_codes(code);
CREATE INDEX IF NOT EXISTS idx_invitation_codes_active ON invitation_codes(is_active);

-- 2. 邀请码激活记录表
CREATE TABLE IF NOT EXISTS invitation_activations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL,
  fingerprint VARCHAR(200) NOT NULL,
  ip_address VARCHAR(50),
  user_agent TEXT,
  activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activations_code ON invitation_activations(code);
CREATE INDEX IF NOT EXISTS idx_activations_fingerprint ON invitation_activations(fingerprint);

-- 3. 辩论记录表
CREATE TABLE IF NOT EXISTS debates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_fingerprint VARCHAR(200),
  mode VARCHAR(10) NOT NULL CHECK (mode IN ('basic', 'full')),
  topic VARCHAR(200) NOT NULL,
  topic_pro_side VARCHAR(50) NOT NULL,
  topic_con_side VARCHAR(50) NOT NULL,
  user_role VARCHAR(10) NOT NULL CHECK (user_role IN ('audience', 'debater')),
  user_side VARCHAR(3) CHECK (user_side IN ('pro', 'con')),
  status VARCHAR(20) NOT NULL DEFAULT 'preparing' CHECK (status IN ('preparing', 'ongoing', 'finished')),
  pro_side_philosophers TEXT[] NOT NULL,
  con_side_philosophers TEXT[] NOT NULL,
  final_pro_votes INTEGER,
  final_con_votes INTEGER,
  winner VARCHAR(3) CHECK (winner IN ('pro', 'con')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  finished_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_debates_fingerprint ON debates(user_fingerprint);
CREATE INDEX IF NOT EXISTS idx_debates_status ON debates(status);
CREATE INDEX IF NOT EXISTS idx_debates_created_at ON debates(created_at DESC);

-- 4. 发言记录表
CREATE TABLE IF NOT EXISTS debate_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID REFERENCES debates(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  speaker_id VARCHAR(50) NOT NULL,
  speaker_type VARCHAR(20) NOT NULL CHECK (speaker_type IN ('philosopher', 'user', 'audience', 'host')),
  speaker_name VARCHAR(100) NOT NULL,
  side VARCHAR(10) CHECK (side IN ('pro', 'con', 'neutral')),
  content TEXT NOT NULL,
  votes_changed INTEGER DEFAULT 0,
  audiences_persuaded TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_statements_debate_id ON debate_statements(debate_id);
CREATE INDEX IF NOT EXISTS idx_statements_round ON debate_statements(debate_id, round_number);

-- 5. 观众状态表
CREATE TABLE IF NOT EXISTS debate_audiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID REFERENCES debates(id) ON DELETE CASCADE,
  audience_id VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  occupation VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  initial_vote VARCHAR(3) CHECK (initial_vote IN ('pro', 'con')),
  current_vote VARCHAR(3) CHECK (current_vote IN ('pro', 'con')),
  persuasion_level INTEGER DEFAULT 50 CHECK (persuasion_level BETWEEN 0 AND 100),
  vote_changed_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audiences_debate_id ON debate_audiences(debate_id);

-- 6. 投票历史表
CREATE TABLE IF NOT EXISTS debate_vote_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID REFERENCES debates(id) ON DELETE CASCADE,
  statement_id UUID REFERENCES debate_statements(id) ON DELETE CASCADE,
  audience_id VARCHAR(50) NOT NULL,
  old_vote VARCHAR(3) CHECK (old_vote IN ('pro', 'con')),
  new_vote VARCHAR(3) CHECK (new_vote IN ('pro', 'con')),
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vote_history_debate_id ON debate_vote_history(debate_id);

-- 插入一些测试邀请码
INSERT INTO invitation_codes (code, type, max_uses, features) VALUES
  ('DEBATE-2024-TEST1', 'beta', 10, '{"fullMode": true, "maxDebatesPerDay": 10, "audienceSpeakLimit": 3, "customTopic": true}'),
  ('DEBATE-2024-VIP01', 'vip', -1, '{"fullMode": true, "maxDebatesPerDay": -1, "audienceSpeakLimit": 5, "customTopic": true}')
ON CONFLICT (code) DO NOTHING;
