"""
Fetch all hero skin data from Riot Data Dragon API
"""
import urllib.request
import json

CHAMPIONS = [
    'Garen', 'Darius', 'Lux', 'Jinx', 'Yasuo', 'Sona', 'Ekko', 'Sylas',
    'Urgot', 'Viktor', 'Riven', 'TwistedFate', 'LeeSin', 'Vayne', 
    'Teemo', 'Zed', 'Nasus', 'Irelia', 'Thresh', 'Katarina'
]

API_BASE = "https://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion"

all_skins = {}

for champ in CHAMPIONS:
    url = f"{API_BASE}/{champ}.json"
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read())
            champ_data = data['data'][champ]
            
            skins = []
            for skin in champ_data['skins']:
                skins.append({
                    'id': skin['id'],
                    'num': skin['num'],
                    'name': skin['name'],
                    'splashUrl': f"https://ddragon.leagueoflegends.com/cdn/img/champion/splash/{champ}_{skin['num']}.jpg",
                    'loadingUrl': f"https://ddragon.leagueoflegends.com/cdn/img/champion/loading/{champ}_{skin['num']}.jpg"
                })
            
            all_skins[champ] = {
                'name': champ_data['name'],
                'title': champ_data['title'],
                'skins': skins
            }
            print(f"✅ {champ}: {len(skins)} skins")
    except Exception as e:
        print(f"❌ {champ}: {e}")

# Save to JSON
with open('hero_skins_data.json', 'w', encoding='utf-8') as f:
    json.dump(all_skins, f, indent=2, ensure_ascii=False)

print(f"\n✅ Saved {len(all_skins)} heroes to hero_skins_data.json")
