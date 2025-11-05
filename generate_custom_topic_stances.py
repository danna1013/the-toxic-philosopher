#!/usr/bin/env python3
import os
import sys
import json
from openai import OpenAI
import concurrent.futures

client = OpenAI()

def refine_topic(topic: str) -> str:
    """如果辩题太长,调用AI凝练成简短标题"""
    # 如果辩题长度小于等于15字,直接使用
    if len(topic) <= 15:
        return topic
    
    # 否则调用AI凝练
    refine_prompt = f"""
请将以下辩题凝练成一个简短的标题,要求:
1. 保留核心观点和争议点
2. 不超过15个字
3. 尽量使用疑问句形式
4. 直接返回标题,不要其他说明

原辩题: {topic}
"""
    
    response = client.chat.completions.create(
        model="gpt-4.1-nano",
        messages=[{"role": "user", "content": refine_prompt}],
        temperature=0.7
    )
    
    refined = response.choices[0].message.content.strip()
    # 去掉可能的引号
    refined = refined.strip('"').strip('"').strip('"')
    return refined

def generate_stances_for_custom_topic(topic: str):
    """为自定义辩题生成正反方立场和每个哲学家的观点"""
    
    # 第一步:凝练辩题标题
    refined_topic = refine_topic(topic)
    
    philosophers = [
        {"id": "socrates", "name": "苏格拉底", "philosophy": "认识你自己,未经审视的生活不值得过"},
        {"id": "nietzsche", "name": "尼采", "philosophy": "上帝已死,超人哲学,权力意志"},
        {"id": "wittgenstein", "name": "维特根斯坦", "philosophy": "语言的界限就是世界的界限,语言游戏"},
        {"id": "kant", "name": "康德", "philosophy": "绝对命令,人是目的而非工具,理性批判"},
        {"id": "freud", "name": "弗洛伊德", "philosophy": "本我、自我、超我,无意识,精神分析"}
    ]
    
    # 第二步:生成正反方立场(使用DeepSeek)
    stance_prompt = f"""
你是一个辩论专家。对于辩题"{refined_topic}",请生成明确对立的正反方立场。

要求:
1. 正方立场要支持辩题中的观点
2. 反方立场要反对辩题中的观点
3. 立场要简洁明确,不超过12个字
4. 正反方立场要有明显对立性

请以JSON格式返回:
{{
  "pro": "正方立场",
  "con": "反方立场"
}}
"""
    
    stance_response = client.chat.completions.create(
        model="gpt-4.1-nano",
        messages=[{"role": "user", "content": stance_prompt}],
        response_format={"type": "json_object"},
        temperature=0.7
    )
    
    stances = json.loads(stance_response.choices[0].message.content)
    
    # 第三步:并行为每个哲学家生成观点(使用DeepSeek)
    def generate_philosopher_view(p):
        view_prompt = f"""
你是{p['name']},核心哲学思想是:{p['philosophy']}

辩题:"{refined_topic}"
正方立场:{stances['pro']}
反方立场:{stances['con']}

请基于你的哲学思想,回答:
1. 你支持正方还是反方?(回答"pro"或"con")
2. 你的理由是什么?(用你的哲学思想解释,不超过20个字)

请以JSON格式返回:
{{
  "stance": "pro或con",
  "reason": "你的理由"
}}
"""
        
        view_response = client.chat.completions.create(
            model="gpt-4.1-nano",
            messages=[{"role": "user", "content": view_prompt}],
            response_format={"type": "json_object"},
            temperature=0.7
        )
        
        view_data = json.loads(view_response.choices[0].message.content)
        return {
            "id": p["id"],
            "name": p["name"],
            "stance": view_data["stance"],
            "reason": view_data["reason"]
        }
    
    # 使用线程池并行生成,大幅提升速度
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        philosopher_views = list(executor.map(generate_philosopher_view, philosophers))
    
    # 确保正反方至少各有一人
    pro_count = sum(1 for p in philosopher_views if p["stance"] == "pro")
    con_count = sum(1 for p in philosopher_views if p["stance"] == "con")
    
    if pro_count == 0:
        # 强制第一个哲学家支持正方
        philosopher_views[0]["stance"] = "pro"
    elif con_count == 0:
        # 强制最后一个哲学家支持反方
        philosopher_views[-1]["stance"] = "con"
    
    return {
        "topic": refined_topic,
        "original_topic": topic if topic != refined_topic else None,
        "pro_stance": stances["pro"],
        "con_stance": stances["con"],
        "philosophers": philosopher_views
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 generate_custom_topic_stances.py <topic>")
        sys.exit(1)
    
    topic = sys.argv[1]
    result = generate_stances_for_custom_topic(topic)
    print(json.dumps(result, ensure_ascii=False))
