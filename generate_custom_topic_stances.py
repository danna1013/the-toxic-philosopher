#!/usr/bin/env python3
import os
import sys
import json
from openai import OpenAI
import time

# 使用用户提供的DeepSeek配置
client = OpenAI(
    api_key="sk-60177c6b-64cd-491a-8f59-bcc4585a1cce",
    base_url="https://api.haihub.cn/v1/",
    timeout=15.0  # 设置15秒超时
)

def generate_fallback(topic: str):
    """生成fallback结果(当AI调用失败时)"""
    # 简单凝练:取前15字
    refined = topic[:15] if len(topic) > 15 else topic
    
    return {
        "topic": refined,
        "original_topic": topic if len(topic) > 15 else None,
        "pro_stance": f"支持: {refined}",
        "con_stance": f"反对: {refined}",
        "philosophers": [
            {"id": "socrates", "name": "苏格拉底", "stance": "con", "reason": "基于其哲学思想倾向"},
            {"id": "nietzsche", "name": "尼采", "stance": "pro", "reason": "基于其哲学思想倾向"},
            {"id": "wittgenstein", "name": "维特根斯坦", "stance": "con", "reason": "基于其哲学思想倾向"},
            {"id": "kant", "name": "康德", "stance": "con", "reason": "基于其哲学思想倾向"},
            {"id": "freud", "name": "弗洛伊德", "stance": "pro", "reason": "基于其哲学思想倾向"}
        ]
    }

def generate_stances_for_custom_topic(topic: str, max_retries: int = 2):
    """为自定义辩题生成正反方立场和每个哲学家的观点(带重试和fallback)"""
    
    # 极简prompt
    prompt = f"""辩题:"{topic}"

生成JSON(严格遵守字数):
1. 标题:如原辩题>15字,凝练成≤15字;否则用原标题
2. 正反方立场:各≤10字,明确对立
3. 5位哲学家观点:各≤18字,支持正方(pro)或反方(con),确保正反方至少各1人

{{
  "refined_topic": "标题(≤15字)",
  "original_topic": "原标题(凝练了才填,否则null)",
  "pro_stance": "正方(≤10字)",
  "con_stance": "反方(≤10字)",
  "philosophers": [
    {{"id": "socrates", "name": "苏格拉底", "stance": "pro或con", "reason": "理由(≤18字)"}},
    {{"id": "nietzsche", "name": "尼采", "stance": "pro或con", "reason": "理由(≤18字)"}},
    {{"id": "wittgenstein", "name": "维特根斯坦", "stance": "pro或con", "reason": "理由(≤18字)"}},
    {{"id": "kant", "name": "康德", "stance": "pro或con", "reason": "理由(≤18字)"}},
    {{"id": "freud", "name": "弗洛伊德", "stance": "pro或con", "reason": "理由(≤18字)"}}
  ]
}}"""
    
    # 重试机制
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="DeepSeek-V3.1",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=500,
                top_p=0.9
            )
            
            content = response.choices[0].message.content.strip()
            
            # 去除代码块标记
            if content.startswith('```json'):
                content = content[7:]
            elif content.startswith('```'):
                content = content[3:]
            if content.endswith('```'):
                content = content[:-3]
            content = content.strip()
            
            result = json.loads(content)
            
            # 确保正反方至少各有一人
            pro_count = sum(1 for p in result["philosophers"] if p["stance"] == "pro")
            con_count = sum(1 for p in result["philosophers"] if p["stance"] == "con")
            
            if pro_count == 0:
                result["philosophers"][0]["stance"] = "pro"
            elif con_count == 0:
                result["philosophers"][-1]["stance"] = "con"
            
            return {
                "topic": result["refined_topic"],
                "original_topic": result.get("original_topic"),
                "pro_stance": result["pro_stance"],
                "con_stance": result["con_stance"],
                "philosophers": result["philosophers"]
            }
            
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {str(e)}", file=sys.stderr)
            if attempt < max_retries - 1:
                time.sleep(1)  # 等待1秒后重试
                continue
            else:
                # 所有重试都失败,使用fallback
                print("All retries failed, using fallback", file=sys.stderr)
                return generate_fallback(topic)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 generate_custom_topic_stances.py <topic>")
        sys.exit(1)
    
    topic = sys.argv[1]
    result = generate_stances_for_custom_topic(topic)
    print(json.dumps(result, ensure_ascii=False))
