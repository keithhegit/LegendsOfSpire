"""
Comprehensive Riot API Spell Name Audit
Fetches official spell names from Riot Data Dragon and compares with cards.js
"""
import urllib.request
import json
import re

# Champions to check (using Riot API IDs)
CHAMPIONS = {
    'Garen': 'Garen',
    'Darius': 'Darius',
    'Lux': 'Lux',
    'Jinx': 'Jinx',
    'Yasuo': 'Yasuo',
    'Sona': 'Sona',
    'Ekko': 'Ekko',
    'Sylas': 'Sylas',
    'Urgot': 'Urgot',
    'Viktor': 'Viktor',
    'Riven': 'Riven',
    'TwistedFate': 'CardMaster',  # API uses TwistedFate, we use CardMaster
    'LeeSin': 'LeeSin',
    'Vayne': 'Vayne',
    'Teemo': 'Teemo',
    'Zed': 'Zed',
    'Nasus': 'Nasus',
    'Irelia': 'Irelia',
    'Thresh': 'Thresh',
    'Katarina': 'Katarina'
}

API_BASE = "https://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion"

def fetch_champion_data(riot_name):
    """Fetch champion JSON from Riot API"""
    url = f"{API_BASE}/{riot_name}.json"
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read())
            return data['data'][riot_name]
    except Exception as e:
        print(f"Error fetching {riot_name}: {e}")
        return None

def extract_spell_names(champ_data):
    """Extract spell image names from champion data"""
    result = {
        'passive': champ_data['passive']['image']['full'],
        'q': champ_data['spells'][0]['image']['full'],
        'w': champ_data['spells'][1]['image']['full'],
        'e': champ_data['spells'][2]['image']['full'],
        'r': champ_data['spells'][3]['image']['full']
    }
    return result

# Read current cards.js to compare
with open('src/data/cards.js', 'r', encoding='utf-8') as f:
    cards_content = f.read()

print("=" * 80)
print("RIOT DATA DRAGON API SPELL NAME AUDIT")
print("=" * 80)

mismatches = []

for riot_id, our_id in CHAMPIONS.items():
    print(f"\n{our_id} ({riot_id}):")
    champ_data = fetch_champion_data(riot_id)
    
    if not champ_data:
        continue
    
    api_spells = extract_spell_names(champ_data)
    
    # Check each spell
    for ability in ['q', 'w', 'e', 'r']:
        card_id = f"{our_id}{ability.upper()}"
        api_image = api_spells[ability]
        
        # Find in cards.js
        pattern = rf"{card_id}:.*?img:\s*`\${{SPELL_URL}}/([^`]+)`"
        match = re.search(pattern, cards_content, re.DOTALL)
        
        if match:
            current_image = match.group(1)
            if current_image != api_image:
                print(f"  ❌ {card_id}: {current_image} → {api_image}")
                mismatches.append({
                    'card': card_id,
                    'current': current_image,
                    'correct': api_image
                })
            else:
                print(f"  ✅ {card_id}: {api_image}")
        else:
            print(f"  ⚠️  {card_id}: NOT FOUND in cards.js")
    
    # Check passive if exists
    passive_id = f"{our_id}Passive"
    api_passive = api_spells['passive']
    pattern = rf"{passive_id}:.*?img:\s*`\${{SPELL_URL}}/([^`]+)`"
    match = re.search(pattern, cards_content, re.DOTALL)
    if match:
        current_image = match.group(1)
        if current_image != api_passive:
            print(f"  ❌ {passive_id}: {current_image} → {api_passive}")
            mismatches.append({
                'card': passive_id,
                'current': current_image,
                'correct': api_passive
            })
        else:
            print(f"  ✅ {passive_id}: {api_passive}")

print("\n" + "=" * 80)
print(f"SUMMARY: {len(mismatches)} mismatches found")
print("=" * 80)

if mismatches:
    print("\nMismatches to fix:")
    for m in mismatches:
        print(f"  {m['card']}: {m['current']} → {m['correct']}")
    
    # Save to file for reference
    with open('spell_name_mismatches.json', 'w', encoding='utf-8') as f:
        json.dump(mismatches, f, indent=2, ensure_ascii=False)
    print("\nSaved to: spell_name_mismatches.json")
else:
    print("\n✅ All spell names match Riot API!")
