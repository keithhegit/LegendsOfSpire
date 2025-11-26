"""
Batch fix all spell name mismatches found by audit
"""
import re
import json

# Load mismatches
with open('spell_name_mismatches.json', 'r', encoding='utf-8') as f:
    mismatches = json.load(f)

# Read cards.js
with open('src/data/cards.js', 'r', encoding='utf-8') as f:
    content = f.read()

print("Fixing spell name mismatches...")
fixed_count = 0

for mismatch in mismatches:
    card_id = mismatch['card']
    current = mismatch['current']
    correct = mismatch['correct']
    
    # Find and replace the image URL
    pattern = rf"({card_id}:.*?img:\s*`\${{SPELL_URL}}/)({re.escape(current)})`"
    
    def replacer(match):
        return match.group(1) + correct + '`'
    
    new_content, count = re.subn(pattern, replacer, content, flags=re.DOTALL)
    
    if count > 0:
        content = new_content
        fixed_count += count
        print(f"  ✅ {card_id}: {current} → {correct}")
    else:
        print(f"  ⚠️  {card_id}: Pattern not found")

# Write back
with open('src/data/cards.js', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n✅ Fixed {fixed_count} spell image names")
print("Updated: src/data/cards.js")
