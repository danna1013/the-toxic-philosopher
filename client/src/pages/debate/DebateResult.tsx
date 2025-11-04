import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, MessageCircle, Home, RotateCcw } from 'lucide-react';
import { getDebateStatus, type Debate } from '@/lib/debate/api';
import { Loader2 } from 'lucide-react';

export default function DebateResult() {
  const [, params] = useRoute('/debate/result/:id');
  const [, setLocation] = useLocation();
  const [debate, setDebate] = useState<Debate | null>(null);
  const [loading, setLoading] = useState(true);

  const debateId = params?.id;

  useEffect(() => {
    if (debateId) {
      loadDebateResult();
    }
  }, [debateId]);

  async function loadDebateResult() {
    if (!debateId) return;

    const result = await getDebateStatus(debateId);
    if (result.success && result.debate) {
      setDebate(result.debate);
    }
    setLoading(false);
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
  const proPercentage = totalVotes > 0 ? ((proVotes / totalVotes) * 100).toFixed(1) : '50.0';
  const conPercentage = totalVotes > 0 ? ((conVotes / totalVotes) * 100).toFixed(1) : '50.0';

  const isProWinner = proVotes > conVotes;
  const winnerSide = isProWinner ? 'pro' : 'con';
  const winnerVotes = isProWinner ? proVotes : conVotes;
  const winnerPercentage = isProWinner ? proPercentage : conPercentage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 胜利标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {isProWinner ? '正方' : '反方'}获胜！
          </h1>
          <p className="text-xl text-purple-200">
            {isProWinner ? debate.topicProSide : debate.topicConSide}
          </p>
        </div>

        {/* 投票结果 */}
        <Card className="mb-6 bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              最终投票
            </h2>
            
            <div className="space-y-4">
              {/* 正方 */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">正方：{debate.topicProSide}</span>
                  <span className="text-blue-300 font-bold">{proVotes}票 ({proPercentage}%)</span>
                </div>
                <div className="h-8 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-end pr-3 transition-all duration-500 ${
                      isProWinner ? 'animate-pulse' : ''
                    }`}
                    style={{ width: `${proPercentage}%` }}
                  >
                    {isProWinner && <Trophy className="w-5 h-5 text-white" />}
                  </div>
                </div>
              </div>

              {/* 反方 */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">反方：{debate.topicConSide}</span>
                  <span className="text-red-300 font-bold">{conVotes}票 ({conPercentage}%)</span>
                </div>
                <div className="h-8 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-end pr-3 transition-all duration-500 ${
                      !isProWinner ? 'animate-pulse' : ''
                    }`}
                    style={{ width: `${conPercentage}%` }}
                  >
                    {!isProWinner && <Trophy className="w-5 h-5 text-white" />}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-center text-purple-200">
                共有 <span className="text-white font-bold">{totalVotes}</span> 位观众参与投票
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 精彩回顾 */}
        <Card className="mb-6 bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              精彩回顾
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-purple-200">辩论模式</span>
                <span className="text-white font-semibold">
                  {debate.mode === 'basic' ? '基础模式' : '完整模式'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-purple-200">辩论轮次</span>
                <span className="text-white font-semibold">
                  {debate.mode === 'basic' ? '3' : '4'}轮
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-purple-200">发言总数</span>
                <span className="text-white font-semibold">
                  {debate.statements?.length || 0}条
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-purple-200">你的身份</span>
                <span className="text-white font-semibold">
                  {debate.userRole === 'audience' ? '观众' : '辩手'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <div className="flex gap-4">
          <Button
            onClick={() => setLocation('/debate')}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            再来一场
          </Button>
          <Button
            onClick={() => setLocation('/')}
            variant="outline"
            className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Home className="w-4 h-4 mr-2" />
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}
