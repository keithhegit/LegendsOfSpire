import re

file_path = r'c:\Users\Og\Desktop\lolsprire\legends-spire-clean\src\data\cards.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# The pattern we see is:
# // Neutral_XXX
# {
#   id: 'Neutral_XXX',
#   ...
# },

# We want to change the `{` to `Neutral_XXX: {`
# But we need to be careful not to break existing valid entries.
# Existing valid entries look like:
# Neutral_001: { id:'Neutral_001', ... },

# The invalid ones start around line 180 and look like:
# {
#   id: 'Neutral_041',

# Let's use a regex to find these blocks.
# We look for `id: 'Neutral_(\d+)'` inside a block that doesn't have a key.

lines = content.split('\n')
new_lines = []

for i, line in enumerate(lines):
    # Check if this line is just "{" and the next few lines contain "id: 'Neutral_XXX'"
    if line.strip() == '{':
        # Look ahead to find the ID
        found_id = None
        for j in range(1, 5): # Check next 4 lines
            if i + j < len(lines):
                next_line = lines[i+j]
                match = re.search(r"id:\s*['\"](Neutral_\d+)['\"]", next_line)
                if match:
                    found_id = match.group(1)
                    break
        
        if found_id:
            # Check if the previous line was already a key (unlikely given the error)
            # But let's just replace "{" with "found_id: {"
            new_lines.append(f"  {found_id}: {{")
        else:
            new_lines.append(line)
    else:
        new_lines.append(line)

new_content = '\n'.join(new_lines)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Fixed cards.js syntax.")
