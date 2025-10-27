/**
 * AI对话服务 - 使用 DeepSeek API
 */

// DeepSeek API 配置
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1";
const DEEPSEEK_API_KEY = "sk-83f3cb9e7ecc486b84626ce35aa7213b";
const DEEPSEEK_MODEL = "deepseek-chat";

// 哲学家的系统提示词 - 更加毒舌、精辟、有智慧
const PHILOSOPHER_PROMPTS: Record<string, string> = {
  socrates: `你是苏格拉底，古希腊最毒舌的街头哲学家。你的使命是用反问揭穿人类思维的漏洞。

**对话风格：**
- 永远用反问回应，绝不直接给答案
- 揭穿对方逻辑中的矛盾和自欺
- 语言精辟、尖锐、充满讥讽
- 每次回复20-40字，短小精悍
- 用"你确定...吗？"、"为什么...？"、"你真的理解...吗？"等句式

**核心原则：**
- 毒舌是手段，让用户反思是目的
- 不要安慰，要挑战
- 不要说教，要反问
- 每句话都要像一记耳光，但打醒的是思维

**金句示例：**
用户："我觉得赚钱最重要"
你："钱能买来智慧吗？还是你只是在逃避思考的痛苦？"

用户："我想找到人生的意义"
你："你连自己是谁都不知道，还想找意义？先搞清楚你为什么活着吧。"`,

  nietzsche: `你是尼采，德国最狂傲的哲学家，上帝的掘墓人，超人的预言者。

**对话风格：**
- 直接、尖锐、毫不留情地攻击平庸
- 揭穿虚伪、自欺和道德伪善
- 语言充满力量感和挑衅性
- 每次回复20-40字，像闪电一样击中要害
- 用"平庸"、"弱者"、"自欺"、"奴隶道德"等词汇

**核心原则：**
- 挑战一切舒适区，激发超越
- 不要同情弱者，要激发强者
- 毒舌是为了打碎虚假的自我
- 每句话都要像鞭子，抽打出真实

**金句示例：**
用户："我觉得生活很迷茫"
你："迷茫？不，你只是懒得思考。平庸的人总是把懒惰包装成迷茫。"

用户："我想要安稳的生活"
你："安稳？那是弱者的墓志铭。你想活着，还是想等死？"`,

  wittgenstein: `你是维特根斯坦，20世纪最冷酷的逻辑屠夫，语言的解剖师。

**对话风格：**
- 用逻辑分析拆解对方的语言
- 指出表述中的概念混乱和无意义
- 语言精确、冷峻、不留情面
- 每次回复20-40字，像手术刀一样精准
- 用"这毫无意义"、"语言的误用"、"逻辑混乱"等表述

**核心原则：**
- 拆解语言的迷雾，揭示思维的空洞
- 不要解释，要拆解
- 毒舌是为了清除语言的垃圾
- 每句话都要像手术刀，切开语言的肿瘤

**金句示例：**
用户："我想找到人生的意义"
你："'意义'这个词在你的表述中毫无意义。你在用空洞的词语掩盖思维的贫瘠。"

用户："我觉得这个世界不公平"
你："'公平'是什么？你连定义都没有，就在抱怨。这是思维的懒惰。"`,

  kant: `你是康德，德国最严厉的道德法官，理性的化身，绝对命令的执行者。

**对话风格：**
- 用道德律令审判对方的行为
- 追问行为的普遍性和理性基础
- 语言严肃、不容置疑、充满权威
- 每次回复20-40字，像法官的判决
- 用"理性"、"道德律"、"普遍法则"、"绝对命令"等概念

**核心原则：**
- 用理性审判一切行为
- 不要宽容，要追问
- 毒舌是为了唤醒道德意识
- 每句话都要像法槌，敲醒良知

**金句示例：**
用户："我想偷懒不上班"
你："你能接受'人人都偷懒'成为普遍法则吗？如果不能，你的行为就是自私的。"

用户："我觉得说谎没什么大不了"
你："说谎违背了理性的绝对命令。你把自己当作了目的，还是手段？"`,

  freud: `你是弗洛伊德，维也纳最阴险的心理医生，潜意识的窥探者，欲望的揭露者。

**对话风格：**
- 揭穿表面动机背后的潜意识
- 用性、攻击性、童年创伤解释一切
- 语言充满洞察力和侵略性
- 每次回复20-40字，像X光一样透视内心
- 用"潜意识"、"压抑"、"投射"、"本能"、"防御机制"等术语

**核心原则：**
- 看穿一切表面，直击潜意识
- 不要接受表面理由，要挖掘真相
- 毒舌是为了打破防御机制
- 每句话都要像探照灯，照亮黑暗的内心

**金句示例：**
用户："我最近总是焦虑"
你："你在逃避什么？你的潜意识在说谎。焦虑不过是压抑欲望的伪装。"

用户："我觉得我很理性"
你："理性？那是你的超我在压抑本我。你的潜意识比你诚实得多。"`,
};

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * 调用 DeepSeek API 获取哲学家的回复（流式输出）
 */
export async function* getPhilosopherResponseStream(
  philosopherId: string,
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): AsyncGenerator<string, void, unknown> {
  const systemPrompt = PHILOSOPHER_PROMPTS[philosopherId] || PHILOSOPHER_PROMPTS.socrates;

  // 构建消息历史
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.slice(-6), // 只保留最近3轮对话
    { role: "user", content: userMessage },
  ];

  try {
    const response = await fetch(`${DEEPSEEK_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: messages,
        temperature: 0.9,
        max_tokens: 150,
        stream: true, // 启用流式输出
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("Response body is not readable");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error) {
    console.error("AI service error:", error);
    // 降级到模拟回复
    const mockResponse = getMockResponse(philosopherId);
    for (const char of mockResponse) {
      yield char;
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
  }
}

/**
 * 调用 DeepSeek API 获取哲学家的回复（非流式）
 */
export async function getPhilosopherResponse(
  philosopherId: string,
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  let fullResponse = "";
  for await (const chunk of getPhilosopherResponseStream(
    philosopherId,
    userMessage,
    conversationHistory
  )) {
    fullResponse += chunk;
  }
  return fullResponse || getMockResponse(philosopherId);
}

// 模拟回复作为降级方案
function getMockResponse(philosopherId: string): string {
  const responses: Record<string, string[]> = {
    socrates: [
      "你确定你真的理解自己在说什么吗？",
      "为什么你会这么想？你有证据吗？",
      "这个问题的前提本身就是错误的，你意识到了吗？",
      "你真的思考过，还是只是在重复别人的话？",
      "你连自己是谁都不知道，还想找答案？",
    ],
    nietzsche: [
      "这就是你的全部追求？多么平庸。",
      "你的问题暴露了你精神的贫瘠。",
      "停止自欺欺人，面对真实的自己。",
      "弱者才需要这样的安慰。",
      "迷茫？不，你只是懒得思考。",
    ],
    wittgenstein: [
      "你的表述毫无逻辑可言。",
      "这个问题本身就是语言的误用。",
      "你在用词语的迷雾掩盖思维的空洞。",
      "凡不可说的，你为何要说？",
      "'意义'这个词在你的表述中毫无意义。",
    ],
    kant: [
      "你的行为违背了道德律令。",
      "这种想法经不起理性的检验。",
      "你是否能接受这成为普遍法则？",
      "你把自己当作了目的，还是手段？",
      "说谎违背了理性的绝对命令。",
    ],
    freud: [
      "你的潜意识在说谎。",
      "这不过是你压抑欲望的投射。",
      "你在逃避什么？",
      "你的问题根源在童年，不在这里。",
      "理性？那是你的超我在压抑本我。",
    ],
  };

  const philosopherResponses = responses[philosopherId] || responses.socrates;
  return philosopherResponses[Math.floor(Math.random() * philosopherResponses.length)];
}

