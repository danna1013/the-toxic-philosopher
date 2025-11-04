import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getUserPermission, activateInvitationCode, checkUsageToday, type UserPermission } from '@/lib/debate/permission';
import { Loader2, Sparkles, Users, Trophy, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function DebateEntry() {
  const [, setLocation] = useLocation();
  const [permission, setPermission] = useState<UserPermission | null>(null);
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    loadPermission();
  }, []);

  async function loadPermission() {
    setLoading(true);
    const perm = await getUserPermission();
    const use = await checkUsageToday();
    setPermission(perm);
    setUsage(use);
    setLoading(false);
  }

  async function handleActivateCode() {
    if (!inviteCode.trim()) {
      toast.error('请输入邀请码');
      return;
    }

    setActivating(true);
    const result = await activateInvitationCode(inviteCode.trim());
    setActivating(false);

    if (result.success) {
      toast.success('邀请码激活成功！');
      setShowInviteDialog(false);
      setInviteCode('');
      await loadPermission();
    } else {
      toast.error(result.error || '激活失败');
    }
  }

  function handleStartBasicMode() {
    if (!usage?.canCreateDebate) {
      toast.error(`今日辩论次数已用完（${usage?.maxDebatesPerDay}次）`);
      return;
    }
    setLocation('/debate/basic');
  }

  function handleStartFullMode() {
    if (!permission?.features.fullMode) {
      toast.error('需要邀请码才能使用完整模式');
      setShowInviteDialog(true);
      return;
    }

    if (!usage?.canCreateDebate) {
      toast.error(`今日辩论次数已用完（${usage?.maxDebatesPerDay}次）`);
      return;
    }

    setLocation('/debate/full/topic');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            哲学辩论场
          </h1>
          <p className="text-xl text-purple-200">
            让5位伟大的哲学家为你辩论，50位AI观众实时投票
          </p>
        </div>

        {/* 用户状态 */}
        <Card className="mb-8 bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {permission?.userType === 'free' && '免费用户'}
                    {permission?.userType === 'beta' && '内测用户'}
                    {permission?.userType === 'vip' && 'VIP用户'}
                    {permission?.userType === 'trial' && '试用用户'}
                  </p>
                  <p className="text-purple-200 text-sm">
                    今日剩余：{usage?.remaining === -1 ? '无限' : usage?.remaining}次
                  </p>
                </div>
              </div>
              {permission?.userType === 'free' && (
                <Button
                  onClick={() => setShowInviteDialog(true)}
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  激活邀请码
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 模式选择 */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* 基础模式 */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl text-white">基础模式</CardTitle>
                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm">
                  免费
                </div>
              </div>
              <CardDescription className="text-purple-200">
                5分钟快速体验，固定话题和辩手
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-purple-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>5位哲学家 + 50位AI观众</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>预设话题：AI会取代人类吗？</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>观众身份，可发言1次</span>
                </div>
              </div>
              <Button
                onClick={handleStartBasicMode}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                disabled={!usage?.canCreateDebate}
              >
                开始辩论
              </Button>
            </CardContent>
          </Card>

          {/* 完整模式 */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all cursor-pointer relative">
            {!permission?.features.fullMode && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <div className="text-center">
                  <Lock className="w-12 h-12 text-white mx-auto mb-2" />
                  <p className="text-white font-semibold">需要邀请码</p>
                </div>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl text-white">完整模式</CardTitle>
                <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm">
                  内测
                </div>
              </div>
              <CardDescription className="text-purple-200">
                10分钟深度体验，完全自定义
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-purple-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>自定义话题和辩手</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>选择观众或辩手身份</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>观众可发言{permission?.features.audienceSpeakLimit || 3}次</span>
                </div>
              </div>
              <Button
                onClick={handleStartFullMode}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                disabled={!permission?.features.fullMode || !usage?.canCreateDebate}
              >
                {permission?.features.fullMode ? '开始辩论' : '需要邀请码'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 说明 */}
        <div className="mt-8 text-center text-purple-200 text-sm">
          <p>每场辩论约5-10分钟 · 57个AI同时运行 · 观众投票实时变化</p>
        </div>
      </div>

      {/* 邀请码对话框 */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="bg-gray-900 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>激活邀请码</DialogTitle>
            <DialogDescription className="text-gray-400">
              输入邀请码以解锁完整模式和更多功能
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="invite-code" className="text-white">邀请码</Label>
              <Input
                id="invite-code"
                placeholder="DEBATE-2024-XXXX"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white mt-2"
              />
            </div>
            <Button
              onClick={handleActivateCode}
              disabled={activating}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
            >
              {activating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  激活中...
                </>
              ) : (
                '激活'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
