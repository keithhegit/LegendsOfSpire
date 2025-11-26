"""
Script to generate all missing Neutral cards (047-120) for cards.js
Uses pattern-based image mapping and balanced card stats
"""

# Card templates by type
CARD_TYPES = {
    'ATTACK': {
        'names': ['破甲斩', '雷霆一击', '疾风斩', '烈焰斩', '冰霜打击', '暗影突袭', '致命一击', '连环打击'],
        'description_templates': [
            '对单体造成{value}点伤害。',
            '对单体造成{value}伤并附加1层易伤。',
            '对单体造成{value}伤，若击杀目标则抽1牌。'
        ],
        'cost_range': (1, 2),
        'value_range': (6, 12),
        'effects': [None, 'VULNERABLE', 'DRAW_ON_KILL'],
        'images': ['SummonerIgnite', 'SummonerSmite', 'SummonerDot']
    },
    'SKILL': {
        'names': ['护盾术', '回旋镖', '法力回复', '战术撤退', '能量脉冲', '强化', '净化', '治疗波'],
        'description_templates': [
            '获得{value}护甲。',
            '抽{effectValue}张牌。',
            '回复{effectValue}法力。',
            '获得{value}护甲并抽1牌。'
        ],
        'cost_range': (0, 2),
        'value_range': (6, 15),
        'effects': ['BLOCK', 'DRAW', 'GAIN_MANA', 'BLOCK_DRAW'],
        'images': ['SummonerBarrier', 'SummonerGhost', 'SummonerClarity', 'SummonerHeal']
    },
    'POWER': {
        'names': ['力量祝福', '战意昂扬', '持久态势', '血性激发', '战争号角', '坚韧不拔'],
        'description_templates': [
            '本回合力量+{effectValue}。',
            '获得{effectValue}点力量，持续{value}回合。',
            '每回合开始获得{effectValue}护甲（本战斗）。'
        ],
        'cost_range': (1, 3),
        'value_range': (0, 3),
        'effects': ['TEMP_STR', 'STR_BUFF', 'PASSIVE_BLOCK'],
        'images': ['SummonerHaste', 'SummonerSnowball', 'SummonerBarrier']
    }
}

# Generate neutral cards
output_lines = []
for i in range(47, 121):
    card_id = f'Neutral_{i:03d}'
    
    # Determine card type based on number
    if i % 3 == 0:
        card_type = 'ATTACK'
    elif i % 3 == 1:
        card_type = 'SKILL'
    else:
        card_type = 'POWER'
    
    template = CARD_TYPES[card_type]
    
    # Cycle through names and effects
    name_idx = i % len(template['names'])
    effect_idx = i % len(template['effects'])
    desc_idx = i % len(template['description_templates'])
    img_idx = i % len(template['images'])
    
    name = f"{template['names'][name_idx]}{i % 10}"
    cost = template['cost_range'][0] + (i % (template['cost_range'][1] - template['cost_range'][0] + 1))
    value = template['value_range'][0] + ((i * 2) % (template['value_range'][1] - template['value_range'][0] + 1))
    rarity = ['COMMON', 'UNCOMMON', 'RARE'][i % 3]
    effect = template['effects'][effect_idx]
    effectValue = 2 + (i % 4)
    image = f"{template['images'][img_idx]}.png"
    
    # Generate description
    desc_template = template['description_templates'][desc_idx]
    description = desc_template.format(value=value, effectValue=effectValue)
    
    # Build card definition
    card_def = f"""  {card_id}: {{
    id: '{card_id}',
    name: '{name}',
    type: '{card_type}',
    target: '{'single' if card_type == 'ATTACK' else 'self'}',
    cost: {cost},
    value: {value},
    rarity: '{rarity}',
    hero: 'Neutral',
    effect: {f"'{effect}'" if effect else 'null'},
    effectValue: {effectValue},
    description: '{description}',
    img: `${{SPELL_URL}}/{image}`,
    price: {50 + (i - 47) * 3}
  }},"""
    
    output_lines.append(card_def)

# Write to file
with open('src/data/neutral_cards_047_120.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output_lines))

print(f"✅ Generated {len(output_lines)} neutral card definitions")
print("📄 Output saved to: src/data/neutral_cards_047_120.txt")
print("\nNext step: Copy these definitions into cards.js after Neutral_046")
