"""
Audit all hero cards to find missing definitions and incorrect images
"""
import re

# Read champions.js
with open('src/data/champions.js', 'r', encoding='utf-8') as f:
    champ_content = f.read()

# Read cards.js
with open('src/data/cards.js', 'r', encoding='utf-8') as f:
    cards_content = f.read()

# Extract all initialCards from champions
initial_cards_pattern = r"initialCards:\s*\[(.*?)\]"
matches = re.findall(initial_cards_pattern, champ_content, re.DOTALL)

required_cards = set()
for match in matches:
    cards = re.findall(r"'([^']+)'", match)
    required_cards.update(cards)

# Extract defined card IDs
defined_pattern = r"(\w+):\s*\{\s*id:\s*'\1'"
defined_cards = set(re.findall(defined_pattern, cards_content))

# Basic cards
basic_cards = {'Strike', 'Defend', 'Heal', 'Ignite'}

# Find missing
missing = required_cards - defined_cards - basic_cards

print("=== MISSING HERO CARDS ===")
if missing:
    for card in sorted(missing):
        print(f"  {card}")
    print(f"\nTotal missing: {len(missing)}")
else:
    print("  None found")

print("\n=== CARDS USING GENERIC STRIKE.PNG ===")
strike_pattern = r"(\w+Q|W|E|R):\s*\{[^}]*hero:\s*'(\w+)'[^}]*img:[^}]*Strike\.png"
strike_matches = re.findall(strike_pattern, cards_content)
for card_id, hero in strike_matches:
    print(f"  {card_id} (Hero: {hero})")

print("\n=== AUDIT COMPLETE ===")
