"""
Add img field to all champions in champions.js
"""
import re

# Read champions.js
with open('src/data/champions.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Process each line
output = []
for i, line in enumerate(lines):
    output.append(line)
    
    # If this line contains avatar, add img field after it
    if 'avatar:' in line and 'CDN_URL' in line:
        # Extract champion name from avatar path
        match = re.search(r'/champion/(\w+)\.png', line)
        if match:
            champ_name = match.group(1)
            indent = line[:len(line) - len(line.lstrip())]
            img_line = f"{indent}img: `${{LOADING_URL}}/{champ_name}_0.jpg`,\n"
            output.append(img_line)

# Write back
with open('src/data/champions.js', 'w', encoding='utf-8') as f:
    f.writelines(output)

print("✅ Added img fields to all champions in champions.js")
