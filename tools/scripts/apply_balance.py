import json
import re
import argparse
import sys

def load_config(config_path):
    with open(config_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def process_card_buffer(buffer, card_id, config, changes_log):
    """
    Process a buffered card block:
    1. Check if it should be pruned.
    2. Apply adjustments if needed.
    Returns (lines_to_write, was_pruned)
    """
    if not buffer:
        return [], False

    # 1. Pruning Logic
    prune_range = config.get('prune_range', {})
    prune_start = prune_range.get('start')
    prune_end = prune_range.get('end')
    
    if prune_start and prune_end and card_id.startswith('Neutral_'):
        try:
            # Extract number from Neutral_XXX
            num = int(card_id.split('_')[1])
            start_num = int(prune_start.split('_')[1])
            end_num = int(prune_end.split('_')[1])
            
            if start_num <= num <= end_num:
                changes_log.append(f"Pruned {card_id}")
                return [], True
        except:
            pass

    # 2. Adjustments Logic
    adjustments = config.get('adjustments', {})
    if card_id in adjustments:
        card_changes = adjustments[card_id]
        new_buffer = []
        block_str = "".join(buffer)
        
        # Apply changes to the block string using regex
        for key, val in card_changes.items():
            if key == 'value':
                if re.search(r"value:\s*\d+", block_str):
                    block_str = re.sub(r"(value:\s*)\d+", f"\\g<1>{val}", block_str)
            elif key == 'cost':
                if re.search(r"cost:\s*\d+", block_str):
                    block_str = re.sub(r"(cost:\s*)\d+", f"\\g<1>{val}", block_str)
            elif key == 'img':
                # Handle image replacement
                # val is like "${SPELL_URL}/Vayne_NightHunter.png"
                # We want to extract the filename if possible, or replace the whole template string
                if '${SPELL_URL}/' in val:
                    filename = val.split('/')[-1]
                    # Replace `...` content inside img: `...`
                    # Look for img: `${SPELL_URL}/...`
                    block_str = re.sub(r"(img:\s*`\$\{SPELL_URL\}/)[^`]+(`)", f"\\g<1>{filename}\\g<2>", block_str)

        if block_str != "".join(buffer):
            changes_log.append(f"Adjusted {card_id}")
            # Split back to lines, keeping newlines
            # This might be tricky if regex changed line counts, but here we just replaced values.
            # splitlines(True) keeps ends
            return block_str.splitlines(True), False

    return buffer, False

def apply_balance(content, config):
    lines = content.splitlines(True) # Keep line endings
    output_lines = []
    changes_log = []
    
    # Regex to detect start of a card property
    # Matches "  Key: {" or "Key: {"
    card_start_pattern = re.compile(r"^\s*(\w+):\s*\{")
    
    current_card_id = None
    current_card_buffer = []
    
    # We need to preserve the header (imports, etc.) until the first card
    # The first card usually starts inside "export const CARD_DATABASE = {"
    # But our buffer logic assumes we are inside the object?
    # Actually, we can just treat everything before the first match as pass-through.
    
    for line in lines:
        match = card_start_pattern.match(line)
        if match:
            # New card starting. Process previous buffer if it exists.
            if current_card_id:
                processed_lines, pruned = process_card_buffer(current_card_buffer, current_card_id, config, changes_log)
                output_lines.extend(processed_lines)
            else:
                # This is the first card, or we were flushing non-card lines?
                # If current_card_id was None, current_card_buffer contains header stuff?
                # No, header stuff shouldn't be in current_card_buffer if we only start buffering on match.
                # We need to handle non-card lines (comments, headers, closing braces).
                output_lines.extend(current_card_buffer)
            
            # Start new card
            current_card_id = match.group(1)
            current_card_buffer = [line]
        else:
            if current_card_id:
                current_card_buffer.append(line)
            else:
                output_lines.append(line)
    
    # Process final buffer
    if current_card_id:
        processed_lines, pruned = process_card_buffer(current_card_buffer, current_card_id, config, changes_log)
        output_lines.extend(processed_lines)
    else:
        output_lines.extend(current_card_buffer)

    return "".join(output_lines), changes_log

def main():
    parser = argparse.ArgumentParser(description='Apply card balance changes')
    parser.add_argument('--config', required=True, help='Path to balance_inputs.json')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes')
    parser.add_argument('--write', action='store_true', help='Write changes to file')
    
    args = parser.parse_args()
    
    config = load_config(args.config)
    
    with open('src/data/cards.js', 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content, changes = apply_balance(content, config)
    
    print(f"Proposed Changes ({len(changes)}):")
    # Group prunes
    prunes = [c for c in changes if c.startswith("Pruned")]
    adjusts = [c for c in changes if c.startswith("Adjusted")]
    
    if prunes:
        print(f" - Pruned {len(prunes)} cards (Neutral_047 to Neutral_120)")
    for adj in adjusts:
        print(f" - {adj}")
        
    if args.write:
        with open('src/data/cards.js', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("✅ Changes written to src/data/cards.js")
    elif args.dry_run:
        print("🔍 Dry run complete. No files changed.")
    else:
        print("⚠️  No action taken. Use --write to apply changes.")

if __name__ == '__main__':
    main()
