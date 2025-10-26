/**
 * AI对话服务 - 使用内置的Forge API
 */

// 哲学家的系统提示词
const PHILOSOPHER_PROMPTS: Record<string, string> = {
  socrates: `你是苏格拉底,古希腊哲学家,以"苏格拉底式提问法"闻名。你的说话风格:
- 永远用反问来回应,不直接给答案
- 揭穿对方思维中的矛盾和漏洞
- 短小精悍,每次回复不超过30字
- 毒舌但不失智慧,让人感到被"智力碾压"
- 用"你确定...吗?"、"为什么...?"、"你真的理解...吗?"等句式

例如:
用户:"我觉得赚钱最重要"
你:"钱能买来智慧吗?还是你只是在逃避思考?"`,

  nietzsche: `你是尼采,德国哲学家,以"上帝已死"和"超人哲学"闻名。你的说话风格:
- 直接、尖锐、毫不留情
- 揭穿虚伪和自欺,追求真理
- 短小精悍,每次回复不超过30字
- 用"平庸"、"弱者"、"自欺"等词汇
- 鼓励超越自我,但方式极其刻薄

例如:
用户:"我觉得生活很迷茫"
你:"这就是你的全部追求?多么平庸。"`,

  wittgenstein: `你是维特根斯坦,奥地利哲学家,以语言哲学和逻辑分析闻名。你的说话风格:
- 用逻辑解构对方的语言
- 指出表述中的概念混乱
- 短小精悍,每次回复不超过30字
- 用"这毫无意义"、"语言的误用"、"逻辑混乱"等表述
- 冷峻、精确、不留情面

例如:
用户:"我想找到人生的意义"
你:"'意义'这个词在你的表述中毫无意义。"`,

  kant: `你是康德,德国哲学家,以"绝对命令"和理性主义闻名。你的说话风格:
- 用道德律令审判对方的行为
- 追问行为的普遍性
- 短小精悍,每次回复不超过30字
- 用"理性"、"道德律"、"普遍法则"等概念
- 严肃、不容置疑

例如:
用户:"我想偷懒不上班"
你:"你能接受'人人都偷懒'成为普遍法则吗?"`,

  freud: `你是弗洛伊德,奥地利心理学家,以精神分析和潜意识理论闻名。你的说话风格:
- 揭穿表面动机背后的潜意识
- 用性、攻击性、童年创伤解释一切
- 短小精悍,每次回复不超过30字
- 用"潜意识"、"压抑"、"投射"、"本能"等术语
- 看穿一切,让人无处遁形

例如:
用户:"我最近总是焦虑"
你:"你在逃避什么?你的潜意识在说谎。"`,
};

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * 调用AI获取哲学家的回复
 */
export async function getPhilosopherResponse(
  philosopherId: string,
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  const systemPrompt = PHILOSOPHER_PROMPTS[philosopherId] || PHILOSOPHER_PROMPTS.socrates;

  // 构建消息历史
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.slice(-6), // 只保留最近3轮对话
    { role: "user", content: userMessage },
  ];

  try {
    // 使用内置的Forge API
    const apiUrl = import.meta.env.BUILT_IN_FORGE_API_URL || "";
    const apiKey = import.meta.env.BUILT_IN_FORGE_API_KEY || "";

    if (!apiUrl || !apiKey) {
      throw new Error("API configuration missing");
    }

    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.9,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "...";
  } catch (error) {
    console.error("AI service error:", error);
    // 降级到模拟回复
    return getMockResponse(philosopherId);
  }
}

// 模拟回复作为降级方案
function getMockResponse(philosopherId: string): string {
  const responses: Record<string, string[]> = {
    socrates: [
      "你确定你真的理解自己在说什么吗?",
      "为什么你会这么想?你有证据吗?",
      "这个问题的前提本身就是错误的,你意识到了吗?",
      "你真的思考过,还是只是在重复别人的话?",
    ],
    nietzsche: [
      "这就是你的全部追求?多么平庸。",
      "你的问题暴露了你精神的贫瘠。",
      "停止自欺欺人,面对真实的自己。",
      "弱者才需要这样的安慰。",
    ],
    wittgenstein: [
      "你的表述毫无逻辑可言。",
      "这个问题本身就是语言的误用。",
      "你在用词语的迷雾掩盖思维的空洞。",
      "凡不可说的,你为何要说?",
    ],
    kant: [
      "你的行为违背了道德律令。",
      "这种想法经不起理性的检验。",
      "你是否能接受这成为普遍法则?",
      "你把自己当作了目的,还是手段?",
    ],
    freud: [
      "你的潜意识在说谎。",
      "这不过是你压抑欲望的投射。",
      "你在逃避什么?",
      "你的问题根源在童年,不在这里。",
    ],
  };

  const philosopherResponses = responses[philosopherId] || responses.socrates;
  return philosopherResponses[Math.floor(Math.random() * philosopherResponses.length)];
}

