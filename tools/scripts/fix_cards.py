import re

source_path = r"C:\Users\Og\Desktop\lolsprire\legends-spire-clean\new\PLAN-B\card.js"
target_path = r"C:\Users\Og\Desktop\lolsprire\legends-spire-clean\src\data\cards.js"

with open(source_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
header = "import { SPELL_URL } from './constants.js';\n\n"

# Fix the broken object keys
# Pattern: Look for lines that look like `// Neutral_XXX` followed by `{`
# and replace `{` with `Neutral_XXX: {`

lines = content.split('\n')
fixed_lines = []
last_comment_id = None

for i, line in enumerate(lines):
    stripped = line.strip()
    
    # Check for comment with ID
    match_comment = re.match(r'//\s*(Neutral_\d+)', stripped)
    if match_comment:
        last_comment_id = match_comment.group(1)
        fixed_lines.append(line)
        continue
        
    # Check for start of object
    if stripped == '{':
        if last_comment_id:
            # Check if the next line already has the key (it shouldn't in the broken part)
            # But let's be safe.
            # Actually, the broken part is:
            # // Neutral_041
            # {
            #   id: 'Neutral_041',
            
            # We want to change `{` to `Neutral_041: {`
            fixed_lines.append(f"  {last_comment_id}: {{")
            last_comment_id = None # Reset
        else:
            fixed_lines.append(line)
    else:
        # If we encounter a line that is NOT `{` and we have a pending ID, 
        # it might mean the comment wasn't immediately followed by `{` or it's already correct.
        # But in the file structure, it seems consistent.
        # However, we should check if the line is `Neutral_XXX: {` (already correct)
        if last_comment_id and stripped.startswith(last_comment_id + ":"):
             last_comment_id = None
             
        fixed_lines.append(line)

fixed_content = '\n'.join(fixed_lines)

# Remove the original export line if we want to prepend our own or just use it
# The original file has `export const CARD_DATABASE = {`
# We just prepend the import.

final_content = header + fixed_content

with open(target_path, 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Successfully migrated cards.js")
