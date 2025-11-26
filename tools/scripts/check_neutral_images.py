"""
Generate detailed report of all neutral cards with image loading status
"""
import urllib.request
import json
import re

def check_image_exists(image_name):
    """Check if image exists in Riot CDN"""
    url = f"https://ddragon.leagueoflegends.com/cdn/13.1.1/img/spell/{image_name}"
    try:
        req = urllib.request.Request(url, method='HEAD')
        response = urllib.request.urlopen(req)
        return True, url
    except Exception as e:
        return False, url

# Read cards.js
with open('src/data/cards.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all neutral cards
neutral_pattern = r"(Neutral_\d{3}):\s*\{\s*id:\s*'(Neutral_\d{3})',\s*name:\s*'([^']+)',.*?description:\s*'([^']+)',\s*img:\s*`\$\{SPELL_URL\}/([^`]+)`"

matches = re.findall(neutral_pattern, content, re.DOTALL)

print("=" * 100)
print("中立卡牌图片检查报告")
print("=" * 100)

broken_cards = []
working_cards = []

for card_id, _, name, description, image_name in matches:
    exists, url = check_image_exists(image_name)
    
    card_info = {
        'id': card_id,
        'name': name,
        'description': description,
        'image': image_name,
        'url': url,
        'status': '✅' if exists else '❌'
    }
    
    if exists:
        working_cards.append(card_info)
    else:
        broken_cards.append(card_info)

# Generate report
print(f"\n图片正常: {len(working_cards)}")
print(f"图片缺失: {len(broken_cards)}")
print("\n" + "=" * 100)

if broken_cards:
    print("\n❌ 缺失图片的中立卡牌列表:")
    print("=" * 100)
    
    for card in broken_cards:
        print(f"\n卡牌ID: {card['id']}")
        print(f"名称: {card['name']}")
        print(f"描述: {card['description']}")
        print(f"当前图片: {card['image']}")
        print(f"CDN URL: {card['url']}")
        print("-" * 100)

# Save to JSON for easy reference
report = {
    'total': len(matches),
    'working': len(working_cards),
    'broken': len(broken_cards),
    'broken_cards': broken_cards,
    'working_cards': working_cards
}

with open('neutral_cards_image_report.json', 'w', encoding='utf-8') as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

print(f"\n详细报告已保存到: neutral_cards_image_report.json")

# Generate CSV for easy viewing
with open('neutral_cards_missing_images.csv', 'w', encoding='utf-8') as f:
    f.write('卡牌ID,名称,描述,当前图片,状态\n')
    for card in broken_cards:
        f.write(f"{card['id']},{card['name']},{card['description']},{card['image']},缺失\n")

print(f"缺失列表已保存到: neutral_cards_missing_images.csv")
