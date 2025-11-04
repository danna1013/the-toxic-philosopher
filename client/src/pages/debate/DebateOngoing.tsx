import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Users, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getDebateStatus, addStatement, updateAudienceVote, finishDebate, type Debate, type Statement, type Audience } from '@/lib/debate/api';

export default function DebateOngoing() {
  const [, params] = useRoute('/debate/ongoing/:id');
  const [, setLocation] = useLocation();
  const [debate, setDebate] = useState<Debate | null>(null);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  const debateId = params?.id;
  const maxRounds = debate?.mode === 'basic' ? 3 : 4;

  useEffect(() => {
    if (debateId) {
      loadDebateStatus();
      // 开始辩论流程
      startDebateFlow();
    }
  }, [debateId]);

  async function loadDebateStatus() {
    if (!debateId) return;

    const result = await getDebateStatus(debateId);
    if (result.success && result.debate) {
      setDebate(result.debate);
      setStatements(result.debate.statements || []);
    } else {
      toast.error('加载辩论失败');
    }
    setLoading(false);
  }

  async function startDebateFlow() {
    if (!debateId) return;

    // 主持人开场白
    await addHostOpening();

    // 进行3-4轮辩论
    for (let round = 1; round <= maxRounds; round++) {
      setCurrentRound(round);
      await conductRound(round);
    }

    // 结束辩论
    await endDebate();
  }

  async function addHostOpening() {
    if (!debateId || !debate) return;

    setSpeaking(true);
    const openingContent = `欢迎来到哲学辩论场！今天的辩题是：${debate.topic}。正方认为${debate.topicProSide}，反方认为${debate.topicConSide}。让我们有请双方辩手！`;

    await addStatement(debateId, {
      roundNumber: 0,
      speakerId: 'host',
      speakerType: 'host',
      speakerName: '主持人',
      side: 'neutral',
      content: openingContent
    });

    await loadDebateStatus();
    setSpeaking(false);
    await sleep(2000);
  }

  async function conductRound(round: number) {
    if (!debateId || !debate) return;

    // 正方发言
    for (const philosopherId of debate.proSidePhilosophers) {
      await philosopherSpeak(philosopherId, 'pro', round);
      await sleep(3000);
    }

    // 反方发言
    for (const philosopherId of debate.conSidePhilosophers) {
      await philosopherSpeak(philosopherId, 'con', round);
      await sleep(3000);
    }
  }

  async function philosopherSpeak(philosopherId: string, side: 'pro' | 'con', round: number) {
    if (!debateId) return;

    setSpeaking(true);

    // 这里应该调用AI服务生成发言，为了演示简化处理
    const content = `这是${philosopherId}在第${round}轮的发言...`;

    await addStatement(debateId, {
      roundNumber: round,
      speakerId: philosopherId,
      speakerType: 'philosopher',
      speakerName: getPhilosopherName(philosopherId),
      side,
      content
    });

    await loadDebateStatus();
    setSpeaking(false);
  }

  async function endDebate() {
    if (!debateId) return;

    const result = await finishDebate(debateId);
    if (result.success) {
      setLocation(`/debate/result/${debateId}`);
    } else {
      toast.error('结束辩论失败');
    }
  }

  function getPhilosopherName(id: string): string {
    const names: Record<string, string> = {
      socrates: '苏格拉底',
      nietzsche: '尼采',
      kant: '康德',
      freud: '弗洛伊德',
      wittgenstein: '维特根斯坦'
    };
    return names[id] || id;
  }

  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <p className="text-white">辩论不存在</p>
      </div>
    );
  }

  const proVotes = debate.votes?.pro || 0;
  const conVotes = debate.votes?.con || 0;
  const totalVotes = proVotes + conVotes;
  const proPercentage = totalVotes > 0 ? (proVotes / totalVotes) * 100 : 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 顶部：辩题和进度 */}
        <Card className="mb-4 bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="pt-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-white mb-2">{debate.topic}</h2>
              <div className="flex items-center justify-center gap-4 text-purple-200">
                <span>第 {currentRound}/{maxRounds} 轮</span>
                <span>·</span>
                <span>{statements.length} 条发言</span>
              </div>
            </div>
            
            {/* 投票进度条 */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-300">正方 {proVotes}票</span>
                <span className="text-red-300">反方 {conVotes}票</span>
              </div>
              <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${proPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          {/* 左侧：发言区 */}
          <div className="md:col-span-2 space-y-4">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-semibold text-white">辩论进行中</h3>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {statements.map((statement, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        statement.side === 'pro'
                          ? 'bg-blue-500/20 border-l-4 border-blue-500'
                          : statement.side === 'con'
                          ? 'bg-red-500/20 border-l-4 border-red-500'
                          : 'bg-gray-500/20 border-l-4 border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-purple-600 text-white text-xs">
                            {statement.speakerName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {statement.speakerName}
                          </p>
                          <p className="text-purple-200 text-xs">
                            第{statement.roundNumber}轮
                          </p>
                        </div>
                      </div>
                      <p className="text-white text-sm leading-relaxed">
                        {statement.content}
                      </p>
                      {statement.votesChanged && statement.votesChanged > 0 && (
                        <p className="text-yellow-300 text-xs mt-2">
                          💡 说服了 {statement.votesChanged} 位观众
                        </p>
                      )}
                    </div>
                  ))}

                  {speaking && (
                    <div className="flex items-center gap-2 text-purple-200">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>正在发言...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：观众区 */}
          <div className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-semibold text-white">观众席</h3>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {audiences.slice(0, 10).map((audience) => (
                    <div
                      key={audience.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-purple-600 text-white text-xs">
                            {audience.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white text-sm">{audience.name}</p>
                          <p className="text-purple-200 text-xs">{audience.occupation}</p>
                        </div>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          audience.currentVote === 'pro' ? 'bg-blue-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                  ))}
                  {audiences.length > 10 && (
                    <p className="text-center text-purple-200 text-sm">
                      还有 {audiences.length - 10} 位观众...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
