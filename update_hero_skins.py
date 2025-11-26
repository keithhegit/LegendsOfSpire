import json
import os

# Load JSON data
with open('hero_skins_data.json', 'r', encoding='utf-8') as f:
    skins_data = json.load(f)

CHAMPION_IDS = [
    'Garen', 'Darius', 'Lux', 'Jinx', 'Yasuo', 'Sona', 'Ekko', 'Sylas', 
    'Urgot', 'Viktor', 'Riven', 'CardMaster', 'LeeSin', 'Vayne', 'Teemo', 
    'Zed', 'Nasus', 'Irelia', 'Thresh', 'Katarina'
]

ID_MAPPING = {
    'CardMaster': 'TwistedFate',
}

output_js = """// Convert hero skins JSON to JS module
export const HERO_SKINS = {
"""

for cid in CHAMPION_IDS:
    json_key = ID_MAPPING.get(cid, cid)
    
    if json_key not in skins_data:
        print(f"Warning: {json_key} not found in skins data")
        continue
        
    data = skins_data[json_key]
    name = data['name']
    title = data['title']
    
    # Avatar URL (using json_key for filename)
    avatar = f"https://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/{json_key}.png"
    
    # Skins - take up to 8 skins for variety
    skins = data['skins'][:8]
    
    skins_js = "[\n"
    for skin in skins:
        # Escape single quotes in names
        safe_name = skin['name'].replace("'", "\\'")
        skins_js += f"            {{ name: '{safe_name}', splashUrl: '{skin['splashUrl']}', loadingUrl: '{skin['loadingUrl']}' }},\n"
    skins_js += "        ]"

    output_js += f"""    {cid}: {{
        id: '{cid}',
        name: '{name}',
        title: '{title}',
        avatar: '{avatar}',
        skins: {skins_js}
    }},
"""

output_js += """};

export const HERO_LIST = Object.values(HERO_SKINS);
"""

with open('src/data/heroSkins.js', 'w', encoding='utf-8') as f:
    f.write(output_js)

print("Successfully updated src/data/heroSkins.js with 20 heroes.")
