"""
Check which summoner spell images actually exist in Riot API
"""
import urllib.request

SUMMONER_SPELLS = [
    'SummonerBarrier',
    'SummonerBoost',  # Cleanse
    'SummonerDot',  # Ignite
    'SummonerExhaust',
    'SummonerFlash',
    'SummonerHaste',  # Ghost
    'SummonerHeal',
    'SummonerMana',  # Clarity
    'SummonerSmite',
    'SummonerTeleport',
    'SummonerSnowball',  # ARAM snowball
    # Old/Legacy
    'SummonerIgnite',
    'SummonerClarity',
    'SummonerGhost',
    'SummonerClairvoyance'
]

print("Checking which summoner spell images exist in Riot CDN...")
print("=" * 60)

valid_spells = []
invalid_spells = []

for spell in SUMMONER_SPELLS:
    url = f"https://ddragon.leagueoflegends.com/cdn/13.1.1/img/spell/{spell}.png"
    try:
        req = urllib.request.Request(url, method='HEAD')
        urllib.request.urlopen(req)
        valid_spells.append(spell)
        print(f"✅ {spell}.png exists")
    except:
        invalid_spells.append(spell)
        print(f"❌ {spell}.png NOT FOUND")

print("\n" + "=" * 60)
print(f"Valid: {len(valid_spells)}")
print(f"Invalid: {len(invalid_spells)}")

if invalid_spells:
    print("\n需要替换的图片:")
    print(f"  {', '.join(invalid_spells)}")
    
print("\n建议替换方案:")
print("  SummonerIgnite → SummonerDot")
print("  SummonerClarity → SummonerMana")
print("  SummonerGhost → SummonerHaste")
print("  SummonerClairvoyance → SummonerFlash")
