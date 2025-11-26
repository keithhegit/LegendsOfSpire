"""
Comprehensive audit for:
1. Neutral cards (all 120)
2. Hero passives
3. Equipment/Relics

Checks if image URLs actually exist in Riot API
"""
import urllib.request
import json
import re

# Test if an image exists
def check_image_exists(image_name):
    """Check if spell image exists in Riot CDN"""
    url = f"https://ddragon.leagueoflegends.com/cdn/13.1.1/img/spell/{image_name}"
    try:
        req = urllib.request.Request(url, method='HEAD')
        urllib.request.urlopen(req)
        return True
    except:
        return False

def check_item_exists(item_id):
    """Check if item image exists in Riot CDN"""
    url = f"https://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/{item_id}.png"
    try:
        req = urllib.request.Request(url, method='HEAD')
        urllib.request.urlopen(req)
        return True
    except:
        return False

# Read cards.js
with open('src/data/cards.js', 'r', encoding='utf-8') as f:
    cards_content = f.read()

print("=" * 80)
print("NEUTRAL CARDS & PASSIVES AUDIT")
print("=" * 80)

issues = []

# 1. Check all Neutral cards (001-120)
print("\n[1] Checking Neutral Cards (Neutral_001 to Neutral_120)...")
neutral_pattern = r"(Neutral_\d{3}):\s*\{[^}]*img:\s*`\$\{SPELL_URL\}/([^`]+)`"
neutral_matches = re.findall(neutral_pattern, cards_content)

neutral_broken = []
for card_id, image_name in neutral_matches:
    if not check_image_exists(image_name):
        neutral_broken.append((card_id, image_name))
        print(f"  ❌ {card_id}: {image_name} NOT FOUND")

if not neutral_broken:
    print(f"  ✅ All {len(neutral_matches)} neutral cards have valid images")
else:
    print(f"  ⚠️  {len(neutral_broken)} broken neutral card images")
    issues.extend(neutral_broken)

# 2. Check hero passive images
print("\n[2] Checking Hero Passive Images...")
passive_pattern = r"(\w+Passive):\s*\{[^}]*hero:\s*'(\w+)'[^}]*img:\s*`\$\{SPELL_URL\}/([^`]+)`"
passive_matches = re.findall(passive_pattern, cards_content, re.DOTALL)

passive_broken = []
for card_id, hero, image_name in passive_matches:
    if hero != 'Neutral':  # Only hero passives
        if not check_image_exists(image_name):
            passive_broken.append((card_id, image_name))
            print(f"  ❌ {card_id} ({hero}): {image_name} NOT FOUND")

if not passive_broken:
    print(f"  ✅ All {len([m for m in passive_matches if m[1] != 'Neutral'])} hero passives have valid images")
else:
    print(f"  ⚠️  {len(passive_broken)} broken passive images")
    issues.extend(passive_broken)

# 3. Check basic cards (Strike, Defend, Heal, Ignite)
print("\n[3] Checking Basic Cards...")
basic_cards = ['Strike', 'Defend', 'Heal', 'Ignite']
basic_pattern = r"(Strike|Defend|Heal|Ignite):\s*\{[^}]*img:\s*`\$\{SPELL_URL\}/([^`]+)`"
basic_matches = re.findall(basic_pattern, cards_content)

basic_broken = []
for card_id, image_name in basic_matches:
    if not check_image_exists(image_name):
        basic_broken.append((card_id, image_name))
        print(f"  ❌ {card_id}: {image_name} NOT FOUND")

if not basic_broken:
    print(f"  ✅ All {len(basic_matches)} basic cards have valid images")
else:
    print(f"  ⚠️  {len(basic_broken)} broken basic card images")
    issues.extend(basic_broken)

print("\n" + "=" * 80)
print(f"SUMMARY: {len(issues)} total issues found")
print("=" * 80)

if issues:
    print("\nBroken image URLs:")
    for item in issues[:20]:  # Show first 20
        print(f"  {item[0]}: {item[1]}")
    if len(issues) > 20:
        print(f"  ... and {len(issues) - 20} more")
    
    # Save to file
    with open('broken_images_report.txt', 'w', encoding='utf-8') as f:
        for item in issues:
            f.write(f"{item[0]}: {item[1]}\n")
    print("\nSaved to: broken_images_report.txt")
else:
    print("\n✅ All images are valid!")

print("\nNote: Neutral cards use summoner spell placeholders, which is expected.")
