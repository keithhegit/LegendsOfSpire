"""
Fix all broken neutral card images by replacing with valid summoner spells
"""
import re

# Replacement mapping
REPLACEMENTS = {
    'SummonerIgnite.png': 'SummonerDot.png',
    'SummonerClarity.png': 'SummonerMana.png',
    'SummonerGhost.png': 'SummonerHaste.png',
    'SummonerClairvoyance.png': 'SummonerFlash.png'
}

# Read cards.js
with open('src/data/cards.js', 'r', encoding='utf-8') as f:
    content = f.read()

print("Fixing broken neutral card images...")
print("=" * 60)

fixed_count = 0

for old_img, new_img in REPLACEMENTS.items():
    # Replace in SPELL_URL context
    old_pattern = re.escape(f'${{SPELL_URL}}/{old_img}')
    new_text = f'${{SPELL_URL}}/{new_img}'
    
    count = content.count(old_pattern)
    if count > 0:
        content = content.replace(old_pattern, new_text)
        fixed_count += count
        print(f"  ✅ {old_img} → {new_img} ({count} occurrences)")

# Fix duplicate VaynePassive issue - remove the old one with wrong image
print("\nFixing duplicate VaynePassive...")
# Find and remove the first VaynePassive (the one with wrong image)
pattern = r"  VaynePassive: \{ id: 'VaynePassive'.*?price: 0 \},\r?\n"
matches = list(re.finditer(pattern, content, re.DOTALL))

if len(matches) >= 2:
    # Remove the first one (line 94 area, old definition)
    first_match = matches[0]
    content = content[:first_match.start()] + content[first_match.end():]
    print(f"  ✅ Removed duplicate VaynePassive definition")
    fixed_count += 1

# Write back
with open('src/data/cards.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n" + "=" * 60)
print(f"✅ Fixed {fixed_count} issues")
print("Updated: src/data/cards.js")
