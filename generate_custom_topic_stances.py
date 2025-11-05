#!/usr/bin/env python3
import os
import sys
import json
from openai import OpenAI

# 使用用户提供的DeepSeek配置
client = OpenAI(
    api_key="sk-60177c6b-64cd-491a-8f59-bcc4585a1cce",
    base_url="https://api.haihub.cn/v1/"
)

def generate_stances_for_custom_topic(topic: str):
    """为自定义辩题生成正反方立场和每个哲学家的观点(单次API调用)"""
    
    philosophers = [
        {"id": "socrates", "name": "苏格拉底", "philosophy": "认识你自己,未经审视的生活不值得过"},
        {"id": "nietzsche", "name": "尼采", "philosophy": "上帝已死,超人哲学,权力意志"},
        {"id": "wittgenstein", "name": "维特根斯坦", "philosophy": "语言的界限就是世界的界限,语言游戏"},
        {"id": "kant", "name": "康德", "philosophy": "绝对命令,人是目的而非工具,理性批判"},
        {"id": "freud", "name": "弗洛伊德", "philosophy": "本我、自我、超我,无意识,精神分析"}
    ]
    
    # 单次API调用生成所有内容
    prompt = f"""
你是一个辩论专家和哲学家顾问。对于用户输入的辩题"{topic}",请完成以下任务:

1. **辩题标题凝练**:
   - 如果辩题长度≤15字:直接使用原标题
   - 如果辩题长度>15字:凝练成简短标题(不超过15字,保留核心争议点,尽量用疑问句)

2. **正反方立场生成**:
   - 正方立场:支持辩题中的观点(不超过12字)
   - 反方立场:反对辩题中的观点(不超过12字)
   - 正反方立场要明确对立

3. **哲学家观点生成**:
   为以下5位哲学家生成观点:
   - 苏格拉底:认识你自己,未经审视的生活不值得过
   - 尼采:上帝已死,超人哲学,权力意志
   - 维特根斯坦:语言的界限就是世界的界限,语言游戏
   - 康德:绝对命令,人是目的而非工具,理性批判
   - 弗洛伊德:本我、自我、超我,无意识,精神分析
   
   每位哲学家需要:
   - 基于其哲学思想判断支持正方(pro)还是反方(con)
   - 用其哲学思想解释理由(不超过20字)
   - **确保正反方至少各有1人**

请以JSON格式返回:
{{
  "refined_topic": "凝练后的标题(如果不需要凝练则与原标题相同)",
  "original_topic": "原标题(如果凝练了才填写,否则为null)",
  "pro_stance": "正方立场",
  "con_stance": "反方立场",
  "philosophers": [
    {{
      "id": "socrates",
      "name": "苏格拉底",
      "stance": "pro或con",
      "reason": "理由"
    }},
    ...共5位哲学家
  ]
}}
"""
    
    response = client.chat.completions.create(
        model="DeepSeek-V3.1",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=1000
    )
    
    content = response.choices[0].message.content
    
    # 去除可能的代码块标记
    content = content.strip()
    if content.startswith('```json'):
        content = content[7:]
    if content.startswith('```'):
        content = content[3:]
    if content.endswith('```'):
        content = content[:-3]
    content = content.strip()
    
    result = json.loads(content)
    
    # 确保正反方至少各有一人
    pro_count = sum(1 for p in result["philosophers"] if p["stance"] == "pro")
    con_count = sum(1 for p in result["philosophers"] if p["stance"] == "con")
    
    if pro_count == 0:
        # 强制第一个哲学家支持正方
        result["philosophers"][0]["stance"] = "pro"
    elif con_count == 0:
        # 强制最后一个哲学家支持反方
        result["philosophers"][-1]["stance"] = "con"
    
    # 格式化返回结果
    return {
        "topic": result["refined_topic"],
        "original_topic": result.get("original_topic"),
        "pro_stance": result["pro_stance"],
        "con_stance": result["con_stance"],
        "philosophers": result["philosophers"]
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 generate_custom_topic_stances.py <topic>")
        sys.exit(1)
    
    topic = sys.argv[1]
    result = generate_stances_for_custom_topic(topic)
    print(json.dumps(result, ensure_ascii=False))
