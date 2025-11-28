# Phase 5 QA Playtest Plan

## 1. Objective
Verify that the recent card pruning and balance adjustments have not broken the game, and that all remaining cards function as intended.

## 2. Test Environment
- **Branch**: `card_balance`
- **URL**: `http://localhost:5173` (Local) or Deployed URL
- **Tools**: Browser DevTools (Console)

## 3. Test Scenarios

### Scenario A: Deck Integrity (Pruning Check)
**Goal**: Ensure no "Undefined" or broken cards appear in the game.
1.  **Start New Game**: Select any hero.
2.  **Check Deck**: Open Deck View. Ensure all initial cards are visible and have correct images.
3.  **Shop/Rewards**: Play until a card reward or shop.
    -   Verify that offered cards are NOT from the pruned range (`Neutral_047` - `Neutral_120`).
    -   Verify that card names are unique and descriptive (no "坚韧不拔7").

### Scenario B: Hero Specific Checks (Balance Check)

#### Nasus
1.  **Select Nasus**.
2.  **Draw NasusQ**.
3.  **Verify Stats**: Hover card. Damage should be **6** (plus Strength).
4.  **Execute**: Kill an enemy with NasusQ.
5.  **Verify Scaling**: Check if Strength increases permanently (or for combat).

#### Vayne
1.  **Select Vayne**.
2.  **Check Passive**: Look at the passive icon/description.
3.  **Verify Image**: Should be `Vayne_NightHunter.png` (not broken).

### Scenario C: General Gameplay
1.  **Combat**: Play 3 full combats.
2.  **Map**: Traverse 5 nodes.
3.  **Rest**: Use a Rest site.

## 4. Reporting
- Log any errors found in the console.
- Screenshot any missing assets.
- Update `reports/phase5_playtests/` with findings.
