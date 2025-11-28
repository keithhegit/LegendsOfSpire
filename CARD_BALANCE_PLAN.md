# Card Balance & Pruning Plan (v0.9.2)

## 1. Overview
This update focuses on cleaning up the card pool and establishing a solid numerical baseline for future balancing.

- **Total Changes**: ~150 cards affected.
- **Pruning**: Removed 147 procedural/placeholder neutral cards (`Neutral_047` - `Neutral_120`).
- **Adjustments**: Targeted nerfs to overperforming cards.

## 2. Specific Changes

### 🛑 Pruning (Removed)
- **Range**: `Neutral_047` to `Neutral_120`
- **Reason**: These cards were procedurally generated placeholders with generic names ("坚韧不拔7", "破甲斩8") and repetitive effects that diluted the card pool.
- **Impact**: Neutral card pool reduced from ~160 to ~50 high-quality cards.

### ⚖️ Balance Adjustments

#### Nasus
- **[NERF] NasusQ (汲魂痛击)**
  - **Old**: 1 Cost, 8 Damage, +1 Permanent Strength on Kill.
  - **New**: 1 Cost, **6 Damage**, +1 Permanent Strength on Kill.
  - **Reason**: The infinite scaling potential is too strong for a 1-cost card with standard damage. Reducing base damage makes the "stacking" mini-game harder to execute early game.

#### Vayne
- **[FIX] VaynePassive (圣银弩箭)**
  - **Change**: Updated image resource to `Vayne_NightHunter.png`.
  - **Reason**: Fixed missing asset reference.

## 3. Baseline Model (v2)
We have established the following baseline for **1 Mana** cards:
- **Damage**: 9
- **Block**: 8
- **Draw**: 2
- **Heal**: 4 (Premium)

Future cards will be balanced against this model, with multipliers for rarity and conditionality.
