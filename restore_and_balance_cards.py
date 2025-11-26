import re
import os

backup_path = r'c:\Users\Og\Desktop\lolsprire\legends-spire-clean\src\data\cards_backup.js'
target_path = r'c:\Users\Og\Desktop\lolsprire\legends-spire-clean\src\data\cards.js'

# P0 + P1 Adjustments
adjustments = {
    # P0 Nerfs
    'GarenQ': {'value': 6},
    'GarenE': {'value': 14},
    'DariusQ': {'value': 6},
    'DariusR': {'value': 18},
    'LuxQ': {'value': 8},
    'LuxR': {'value': 28},
    
    # P0 Buffs
    'ZedQ': {'value': 11},
    'ZedE': {'value': 8},
    'ZedW': {'effectValue': 75},
    'TeemoQ': {'value': 8},
    'TeemoE': {'effectValue': 5},
    'TeemoR': {'effectValue': 15},
    'KatarinaQ': {'value': 10},
    'KatarinaW': {'value': 9},
    'KatarinaE': {'value': 7},
    'VayneQ': {'value': 6},
    'VayneE': {'value': 8},
    'VaynePassive': {'effectValue': 15},
    'CardMasterQ': {'value': 8},
    'CardMasterW': {'value': 7},
    
    # P1 Adjustments
    'JinxQ': {'value': 8},
    'UrgotQ': {'value': 6},
    'IreliaQ': {'value': 8},
    'EkkoQ': {'value': 8}
}

with open(backup_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip_next_brace = False

for i, line in enumerate(lines):
    stripped = line.strip()
    
    # 1. Fix Syntax: Add keys for Neutral cards
    # Pattern: just "{" on a line, followed by "id: 'Neutral_XXX'"
    if stripped == '{':
        # Look ahead for id
        found_id = None
        for j in range(1, 5):
            if i + j < len(lines):
                next_line = lines[i+j]
                match = re.search(r"id:\s*['\"](Neutral_\d+)['\"]", next_line)
                if match:
                    found_id = match.group(1)
                    break
        
        if found_id:
            new_lines.append(f"  {found_id}: {{\n")
        else:
            new_lines.append(line)
        continue
        
    # 2. Apply Balance Adjustments
    # Pattern: "  Key: { ... value:X, ... }"
    # We need to parse the key and replace value/effectValue
    
    # Check if line starts with a key in our adjustments
    # Regex to capture key at start of line
    key_match = re.match(r"\s*(\w+):\s*\{", line)
    if key_match:
        key = key_match.group(1)
        if key in adjustments:
            changes = adjustments[key]
            # Replace value:X
            if 'value' in changes:
                line = re.sub(r"value:\s*\d+", f"value:{changes['value']}", line)
            # Replace effectValue:X
            if 'effectValue' in changes:
                line = re.sub(r"effectValue:\s*\d+", f"effectValue:{changes['effectValue']}", line)
            
            print(f"Applied adjustments for {key}: {changes}")
    
    new_lines.append(line)

with open(target_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Successfully restored and balanced cards.js")
